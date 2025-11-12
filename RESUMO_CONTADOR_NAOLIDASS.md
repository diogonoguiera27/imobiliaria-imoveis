# ✅ Resumo das Alterações — Contador de Mensagens Não Lidas

## 📝 Arquivos Modificados

### **1. `src/hooks/useChatSocket.tsx`**

#### ✨ Alterações:
- ✅ Adicionado state: `const [contadorNaoLidas, setContadorNaoLidas] = useState<Record<number, number>>({})`
- ✅ Listener socket: `socket.on("atualizar_nao_lidas", ...)`
- ✅ Emit socket em `carregarHistorico`: `socket.emit("carregar_historico", { usuarioA, usuarioB })`
- ✅ Retorno do hook: `contadorNaoLidas` exposto no return
- ✅ Log de debug adicionado para rastrear eventos

#### 🔧 Fluxo:
```
Backend emite "atualizar_nao_lidas" 
    ↓
Frontend recebe via socket.on()
    ↓
Atualiza contadorNaoLidas state
    ↓
ChatList re-renderiza com novo valor
    ↓
Bolinha aparece/desaparece baseado em naoLidas > 0
```

---

### **2. `src/components/ChatList/index.tsx`**

#### ✨ Alterações:
- ✅ Prop adicionada: `contadorNaoLidas?: Record<number, number>`
- ✅ Renderização da bolinha verde:
```tsx
{contadorNaoLidas[u.id] > 0 && (
  <span className="!bg-green-500 !text-white !rounded-full !text-xs !w-6 !h-6 !flex !items-center !justify-center !font-bold">
    {contadorNaoLidas[u.id]}
  </span>
)}
```

#### 🎨 Visual:
- Bolinha verde com número branco
- Posicionada ao lado do horário
- Desaparece automaticamente quando `naoLidas === 0`

---

### **3. `src/components/ChatModal/index.tsx`**

#### ✨ Alterações:
- ✅ Desestruturação do hook: `contadorNaoLidas` extraído
- ✅ Prop passada para `ChatList`:
```tsx
<ChatList
  corretores={conversas}
  onSelectCorretor={(c) => { ... }}
  userId={usuarioLogadoId}
  userRole={usuarioLogadoRole}
  digitandoPor={digitandoPor}
  contadorNaoLidas={contadorNaoLidas}  // 👈 NOVO
/>
```

---

## 🔄 Fluxo Completo (Passo a Passo)

### **Quando User A envia mensagem para User B:**

1. **Frontend (A):**
   - `ChatInput` emite `socket.emit("enviar_mensagem", { destinatarioId: B, conteudo: "..." })`

2. **Backend:**
   - Recebe em `socket.on("enviar_mensagem", ...)`
   - Salva no banco com `lida: false`
   - Conta mensagens não lidas: `prisma.mensagem.count({ where: { destinatarioId: B, lida: false } })`
   - Emite `io.to(socketDeB).emit("atualizar_nao_lidas", { remetenteId: A, total: 1 })`

3. **Frontend (B):**
   - Recebe `socket.on("atualizar_nao_lidas", ...)`
   - Atualiza: `setContadorNaoLidas({ ...prev, [A]: 1 })`
   - `ChatList` re-renderiza com a bolinha verde mostrando "1"
   - Console log: `🔔 Atualizar não lidas - Remetente A: 1 mensagens não lidas`

---

### **Quando User B abre o chat com User A:**

1. **Frontend (B):**
   - Clica em User A na `ChatList`
   - `ChatModal` chama `carregarHistorico(A_id)`
   - Hook emite: `socket.emit("carregar_historico", { usuarioA: B, usuarioB: A })`

2. **Backend:**
   - Recebe em `socket.on("carregar_historico", ...)`
   - Marca mensagens como lidas: `prisma.mensagem.updateMany({ where: { remetenteId: A, destinatarioId: B, lida: false }, data: { lida: true } })`
   - Conta novamente: `prisma.mensagem.count({ where: { destinatarioId: B, lida: false } })`
   - Se houver outras não lidas de outros usuários, emite aquele valor, caso contrário 0
   - Emite: `io.to(socketDeB).emit("atualizar_nao_lidas", { remetenteId: A, total: 0 })`

3. **Frontend (B):**
   - Recebe `socket.on("atualizar_nao_lidas", { remetenteId: A, total: 0 })`
   - Atualiza: `setContadorNaoLidas({ ...prev, [A]: 0 })`
   - `ChatList` re-renderiza SEM a bolinha (pois 0 não passa na condição `> 0`)
   - Console log: `🔔 Atualizar não lidas - Remetente A: 0 mensagens não lidas`

---

## 🧪 Teste Local (Passo a Passo)

### **Setup Inicial:**

1. Abra dois abas de navegador (ou two diferentes browsers)
2. Aba 1 (User A ID: 1): Login com um usuário
3. Aba 2 (User B ID: 2): Login com outro usuário

### **Teste 1 — Bolinha Aparece:**

```
1. Na Aba 2, abra DevTools (F12) → Console
2. Na Aba 1, clique no botão flutuante do chat
3. Selecione User B (ID: 2)
4. Digite uma mensagem e envie

✅ Esperado na Aba 2:
   - Bolinha verde com "1" aparece ao lado de User A na lista
   - Console log: "🔔 Atualizar não lidas - Remetente 1: 1 mensagens não lidas"
```

### **Teste 2 — Bolinha Some:**

```
5. Na Aba 2, clique em User A na ChatList
6. O chat abre e carrega o histórico

✅ Esperado na Aba 2:
   - Bolinha desaparece
   - Console log: "🔔 Atualizar não lidas - Remetente 1: 0 mensagens não lidas"
   - Mensagem apareça no chat como lida
```

### **Teste 3 — Múltiplas Mensagens:**

```
7. Volte para a lista (clique voltar)
8. Na Aba 1, envie 3 mensagens para User B

✅ Esperado na Aba 2:
   - Bolinha mostra "3"
   - Clique em User A
   - Bolinha some e mostra "0"
```

---

## 🎯 Checklist Final

- [ ] Backend está emitindo `atualizar_nao_lidas` corretamente
- [ ] Frontend recebe o evento (veja no console)
- [ ] `contadorNaoLidas` está no estado do hook
- [ ] `ChatList` recebe a prop `contadorNaoLidas`
- [ ] Bolinha renderiza quando `naoLidas > 0`
- [ ] Bolinha desaparece quando `naoLidas === 0`
- [ ] Indicador `digitando...` continua funcionando
- [ ] Avatar de contatos carrega corretamente

---

## 📞 Suporte

Se algo não funcionar:

1. **Abra DevTools (F12)** e verifique o Console
2. **Procure por:**
   - `🔔 Atualizar não lidas` (evento sendo recebido)
   - `📚 Carregando histórico` (ao abrir chat)
   - `❌ Erro` (se houver algum erro)

3. **Consulte** `GUIA_DEBUG_CONTADOR_NAOLIDASS.md`

---

**Status:** ✅ Pronto para teste

