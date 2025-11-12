# 🔍 Guia de Debug - Avatares no Chat

## ✅ O que foi implementado

### Frontend (`ChatList.tsx`)
1. **Função `obterAvatar()` melhorada** com prioridades:
   - ✅ Verifica se `avatar` é uma URL HTTP válida
   - ✅ Verifica se `avatarUrl` é uma URL HTTP válida
   - ✅ Se for caminho local (começa com `/`), concatena com `VITE_API_URL`
   - ✅ Fallback para avatar genérico (`https://i.pravatar.cc`)

2. **Tag `<img>` melhorada**:
   - Atributo `onError` com fallback automático
   - Atributo `loading="lazy"` para otimização
   - Classe `!bg-gray-200` para mostrar placeholder enquanto carrega
   - Console.warn com informações do usuário

3. **Logs de debug**:
   - `console.log("📋 Conversas carregadas...")` com dados retornados do backend
   - `console.warn("❌ Erro ao carregar avatar...")` com ID do usuário

### Backend (já está correto ✅)
A rota `/chat/conversas/:userId` retorna:
```json
{
  "id": 1,
  "nome": "João",
  "avatar": "/uploads/avatars/filename.jpg",  // ← vem do avatarUrl do banco
  "role": "CORRETOR",
  "ultimaMensagem": "Oi, tudo bem?",
  "horario": "2025-11-10T10:30:00Z"
}
```

## 🧪 Como diagnosticar o problema

### Passo 1: Abrir Console do Navegador
- Pressione `F12` ou `Ctrl+Shift+I`
- Vá para a aba "Console"

### Passo 2: Procurar por logs
Você verá algo como:
```
📋 Conversas carregadas do backend: Array(3)
  ├─ [0] id: 2, nome: "Maria", avatar: "/uploads/avatars/maria.jpg", role: "USER"
  ├─ [1] id: 3, nome: "Pedro", avatar: "/uploads/avatars/pedro.jpg", role: "CORRETOR"
  └─ [2] id: 4, nome: "Ana", avatar: null, role: "USER"
```

### Passo 3: Verificar a aba "Network"
1. Abra a aba "Network"
2. Filtre por "img" ou "xhr"
3. Procure pelas requisições de imagem:
   - Se a imagem vem de `/uploads/...` → Verifique se existe no servidor
   - Se vem de `https://i.pravatar.cc/...` → Está usando fallback

### Passo 4: Inspecionar elemento
1. Clique com botão direito na imagem
2. Escolha "Inspecionar"
3. Veja o atributo `src` real que está sendo usado

## 🔧 Possíveis problemas e soluções

### Problema 1: Avatar não carrega (exibe fallback)
**Causa**: O arquivo não existe no servidor
```
❌ Erro ao carregar avatar para Maria (ID: 2), usando fallback...
```

**Solução**:
1. Verifique se o arquivo existe em `/uploads/avatars/`
2. Verifique permissões da pasta
3. Verifique se o caminho está correto no banco de dados

### Problema 2: Avatar não aparece nada (sem imagem)
**Causa**: O campo `avatar` do backend está vazio ou nulo

**Solução**:
1. Verifique se o usuário tem `avatarUrl` preenchido no banco
2. Teste a rota `/chat/conversas/1` no Postman/Insomnia
3. Verifique se retorna algo como: `"avatar": "/uploads/avatars/..."`

### Problema 3: Imagem carrega mas está incorreta
**Causa**: O `VITE_API_URL` pode estar mal configurado

**Solução**:
1. Verifique o arquivo `.env`:
   ```
   VITE_API_URL=http://localhost:3333
   ```
2. Se o backend estiver em outro host, ajuste:
   ```
   VITE_API_URL=https://seu-backend.com
   ```

## 📊 Estrutura esperada da resposta

```typescript
interface ChatContato {
  id: number;
  nome: string;
  avatar?: string;           // ← Pode ser URL completa ou caminho relativo
  avatarUrl?: string;        // ← Alternativa
  role?: "USER" | "CORRETOR" | "ADMIN";
  ultimaMensagem?: string;
  horario?: string;
  online?: boolean;
}
```

## ✅ Checklist de verificação

- [ ] Backend retorna `/uploads/avatars/filename.jpg` no campo `avatar`
- [ ] Arquivo existe em `uploads/avatars/` no servidor
- [ ] `VITE_API_URL` está correto no `.env`
- [ ] Console mostra `📋 Conversas carregadas...` com dados
- [ ] Se houver erro, mostra `❌ Erro ao carregar avatar...`
- [ ] Aba "Network" mostra status 200 para imagens que carregam
- [ ] Aba "Network" mostra erro 404 para imagens que não existem

## 🎯 Resultado esperado

Quando tudo estiver funcionando:
1. Console exibe `📋 Conversas carregadas` com dados completos
2. Cada contato mostra a foto real do usuário
3. Se a foto não carregar, mostra avatar genérico do gravatar
4. Console não mostra erros de CORS ou 404

---

**Dúvidas?** Abra o console (F12) e compartilhe os logs!
