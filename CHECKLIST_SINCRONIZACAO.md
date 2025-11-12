# ✅ Checklist Final — Sincronização Contador Não Lidas

## 🎯 O que foi feito

### **Frontend (3 Arquivos)**

#### ✅ `src/hooks/useChatSocket.tsx`
- [x] State: `const [contadorNaoLidas, setContadorNaoLidas] = useState<Record<number, number>>({})`
- [x] Listener: `socket.on("atualizar_nao_lidas", ...)`
- [x] Emit: `socket.emit("carregar_historico", { usuarioA, usuarioB })`
- [x] **Debug logs adicionados** para rastrear eventos em tempo real
- [x] Return: `contadorNaoLidas` exposto

#### ✅ `src/components/ChatList/index.tsx`
- [x] Prop: `contadorNaoLidas?: Record<number, number>`
- [x] Renderização: Bolinha verde quando `naoLidas > 0`
- [x] **Debug logs adicionados** para rastrear render de cada contato

#### ✅ `src/components/ChatModal/index.tsx`
- [x] Extração: `const { ..., contadorNaoLidas } = useChatSocket(...)`
- [x] Propagação: `<ChatList ... contadorNaoLidas={contadorNaoLidas} />`

---

### **Backend (Seu código — já pronto)**

#### ✅ `registerChatHandlers.ts`

**Ao enviar mensagem:**
```typescript
// ✅ Marca como não lida
data: { ..., lida: false }

// ✅ Emite counter atualizado
io.to(destinatarioSocketId).emit("atualizar_nao_lidas", {
  remetenteId,
  total: naoLidas
});
```

**Ao carregar histórico:**
```typescript
// ✅ Marca como lida
await prisma.mensagem.updateMany({
  where: { remetenteId: usuarioB, destinatarioId: usuarioA, lida: false },
  data: { lida: true }
});

// ✅ Emite counter (total: 0 se não houver mais)
io.to(socketId).emit("atualizar_nao_lidas", {
  remetenteId: usuarioB,
  total: naoLidas
});
```

---

## 🧪 Como Testar (Passo a Passo Rápido)

### **Teste em 5 passos:**

```
1️⃣  Abra DevTools (F12) em AMBOS os navegadores
    └─ Console deve estar visível

2️⃣  User A envia mensagem para User B
    └─ Espere 1 segundo

3️⃣  Verifique console de User B:
    └─ Deve ter: "🔔 Evento 'atualizar_nao_lidas' recebido"
    └─ Bolinha verde "1" deve aparecer

4️⃣  User B clica em User A na ChatList
    └─ Verifique console:
       └─ "📤 Emitindo 'carregar_historico' ao backend..."
       └─ "🔔 Evento 'atualizar_nao_lidas' recebido: { remetenteId: 1, total: 0 }"

5️⃣  Resultado esperado:
    └─ Bolinha DESAPARECE
    └─ Chat abre com as mensagens
```

---

## 📊 Fluxo de Dados Simplificado

```
USER A ENVIA MENSAGEM
        ↓
SOCKET: "enviar_mensagem" ← Frontend emite
        ↓
BACKEND: Salva com lida: false
        ↓
BACKEND: Conta não lidas (total: 1)
        ↓
BACKEND: Emite "atualizar_nao_lidas" → Frontend
        ↓
FRONTEND: socket.on("atualizar_nao_lidas")
        ↓
FRONTEND: setContadorNaoLidas({ 1: 1 })
        ↓
CHATLIST: Re-renderiza com bolinha "1"
        
═════════════════════════════════════════

USER B ABRE O CHAT
        ↓
FRONTEND: Clica em User A
        ↓
CHATMODAL: Chama carregarHistorico(A_id)
        ↓
SOCKET: "carregar_historico" ← Frontend emite
        ↓
BACKEND: updateMany { lida: false → true }
        ↓
BACKEND: Conta novamente (total: 0)
        ↓
BACKEND: Emite "atualizar_nao_lidas { total: 0 }" → Frontend
        ↓
FRONTEND: socket.on("atualizar_nao_lidas")
        ↓
FRONTEND: setContadorNaoLidas({ 1: 0 })
        ↓
CHATLIST: Re-renderiza SEM bolinha
```

---

## 🔍 Debug Logs Esperados

### **Console de User B (quando User A envia mensagem):**

```
📩 Mensagem recebida: {remetenteId: 1, destinatarioId: 2, ...}
🔔 Evento 'atualizar_nao_lidas' recebido: {remetenteId: 1, total: 1}
📊 Estado do contador atualizado: {1: 1}
📍 ChatList renderizando User A (ID: 1): 1 não lidas
```

### **Console de User B (quando abre chat):**

```
📚 Carregando histórico entre 2 e 1...
📤 Emitindo 'carregar_historico' ao backend... {usuarioA: 2, usuarioB: 1}
✅ Histórico carregado (3 mensagens)
🔔 Evento 'atualizar_nao_lidas' recebido: {remetenteId: 1, total: 0}
📊 Estado do contador atualizado: {1: 0}
📍 ChatList renderizando User A (ID: 1): 0 não lidas
```

---

## ⚠️ Possíveis Problemas e Soluções

| Problema | Solução |
|----------|---------|
| **Bolinha não aparece** | Verifique se `🔔 Evento` aparece no console. Se não, backend não emitiu |
| **Bolinha não some** | Verifique se `📤 Emitindo 'carregar_historico'` aparece. Se sim, backend não retornou atualização |
| **Chat não abre** | Verifique se `isConnected = true` no hook. Socket pode estar desconectado |
| **Nada aparece no console** | Verifique se DevTools está aberto ANTES de fazer as ações |

---

## 🎯 Próximos Passos

### **Se tudo funcionar ✅**
1. Faça mais testes com 3+ usuários
2. Teste envio de múltiplas mensagens
3. Teste abrir/fechar chat repetidamente

### **Se algo não funcionar ❌**
1. Consulte `DEBUG_SINCRONIZACAO_COMPLETA.md`
2. Verifique logs do backend
3. Copie os logs do console e compartilhe

---

## 📞 Informações de Suporte

**Arquivo de Debug Completo:** `DEBUG_SINCRONIZACAO_COMPLETA.md`

**Arquivos Modificados:**
- `src/hooks/useChatSocket.tsx` ✅
- `src/components/ChatList/index.tsx` ✅
- `src/components/ChatModal/index.tsx` ✅ (sem alterações neste ciclo)

**Status:** 🟢 Pronto para teste

---

**Última atualização:** 11 de novembro de 2025

