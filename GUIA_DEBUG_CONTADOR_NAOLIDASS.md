# 🔔 Guia de Debug — Contador de Mensagens Não Lidas

## 📋 Fluxo Esperado

### **Cenário: User A envia mensagem para User B**

```
[User A]                    [Backend]                      [User B]
   |                            |                             |
   |--- enviar_mensagem-------->|                             |
   |                            |                             |
   |                            |--- nova_mensagem----------->|
   |                            |                             |
   |                            |--- atualizar_nao_lidas---->|
   |                            |  { remetenteId: A, total: 1}|
   |                            |                             |
```

**Esperado no User B:**
- Bolinha verde com número "1" aparece ao lado do nome de User A na `ChatList`
- Console log: `🔔 Atualizar não lidas - Remetente A: 1 mensagens não lidas`

---

### **Cenário: User B abre o chat com User A**

```
[User B]                    [Backend]                      [User A]
   |                            |                             |
   |--- carregar_historico----->|                             |
   |  { usuarioA: B,            |                             |
   |    usuarioB: A }           |                             |
   |                            |                             |
   |                    ✅ Marca lida:                       |
   |                    updateMany({                          |
   |                      remetenteId: A,                     |
   |                      destinatarioId: B,                  |
   |                      lida: false                         |
   |                    }, { lida: true })                    |
   |                            |                             |
   |<--- historico_carregado---|                             |
   |<--- atualizar_nao_lidas---|                             |
   |     { remetenteId: A,      |                             |
   |       total: 0 }           |                             |
   |                            |                             |
```

**Esperado no User B:**
- Bolinha desaparece (naoLidas = 0)
- Console log: `🔔 Atualizar não lidas - Remetente A: 0 mensagens não lidas`
- Chat mostra todas as mensagens de A marcadas como lidas no banco

---

## 🔍 Como Debugar (Abra o Console do Navegador)

### **1. Verificar se o socket está conectado:**

```javascript
// No console do navegador (F12)
// Você verá logs assim:
// 🟢 Conectado ao WebSocket: socket-id-aqui
// ✅ Usuário 1 vinculado ao socket socket-id
```

### **2. Ao enviar mensagem (User A):**

```
Console de User A:
📤 Enviando mensagem: { remetenteId: 1, destinatarioId: 2, ... }
📩 Mensagem recebida: { id: 123, remetenteId: 1, ... }

Console de User B (já deve ter a mensagem):
📩 Mensagem recebida: { id: 123, remetenteId: 1, ... }
🔔 Atualizar não lidas - Remetente 1: 1 mensagens não lidas
```

### **3. Ao abrir o chat (User B clica em User A):**

```
Console de User B:
📚 Carregando histórico entre 2 e 1...
✅ Histórico carregado (5 mensagens)
🔔 Atualizar não lidas - Remetente 1: 0 mensagens não lidas
```

---

## ✅ Checklist de Verificação

- [ ] **Backend emite `atualizar_nao_lidas` ao enviar mensagem?**
  - Verifique no console do servidor (node): `📤 Enviada ao destinatário...`
  - Depois: `io.to(destinatarioSocketId).emit("atualizar_nao_lidas", ...)`

- [ ] **Frontend recebe `atualizar_nao_lidas`?**
  - Console do navegador deve mostrar: `🔔 Atualizar não lidas - Remetente X: Y mensagens não lidas`

- [ ] **Bolinha verde aparece com o número certo?**
  - Na `ChatList`, veja se `contadorNaoLidas[u.id] > 0` está renderizando o badge

- [ ] **Backend emite `atualizar_nao_lidas` após `carregar_historico`?**
  - Após User B abrir o chat, server deve logar a atualização
  - Frontend deve receber evento com `total: 0`

- [ ] **Bolinha some quando abre o chat?**
  - Após receber `atualizar_nao_lidas { total: 0 }`, a bolinha deve desaparecer

---

## 🔧 Comandos Úteis (Console do Navegador)

```javascript
// Ver estado atual do contador:
// (Execute após chamar o hook em algum componente)
console.log("Contador não lidas:", contadorNaoLidas);

// Ver todas as mensagens recebidas:
console.log("Mensagens:", messages);

// Ver se socket está conectado:
console.log("Socket conectado?", isConnected);
```

---

## ❌ Possíveis Problemas e Soluções

### **Bolinha não aparece:**
1. ✅ Backend está emitindo `atualizar_nao_lidas`?
2. ✅ Frontend recebe o evento (veja no console)?
3. ✅ `contadorNaoLidas` está sendo passado para `ChatList`?
4. ✅ Condição `naoLidas > 0` está correta?

### **Bolinha não some ao abrir chat:**
1. ✅ Backend está chamando `updateMany` para marcar como lida?
2. ✅ Backend está emitindo `atualizar_nao_lidas { total: 0 }` após?
3. ✅ Frontend está emitindo `carregar_historico` quando abre o chat?

### **Socket não conecta:**
1. ✅ Backend está rodando na porta correta?
2. ✅ Frontend `.env` tem `VITE_API_URL` correto?
3. ✅ Socket.io client está instalado (`npm i socket.io-client`)?

---

## 📊 Estrutura de Dados Esperada

### **contadorNaoLidas no Hook:**
```typescript
{
  1: 3,  // Usuário ID 1 tem 3 mensagens não lidas
  2: 0,  // Usuário ID 2 tem 0 mensagens não lidas
  5: 7,  // Usuário ID 5 tem 7 mensagens não lidas
}
```

### **Na ChatList:**
```tsx
{contadorNaoLidas[u.id] > 0 && (
  <span className="...">
    {contadorNaoLidas[u.id]}  {/* Exibe apenas se > 0 */}
  </span>
)}
```

---

## 🎯 Próximos Passos

1. **Teste com dois navegadores abertos** (ou dois usuários diferentes):
   - Navegador 1: User A (ID: 1)
   - Navegador 2: User B (ID: 2)

2. **Envie mensagem de A para B** e veja a bolinha aparecer em B

3. **Abra o chat em B** e veja a bolinha desaparecer

4. **Consulte este guia** se algo não funcionar como esperado

---

**Última atualização:** 11 de novembro de 2025

