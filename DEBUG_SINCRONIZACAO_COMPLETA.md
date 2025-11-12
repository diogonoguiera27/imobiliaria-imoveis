# 🔍 Debug Step-by-Step — Sincronização de Contador Não Lidas

## 🎯 Objetivo

Garantir que quando User B abre o chat com User A:
1. ✅ Backend marca mensagens como lidas
2. ✅ Backend emite `atualizar_nao_lidas` com `total: 0`
3. ✅ Frontend recebe o evento
4. ✅ Bolinha desaparece na ChatList

---

## 📋 Checklist de Verificação (Em Ordem)

### **Passo 1️⃣: Preparação**

```
[ ] Abra dois navegadores (ou duas abas anônimas)
[ ] Browser 1 = User A (ID: 1) — login como um usuário
[ ] Browser 2 = User B (ID: 2) — login como outro usuário
[ ] Abra DevTools em AMBOS (F12)
```

---

### **Passo 2️⃣: Enviar Mensagem (User A → User B)**

**Browser 1 (User A):**
```
[ ] Clique no botão flutuante do chat (verde)
[ ] Selecione User B (ID: 2) na lista
[ ] Digite: "Olá! Teste"
[ ] Clique em Enviar

🔍 Verifique no Console (F12):
   ✅ "📤 Enviando mensagem: { remetenteId: 1, destinatarioId: 2, ... }"
   ✅ "📩 Mensagem recebida: { ... }"
```

---

### **Passo 3️⃣: Verificar Bolinha em User B**

**Browser 2 (User B):**
```
[ ] Aguarde 2 segundos (evento deve chegar via socket)
[ ] Verifique se a bolinha verde com "1" aparece ao lado de User A

🔍 Verifique no Console (F12):
   ✅ "📩 Mensagem recebida: { remetenteId: 1, ... }"
   ✅ "🔔 Evento 'atualizar_nao_lidas' recebido: { remetenteId: 1, total: 1 }"
   ✅ "📊 Estado do contador atualizado: { 1: 1 }"
   ✅ "📍 ChatList renderizando User A (ID: 1): 1 não lidas"

❌ Se não vir esses logs:
   → O evento não chegou do backend
   → Verifique Backend logs (próximo passo)
```

---

### **Passo 4️⃣: Abrir o Chat (User B clica em User A)**

**Browser 2 (User B):**
```
[ ] Clique no nome de User A na ChatList (onde está a bolinha "1")

🔍 Verifique no Console (F12):
   ✅ "📚 Carregando histórico entre 2 e 1..."
   ✅ "📤 Emitindo 'carregar_historico' ao backend... { usuarioA: 2, usuarioB: 1 }"
   ✅ "✅ Histórico carregado (X mensagens)"
   ✅ "🔔 Evento 'atualizar_nao_lidas' recebido: { remetenteId: 1, total: 0 }"
   ✅ "📊 Estado do contador atualizado: { 1: 0 }"
   ✅ "📍 ChatList renderizando User A (ID: 1): 0 não lidas"

🎯 RESULTADO ESPERADO:
   → Bolinha DESAPARECE
   → Chat abre com as mensagens
   → Tudo sincronizado!
```

---

### **Passo 5️⃣: Verificar Backend Logs**

**Terminal onde o backend está rodando:**

```
Quando User B enviar "carregar_historico":

✅ ESPERADO:
   "💬 [ChatSocket] Usuário A (ID: 2) emitiu 'carregar_historico'"
   "🔹 Buscando histórico entre usuários 2 e 1..."
   "✅ Marcando mensagens como lidas..."
   "🔔 Contando não lidas para usuário 2..."
   "📤 Emitindo 'atualizar_nao_lidas' ao usuário: { remetenteId: 1, total: 0 }"

❌ SE FALTA ALGUNS:
   → Adicione console.log no seu backend
   → Verifique se o usuário está registrado no userSocketMap
```

---

## 🔧 Análise de Problemas

### **Problema A: Bolinha não aparece ao receber mensagem**

```
Sintoma: User B recebe mensagem, mas não vê bolinha

Debug:
1. Console de User B deve ter:
   ✅ "📩 Mensagem recebida"
   ✅ "🔔 Evento 'atualizar_nao_lidas' recebido"

Se FALTA o evento:
   → Backend não está emitindo corretamente
   → Verifique no servidor: io.to(socketB).emit("atualizar_nao_lidas", ...)

Se TEM o evento mas bolinha não aparece:
   → Verifique se contadorNaoLidas está sendo passado para ChatList
   → ChatList deve ter: {contadorNaoLidas[u.id] > 0 && ...}
```

---

### **Problema B: Bolinha não some ao abrir chat**

```
Sintoma: User B abre chat, mas bolinha continua mostrando "1"

Debug:
1. Verifique no console:
   ✅ "📤 Emitindo 'carregar_historico' ao backend..."
   
   Se SIM:
      → Backend recebeu? Veja logs do servidor
      → Backend retornou? Console deve mostrar novo evento

   Se NÃO:
      → Socket não conectado ou carregarHistorico não foi chamado
      → Verifique se onSelectCorretor chama carregarHistorico

2. Verifique Backend logs:
   ✅ "carregar_historico recebido"
   ✅ "Marcando mensagens como lidas"
   ✅ "Emitindo atualizar_nao_lidas { total: 0 }"

   Se FALTA algum:
      → Há erro no backend handler
      → Verifique a sintaxe do seu registerChatHandlers.ts
```

---

### **Problema C: Console limpo/difícil de acompanhar**

```
Solução rápida:
1. Abra Console (F12)
2. Digite: window.contadorDebug = true
3. Atualize página
4. Agora todos os logs de contador vão aparecer com prefixo 🔔

Ou no comando:
   localStorage.setItem('debugChat', 'true');
   location.reload();
```

---

## 📊 Estrutura Esperada de Eventos

### **Timeline Esperada (com timestamps):**

```
[14:30:00] User A envia mensagem
   → Frontend: "📤 Enviando mensagem"
   → Backend recebe: "socket.on('enviar_mensagem')"
   → Backend salva: "lida: false"
   → Backend conta: { destinatarioId: 2, lida: false } = 1
   → Backend emite: "atualizar_nao_lidas { remetenteId: 1, total: 1 }"

[14:30:01] User B recebe evento
   → Frontend: "🔔 Evento 'atualizar_nao_lidas' recebido"
   → Frontend: "📊 Estado do contador atualizado: { 1: 1 }"
   → ChatList: "📍 renderizando... 1 não lidas"
   → UI: ✅ Bolinha verde "1" aparece

[14:30:15] User B abre chat (clica em User A)
   → Frontend: "📚 Carregando histórico"
   → Frontend: "📤 Emitindo 'carregar_historico' ao backend"
   → Backend recebe: "socket.on('carregar_historico')"
   → Backend: "updateMany { lida: false → true }"
   → Backend conta: { destinatarioId: 2, lida: false } = 0
   → Backend emite: "atualizar_nao_lidas { remetenteId: 1, total: 0 }"

[14:30:16] User B recebe evento de atualização
   → Frontend: "🔔 Evento 'atualizar_nao_lidas' recebido { total: 0 }"
   → Frontend: "📊 Estado do contador atualizado: { 1: 0 }"
   → ChatList: "📍 renderizando... 0 não lidas"
   → UI: ✅ Bolinha DESAPARECE
```

---

## 🎬 Teste Completo (5 minutos)

1. **Setup (1 min):** Dois navegadores abertos
2. **Enviar (1 min):** User A envia mensagem
3. **Verificar bolinha (1 min):** Bolinha aparece em B?
4. **Abrir chat (1 min):** User B clica em A
5. **Resultado (1 min):** Bolinha some?

---

## 📝 Notas Importantes

- ⚠️ **Socket deve estar conectado** — verifique se vê "🟢 Conectado ao WebSocket"
- ⚠️ **Ambos usuários devem estar logados** — não teste com o mesmo usuário
- ⚠️ **Backend deve estar rodando** — verifique porta (ex: 3333)
- ⚠️ **Abra DevTools ANTES de qualquer ação** — para não perder logs
- 📝 **Copie logs importantes** — para compartilhar se houver problema

---

## 🆘 Se Não Funcionar

**Copie e cole aqui:**

```
1. Console log quando envia mensagem:
   [Cole aqui]

2. Console log quando abre chat:
   [Cole aqui]

3. Backend log quando User B abre chat:
   [Cole aqui]

4. Descreva o comportamento visual:
   - Bolinha apareceu quando User A enviou mensagem? SIM / NÃO
   - Bolinha desapareceu quando User B abriu chat? SIM / NÃO
```

---

**Última atualização:** 11 de novembro de 2025

