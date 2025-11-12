# 🎯 Integração Completa — Contador de Mensagens Não Lidas (WhatsApp Style)

## 📊 Arquitetura Visual

```
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO A (Browser 1)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatInput                                           │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ "Olá, tudo bem?"                            │   │   │
│  │  │ [Enviar]                                     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                       │   │
│  │  socket.emit("enviar_mensagem", {                   │   │
│  │    remetenteId: 1,                                  │   │
│  │    destinatarioId: 2,                               │   │
│  │    conteudo: "Olá, tudo bem?"                       │   │
│  │  })                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ↓ Socket.io                        │
│                                                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ BACKEND (Node.js)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   registerChatHandlers.ts                     │
│                                                                │
│  socket.on("enviar_mensagem", async (data) => {             │
│    // 💾 Salva no banco com lida: false                      │
│    const msg = await prisma.mensagem.create({               │
│      data: { ...data, lida: false }                         │
│    })                                                         │
│                                                                │
│    // 📤 Emite para ambos                                    │
│    io.to(socketA).emit("nova_mensagem", msg)                │
│    io.to(socketB).emit("nova_mensagem", msg)                │
│                                                                │
│    // 🔔 Conta e envia atualização ao B                      │
│    const naoLidas = await prisma.mensagem.count({           │
│      where: { destinatarioId: 2, lida: false }              │
│    })                                                         │
│                                                                │
│    io.to(socketB).emit("atualizar_nao_lidas", {            │
│      remetenteId: 1,                                         │
│      total: naoLidas  // Exemplo: 1                         │
│    })                                                         │
│  })                                                           │
│                                                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓ Socket.io
                           │
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO B (Browser 2)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  useChatSocket Hook                                 │   │
│  │                                                       │   │
│  │  socket.on("atualizar_nao_lidas", ({               │   │
│  │    remetenteId: 1,                                  │   │
│  │    total: 1                                         │   │
│  │  }) => {                                            │   │
│  │    setContadorNaoLidas({                           │   │
│  │      ...prev,                                       │   │
│  │      [1]: 1  // Atualiza para User A              │   │
│  │    })                                               │   │
│  │  })                                                  │   │
│  │                                                       │   │
│  │  retorna: { contadorNaoLidas: { 1: 1 } }            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatModal → ChatList                               │   │
│  │                                                       │   │
│  │  {contadorNaoLidas = { 1: 1 }}                     │   │
│  │                                                       │   │
│  │  usuarios.map((u) => (                             │   │
│  │    {u.id === 1 && (                                │   │
│  │      <div>                                           │   │
│  │        <img src={avatar} />                         │   │
│  │        <span>User A</span>                          │   │
│  │                                                       │   │
│  │        {contadorNaoLidas[1] > 0 && (               │   │
│  │          <span className="!bg-green-500">1</span>  │   │
│  │        )}    ← BOLINHA VERDE COM "1"                │   │
│  │      </div>                                          │   │
│  │    )}                                                │   │
│  │  ))                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ✅ Bolinha verde mostrando "1" mensagem não lida             │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fase 2 — Quando User B Abre o Chat

```
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO B (Browser 2)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatList                                            │   │
│  │  - User A  ← Bolinha: "1"                            │   │
│  │  [Clique em User A]                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatModal.useEffect → carregarHistorico(1)          │   │
│  │                                                       │   │
│  │  socket.emit("carregar_historico", {                │   │
│  │    usuarioA: 2,                                      │   │
│  │    usuarioB: 1                                       │   │
│  │  })                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ↓ Socket.io                        │
│                                                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ BACKEND (Node.js)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   registerChatHandlers.ts                     │
│                                                                │
│  socket.on("carregar_historico", async ({                   │
│    usuarioA: 2,                                              │
│    usuarioB: 1                                               │
│  }) => {                                                      │
│    // 📚 Busca histórico                                     │
│    const mensagens = await prisma.mensagem.findMany({       │
│      where: {                                                │
│        OR: [                                                 │
│          { remetenteId: 2, destinatarioId: 1 },            │
│          { remetenteId: 1, destinatarioId: 2 }             │
│        ]                                                     │
│      }                                                       │
│    })                                                        │
│                                                                │
│    // ✅ Marca mensagens de 1→2 como lidas                  │
│    await prisma.mensagem.updateMany({                       │
│      where: {                                                │
│        remetenteId: 1,        // Mensagens de User A        │
│        destinatarioId: 2,     // Para User B                 │
│        lida: false            // Que não foram lidas         │
│      },                                                      │
│      data: { lida: true }                                    │
│    })                                                        │
│                                                                │
│    // 🔔 Conta não lidas restantes para User B              │
│    const naoLidas = await prisma.mensagem.count({          │
│      where: {                                                │
│        destinatarioId: 2,                                    │
│        lida: false  // De todos os usuários                 │
│      }                                                       │
│    })                                                        │
│                                                                │
│    // 📤 Emite histórico                                    │
│    socket.emit("historico_carregado", mensagens)           │
│                                                                │
│    // 🔔 Emite atualização do contador                      │
│    io.to(socketB).emit("atualizar_nao_lidas", {           │
│      remetenteId: 1,                                        │
│      total: naoLidas  // Agora: 0 (pois marcou como lida)  │
│    })                                                        │
│  })                                                          │
│                                                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓ Socket.io
                           │
┌─────────────────────────────────────────────────────────────┐
│                     USUÁRIO B (Browser 2)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  useChatSocket Hook                                 │   │
│  │                                                       │   │
│  │  socket.on("atualizar_nao_lidas", ({               │   │
│  │    remetenteId: 1,                                  │   │
│  │    total: 0  ← NOVO VALOR (0)                      │   │
│  │  }) => {                                            │   │
│  │    setContadorNaoLidas({                           │   │
│  │      ...prev,                                       │   │
│  │      [1]: 0  ← Atualiza para 0                      │   │
│  │    })                                               │   │
│  │  })                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatList re-renderiza                              │   │
│  │                                                       │   │
│  │  {contadorNaoLidas[1] > 0 && (  ← FALSO (é 0)     │   │
│  │    <span>...</span>                                 │   │
│  │  )}                                                  │   │
│  │                                                       │   │
│  │  - User A  ← Bolinha DESAPARECE                     │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ✅ Bolinha desapareceu (naoLidas = 0)                       │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Código-Chave por Arquivo

### **useChatSocket.tsx**
```typescript
// State
const [contadorNaoLidas, setContadorNaoLidas] = useState<Record<number, number>>({});

// Listener
socket.on("atualizar_nao_lidas", ({ remetenteId, total }) => {
  console.log(`🔔 Atualizar não lidas - Remetente ${remetenteId}: ${total}`);
  setContadorNaoLidas(prev => ({ ...prev, [remetenteId]: total }));
});

// Emit ao carregar histórico
const carregarHistorico = useCallback(async (destinatarioId) => {
  socket.emit("carregar_historico", {
    usuarioA: usuarioId,
    usuarioB: destinatarioId,
  });
  // ... resto do código
}, [usuarioId]);

// Return
return { ..., contadorNaoLidas };
```

### **ChatList/index.tsx**
```typescript
// Props
interface ChatListProps {
  contadorNaoLidas?: Record<number, number>;
}

// Renderização
{contadorNaoLidas[u.id] > 0 && (
  <span className="!bg-green-500 !text-white !rounded-full ...">
    {contadorNaoLidas[u.id]}
  </span>
)}
```

### **ChatModal/index.tsx**
```typescript
// Extrair do hook
const { ..., contadorNaoLidas } = useChatSocket(usuarioLogadoId || undefined);

// Passar para ChatList
<ChatList
  {...props}
  contadorNaoLidas={contadorNaoLidas}
/>
```

---

## ✅ Status Final

| Componente | Status | Descrição |
|-----------|--------|-----------|
| **useChatSocket** | ✅ Completo | State, listeners e emit implementados |
| **ChatList** | ✅ Completo | Bolinha renderiza/desaparece baseado em contador |
| **ChatModal** | ✅ Completo | Passa `contadorNaoLidas` para `ChatList` |
| **Backend (seu)** | ✅ Pronto | Emite `atualizar_nao_lidas` em momentos certos |
| **Testes** | ⏳ Pendente | Você deve testar com dois navegadores |

---

## 🎬 Próximas Ações

1. **Teste imediatamente:**
   - Abra dois navegadores (ou abas anônimas)
   - Login com usuários diferentes
   - Envie mensagens
   - Veja bolinha aparecer/desaparecer

2. **Se houver problema:**
   - Consulte `GUIA_DEBUG_CONTADOR_NAOLIDASS.md`
   - Verifique console (F12)
   - Procure por logs `🔔` ou `❌`

3. **Próximas features (opcionais):**
   - Animação de entrada/saída da bolinha
   - Som quando recebe mensagem não lida
   - Badge com cor diferente para mensagens muito antigas

---

**Implementação realizada:** 11 de novembro de 2025
**Padrão:** WhatsApp (bolinha verde com número)
**Status:** ✅ Pronto para teste

