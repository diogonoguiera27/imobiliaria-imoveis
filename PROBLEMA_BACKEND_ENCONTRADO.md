# 🔴 Problema Encontrado no Backend

## 🎯 Diagnóstico

Analisando seu console do frontend:
```
👁 Renderizando Kauany (ID: 9): 1 não lidas   ← AQUI! Ainda aparece 1
👁 Renderizando Neymar (ID: 17): 1 não lidas  ← AQUI! Ainda aparece 1
```

Você está clicando na conversa, a função `zerarContador()` executa, MAS o contador volta para `1` depois.

## 🔍 Problema no Backend

No arquivo `registerChatHandlers.ts`, função `carregar_historico`:

```typescript
socket.on("carregar_historico", async ({ usuarioA, usuarioB }) => {
  // ... marca como lida ...
  
  // ❌ ERRO AQUI:
  const naoLidas = await prisma.mensagem.count({
    where: { destinatarioId: usuarioA, lida: false }, // ← CONTANDO TODAS!
  });

  io.to(socketId).emit("atualizar_nao_lidas", {
    remetenteId: usuarioB,
    total: naoLidas, // ← Pode ser qualquer número, não apenas dessa conversa!
  });
});
```

### 🐛 O Problema Exato

Você tem 3 conversas não lidas:
- Kauany (9): 1 mensagem não lida
- Neymar (17): 1 mensagem não lida
- João (1): 0 mensagens não lidas

Quando você abre conversa com Kauany:

1. ✅ Frontend: `zerarContador(9)` → contador[9] = 0
2. ✅ Backend: Marca mensagens de Kauany como lidas
3. ❌ Backend: Conta TODAS as mensagens não lidas de TODOS os usuários
   - Total = 1 (de Neymar) + outras pendências
4. ❌ Backend: Envia `total: 1` MESMO SENDO A CONVERSA COM KAUANY!
5. ❌ Frontend: Recebe `atualizar_nao_lidas({ remetenteId: 9, total: 1 })`
6. ❌ Bolinha volta para 1!

---

## ✅ Solução

Você precisa contar **apenas as mensagens não lidas DESSE REMETENTE ESPECÍFICO**:

```typescript
socket.on("carregar_historico", async ({ usuarioA, usuarioB }: { usuarioA: number; usuarioB: number }) => {
  try {
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
    await prisma.mensagem.updateMany({
      where: {
        remetenteId: usuarioB,
        destinatarioId: usuarioA,
        lida: false,
      },
      data: { lida: true },
    });

    // ✅ CORRIGIDO: Conta apenas as mensagens não lidas DESSE REMETENTE
    const socketId = userSocketMap.get(usuarioA);
    if (socketId) {
      const naoLidas = await prisma.mensagem.count({
        where: { 
          remetenteId: usuarioB,        // ← ESPECIFICAR o remetente!
          destinatarioId: usuarioA,
          lida: false,
        },
      });

      io.to(socketId).emit("atualizar_nao_lidas", {
        remetenteId: usuarioB,
        total: naoLidas, // ← Agora será 0 para Kauany (correto!)
      });
    }

    socket.emit("historico_carregado", mensagens);
  } catch (error) {
    console.error("❌ Erro ao carregar histórico:", error);
    socket.emit("erro_historico", { erro: "Falha ao carregar histórico." });
  }
});
```

---

## 📊 Comparação

### ❌ ANTES (Errado)
```typescript
const naoLidas = await prisma.mensagem.count({
  where: { destinatarioId: usuarioA, lida: false }, // Conta TUDO
});
// Se tem 5 conversas não lidas, pode retornar 5!
```

### ✅ DEPOIS (Correto)
```typescript
const naoLidas = await prisma.mensagem.count({
  where: {
    remetenteId: usuarioB,      // Específico!
    destinatarioId: usuarioA,   // Específico!
    lida: false,                // Apenas não lidas
  },
});
// Retorna apenas as mensagens NÃO LIDAS DESSE REMETENTE
```

---

## 🎯 Resultado Esperado

**Antes da correção:**
```
👁 Renderizando Kauany (ID: 9): 1 não lidas  ❌ (deveria ser 0)
```

**Depois da correção:**
```
👁 Renderizando Kauany (ID: 9): 0 não lidas  ✅ (correto!)
```

---

## 📝 Implementação

Substitua a função `carregar_historico` no seu `registerChatHandlers.ts` pela versão corrigida acima.

**Chave da mudança:**
```diff
- where: { destinatarioId: usuarioA, lida: false }
+ where: { remetenteId: usuarioB, destinatarioId: usuarioA, lida: false }
```

---

## 🧪 Teste Agora

1. Abra em dois navegadores
2. Browser B envia mensagem para Browser A
3. Browser A clica na conversa
4. ✅ Bolinha deve desaparecer PERMANENTEMENTE
5. Volte para lista
6. ✅ Bolinha continua desaparecida

**Verifique no console:**
```
✅ Selecionando contato: Kauany
🧹 Limpando contador local para Kauany
👁 Renderizando Kauany (ID: 9): 0 não lidas  ← ZERO agora!
```

---

## 🚀 Resumo

| Componente | Problema | Solução |
|-----------|----------|---------|
| Frontend Hook | ✅ OK | Exporta `setContadorNaoLidas` |
| Frontend Modal | ✅ OK | Chama `zerarContador()` |
| Frontend List | ✅ OK | Renderiza com debug |
| **Backend Handler** | ❌ **ERRO** | Contar apenas do remetente específico |

**O backend é a raiz do problema!** Corrija e teste novamente. 🎯
