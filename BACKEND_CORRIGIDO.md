# 🔧 Backend Corrigido - registerChatHandlers.ts

Copie e cole este código no seu arquivo `registerChatHandlers.ts`:

```typescript
import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Mapeia cada usuário conectado (userId → socketId)
const userSocketMap = new Map<number, string>();

// 🔹 Interface para contatos
interface Contato {
  id: number;
  nome: string;
  avatar: string;
  online: boolean;
  naoLidas: number;
}

export function registerChatHandlers(io: Server, socket: Socket) {
  console.log(`💬 [ChatSocket] Nova conexão ativa: ${socket.id}`);

  /**
   * 1️⃣ Registrar o usuário conectado
   */
  socket.on("registrar_usuario", async (userId: number) => {
    socket.data.userId = userId;
    userSocketMap.set(userId, socket.id);

    console.log(`✅ Usuário ${userId} vinculado ao socket ${socket.id}`);

    // 🔹 Notifica todos os usuários que este ficou online
    io.emit("user_online", { userId });
  });

  /**
   * 1️⃣B Obter lista de usuários online (sincronização inicial)
   */
  socket.on("get_online_users", () => {
    const onlineUserIds = Array.from(userSocketMap.keys());
    console.log(`📋 Enviando lista de usuários online:`, onlineUserIds);
    socket.emit("online_users_list", onlineUserIds);
  });

  /**
   * 2️⃣ Enviar mensagem privada (cliente ↔ corretor)
   */
  socket.on(
    "enviar_mensagem",
    async (data: {
      remetenteId?: number;
      destinatarioId: number;
      conteudo: string;
    }) => {
      try {
        const { destinatarioId, conteudo } = data;
        const remetenteId = socket.data.userId;

        if (!remetenteId) {
          console.warn("⚠️ Tentativa de enviar mensagem sem usuário registrado.");
          return socket.emit("erro_mensagem", { erro: "Usuário não registrado." });
        }

        if (!conteudo?.trim()) {
          return socket.emit("erro_mensagem", { erro: "Mensagem vazia" });
        }

        console.log(`📩 ${remetenteId} → ${destinatarioId}: ${conteudo}`);

        // 💾 Salva mensagem como não lida
        const novaMensagem = await prisma.mensagem.create({
          data: {
            remetenteId,
            destinatarioId,
            conteudo,
            lida: false,
          },
          include: {
            remetente: { select: { id: true, nome: true, avatarUrl: true, role: true } },
            destinatario: { select: { id: true, nome: true, avatarUrl: true, role: true } },
          },
        });

        // 🔹 Envia para ambos os lados em tempo real
        const remetenteSocketId = userSocketMap.get(remetenteId);
        const destinatarioSocketId = userSocketMap.get(destinatarioId);

        if (remetenteSocketId) io.to(remetenteSocketId).emit("nova_mensagem", novaMensagem);

        if (destinatarioSocketId) {
          io.to(destinatarioSocketId).emit("nova_mensagem", novaMensagem);

          // 🟢 Atualiza contador de mensagens não lidas DESSE REMETENTE
          const naoLidas = await prisma.mensagem.count({
            where: { remetenteId, destinatarioId, lida: false },
          });

          io.to(destinatarioSocketId).emit("atualizar_nao_lidas", {
            remetenteId,
            total: naoLidas,
          });
        } else {
          console.log(`⚠️ Usuário ${destinatarioId} está offline`);
        }

        // 🔁 Atualiza lista de conversas para ambos
        [remetenteId, destinatarioId].forEach((id) => {
          const socketId = userSocketMap.get(id);
          if (socketId) {
            const outro =
              id === remetenteId ? novaMensagem.destinatario : novaMensagem.remetente;

            io.to(socketId).emit("nova_mensagem_lista", {
              remetenteId,
              destinatarioId,
              conteudo,
              criadoEm: novaMensagem.criadoEm,
              nome: outro.nome,
              avatar: outro.avatarUrl || `https://i.pravatar.cc/100?u=${outro.id}`,
            });
          }
        });
      } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error);
        socket.emit("erro_mensagem", { erro: "Falha ao enviar mensagem." });
      }
    }
  );

  /**
   * ✍️ 3️⃣ Indicação de digitação (digitando... / parou)
   */
  socket.on("digitando", (data: { remetenteId: number; destinatarioId: number }) => {
    const { remetenteId, destinatarioId } = data;
    const destinatarioSocketId = userSocketMap.get(destinatarioId);
    if (destinatarioSocketId) io.to(destinatarioSocketId).emit("usuario_digitando", remetenteId);
  });

  socket.on("parou_digitando", (data: { remetenteId: number; destinatarioId: number }) => {
    const { remetenteId, destinatarioId } = data;
    const destinatarioSocketId = userSocketMap.get(destinatarioId);
    if (destinatarioSocketId) io.to(destinatarioSocketId).emit("usuario_parou_digitando", remetenteId);
  });

  /**
   * 4️⃣ Carregar histórico e marcar mensagens como lidas
   * 
   * ✅ CORRIGIDO: Agora conta apenas mensagens não lidas DO REMETENTE ESPECÍFICO
   */
  socket.on("carregar_historico", async ({ usuarioA, usuarioB }: { usuarioA: number; usuarioB: number }) => {
    try {
      console.log(`📚 Carregando histórico entre ${usuarioA} e ${usuarioB}...`);

      const mensagens = await prisma.mensagem.findMany({
        where: {
          OR: [
            { remetenteId: usuarioA, destinatarioId: usuarioB },
            { remetenteId: usuarioB, destinatarioId: usuarioA },
          ],
        },
        orderBy: { criadoEm: "asc" },
      });

      // ✅ Marca mensagens recebidas como lidas
      const atualizadas = await prisma.mensagem.updateMany({
        where: {
          remetenteId: usuarioB,
          destinatarioId: usuarioA,
          lida: false,
        },
        data: { lida: true },
      });

      console.log(`✅ ${atualizadas.count} mensagens marcadas como lidas`);

      // ✅ CORRIGIDO: Contar APENAS mensagens não lidas DESSE REMETENTE
      const socketId = userSocketMap.get(usuarioA);
      if (socketId) {
        const naoLidas = await prisma.mensagem.count({
          where: {
            remetenteId: usuarioB,        // ← ESPECÍFICO: apenas deste remetente
            destinatarioId: usuarioA,     // ← ESPECÍFICO: apenas para este destinatário
            lida: false,                  // ← Apenas não lidas
          },
        });

        console.log(`🔔 Enviando atualizar_nao_lidas para ${usuarioA}: ${naoLidas} não lidas de ${usuarioB}`);

        io.to(socketId).emit("atualizar_nao_lidas", {
          remetenteId: usuarioB,
          total: naoLidas, // ✅ Agora será 0 quando marcadas como lidas!
        });
      }

      socket.emit("historico_carregado", mensagens);
    } catch (error) {
      console.error("❌ Erro ao carregar histórico:", error);
      socket.emit("erro_historico", { erro: "Falha ao carregar histórico." });
    }
  });

  /**
   * 5️⃣ Listar contatos com contador de não lidas e status online
   */
  socket.on("listar_contatos", async ({ userId }: { userId: number }) => {
    try {
      const conversas = await prisma.mensagem.findMany({
        where: { OR: [{ remetenteId: userId }, { destinatarioId: userId }] },
        include: {
          remetente: { select: { id: true, nome: true, role: true, avatarUrl: true } },
          destinatario: { select: { id: true, nome: true, role: true, avatarUrl: true } },
        },
        orderBy: { criadoEm: "desc" },
      });

      const contatosMap = new Map<number, Contato>();

      for (const msg of conversas) {
        const outro = msg.remetente.id === userId ? msg.destinatario : msg.remetente;

        const naoLidas = await prisma.mensagem.count({
          where: { remetenteId: outro.id, destinatarioId: userId, lida: false },
        });

        contatosMap.set(outro.id, {
          id: outro.id,
          nome: outro.nome,
          avatar: outro.avatarUrl || `https://i.pravatar.cc/100?u=${outro.id}`,
          online: userSocketMap.has(outro.id),
          naoLidas,
        });
      }

      socket.emit("contatos_atualizados", Array.from(contatosMap.values()));
    } catch (error) {
      console.error("❌ Erro ao listar contatos:", error);
      socket.emit("erro_contatos", { erro: "Falha ao listar contatos." });
    }
  });

  /**
   * 6️⃣ Desconexão do usuário
   */
  socket.on("disconnect", () => {
    const userId = socket.data.userId;

    if (userId) {
      userSocketMap.delete(userId);
      io.emit("user_offline", { userId });
      console.log(`🔴 Usuário ${userId} desconectado`);
    } else {
      console.log(`🔴 Socket anônimo desconectado: ${socket.id}`);
    }
  });
}
```

---

## 📊 Mudança-Chave

### ❌ ANTES:
```typescript
const naoLidas = await prisma.mensagem.count({
  where: { destinatarioId: usuarioA, lida: false }, // ← Conta TUDO
});
```

### ✅ DEPOIS:
```typescript
const naoLidas = await prisma.mensagem.count({
  where: {
    remetenteId: usuarioB,       // ← Específico
    destinatarioId: usuarioA,    // ← Específico
    lida: false,                 // ← Apenas não lidas
  },
});
```

---

## 🧪 Teste

1. Cole o código corrigido
2. Restart do servidor Node.js
3. Teste em dois navegadores
4. Verifique console: deve aparecer `total: 0` quando marcadas como lidas

**Resultado esperado:**
```
✅ Selecionando contato: Kauany
🧹 Limpando contador local para Kauany
🔔 Enviando atualizar_nao_lidas para 1: 0 não lidas de 9  ← ZERO!
👁 Renderizando Kauany (ID: 9): 0 não lidas  ✅
```

---

**Pronto! Agora deve funcionar perfeitamente!** 🚀
