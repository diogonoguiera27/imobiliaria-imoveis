# 🟢 Guia: Sincronização de Status Online/Offline em Tempo Real

## 📋 Resumo do Problema

Você está logado em dois navegadores diferentes, mas ambos aparecem como **OFFLINE** mesmo estando dentro da conversa. O motivo é que:

1. ✅ Backend envia eventos `user_online` / `user_offline` corretamente
2. ❌ Frontend **não carrega a lista inicial** de usuários online ao conectar
3. ❌ Frontend só reage a **novos eventos**, não sincroniza com quem já estava online

---

## 🔧 Solução Implementada

### Etapa 1️⃣: Backend (Seu Node.js + Socket.IO)

Você precisa adicionar um **novo event listener** no arquivo `registerChatHandlers.ts`:

```typescript
/**
 * 1️⃣B Obter lista de usuários online (sincronização inicial)
 */
socket.on("get_online_users", () => {
  const onlineUserIds = Array.from(userSocketMap.keys());
  console.log(`📋 Enviando lista de usuários online:`, onlineUserIds);
  socket.emit("online_users_list", onlineUserIds);
});
```

**Onde adicionar?** Logo após o evento `registrar_usuario` (evento 1️⃣).

---

### Etapa 2️⃣: Frontend Hook (JÁ ATUALIZADO ✅)

O hook `useChatSocket.tsx` agora:

✅ **Solicita lista inicial** ao conectar:
```typescript
socket.emit("get_online_users");
```

✅ **Recebe a lista inicial**:
```typescript
socket.on("online_users_list", (userIds: number[]) => {
  console.log(`📋 Lista de usuários online recebida:`, userIds);
  setOnlineUsers(userIds);
});
```

✅ **Reage a eventos em tempo real**:
```typescript
socket.on("user_online", ({ userId }) => { ... });
socket.on("user_offline", ({ userId }) => { ... });
```

---

## ✅ Checklist para Funcionar

- [ ] Adicionar evento `get_online_users` no **backend**
- [ ] Reiniciar o **servidor Node.js**
- [ ] Abrir chat em **dois navegadores** diferentes
- [ ] Verificar console do navegador: deve aparecer `📋 Lista de usuários online recebida:`
- [ ] Status deve mostrar **"Online agora"** no cabeçalho
- [ ] Fechar um navegador → status deve mudar para **"Offline"**
- [ ] Abrir novamente → volta para **"Online agora"**

---

## 🐛 Debugging

Abra o **DevTools (F12)** e procure por estas mensagens no console:

```
✅ Usuário {id} vinculado ao socket
🟢 Usuário {id} ficou online
📋 Lista de usuários online recebida: [1, 2, 3...]
🔴 Usuário {id} ficou offline
```

Se não aparecerem:
1. Verifique se o backend tem o evento `get_online_users`
2. Verifique se há erro no console do Node.js
3. Verifique se as portas Socket.IO estão corretas

---

## 📁 Arquivos Modificados

- ✅ `src/hooks/useChatSocket.tsx` - Atualizado
- ⏳ `backend/registerChatHandlers.ts` - **PRECISA ADICIONAR** evento `get_online_users`
- ✅ `src/components/ChatHeader/index.tsx` - Já funciona
- ✅ `src/components/ChatModal/index.tsx` - Já funciona
- ✅ `src/components/ChatList/index.tsx` - Já funciona

---

## 🎯 Fluxo Esperado

```
┌─────────────────────────────────────────┐
│   Navegador 1 Conecta                   │
├─────────────────────────────────────────┤
│ 1. Socket conecta                       │
│ 2. emit("registrar_usuario", 1)         │
│ 3. Backend: userSocketMap.set(1, ...)   │
│ 4. Backend: io.emit("user_online", {1}) │
│ 5. emit("get_online_users")             │
│ 6. Backend: socket.emit("online_users_list", [1]) │
│ 7. setOnlineUsers([1])                  │
│ 8. ChatHeader mostra: "Online agora" ✅ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│   Navegador 2 Conecta                   │
├─────────────────────────────────────────┤
│ 1. Socket conecta                       │
│ 2. emit("registrar_usuario", 1)         │
│ 3. Backend: userSocketMap.set(1, ...)   │
│ 4. Backend: io.emit("user_online", {1}) │
│ 5. emit("get_online_users")             │
│ 6. Backend: socket.emit("online_users_list", [1, 1]) │
│ 7. setOnlineUsers([1, 1])               │
│ 8. AMBOS veem: "Online agora" ✅       │
└─────────────────────────────────────────┘
```

---

## 💡 Próximos Passos

1. **Adicione o evento no backend** (veja acima)
2. **Reinicie o servidor Node.js**
3. **Teste com dois navegadores**
4. **Se não funcionar**, ative logs:
   - Backend: `console.log()` em cada evento
   - Frontend: Verifique DevTools → Console

Boa sorte! 🚀
