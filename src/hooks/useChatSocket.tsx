import { useEffect, useState, useCallback, useRef } from "react";
import { socket } from "@/service/socket";
import {
  listarConversasDoUsuario,
  listarMensagensEntreUsuarios,
} from "@/service/chatService";

/* ===========================================================
   📦 Tipos principais
=========================================================== */
export interface ChatMessage {
  id?: number;
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  criadoEm?: string;
}

export interface Contato {
  id: number;
  nome: string;
  avatar?: string;
  avatarUrl?: string;
  role?: "USER" | "CORRETOR" | "ADMIN";
  online?: boolean;
  ultimaMensagem?: string;
  horario?: string;
}

/* ===========================================================
   💬 Hook principal — controla socket, mensagens e histórico
=========================================================== */
export function useChatSocket(usuarioId?: number) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [digitandoPor, setDigitandoPor] = useState<number | null>(null);
  const [contadorNaoLidas, setContadorNaoLidas] = useState<Record<number, number>>({});
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]); // 👈 NOVO: array de usuários online
  const isFirstConnection = useRef(true);
  const historicoCarregado = useRef(false);

  /* ===========================================================
     🔌 Conexão inicial e registro do usuário no socket
  ============================================================ */
  useEffect(() => {
    if (!usuarioId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🟢 Conectado ao WebSocket:", socket.id);
      setIsConnected(true);
      socket.emit("registrar_usuario", usuarioId);

      // 🔹 Solicita lista inicial de usuários online
      socket.emit("get_online_users");

      if (!isFirstConnection.current) {
        console.log("♻️ Reconectado — histórico preservado");
      }
      isFirstConnection.current = false;
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do WebSocket");
      setIsConnected(false);
    });

    /* ===========================================================
       📩 Mensagens recebidas em tempo real
    ============================================================ */
    socket.on("nova_mensagem", (msg: ChatMessage) => {
      console.log("📩 Mensagem recebida:", msg);

      setMessages((prev) => {
        const jaExiste = prev.some((m) => {
          const mesmoAutor = m.remetenteId === msg.remetenteId;
          const mesmoTexto = m.conteudo === msg.conteudo;
          const tempoProximo =
            Math.abs(
              new Date(m.criadoEm || "").getTime() -
                new Date(msg.criadoEm || "").getTime()
            ) < 1500;
          return mesmoAutor && mesmoTexto && tempoProximo;
        });

        if (jaExiste || (msg.id && prev.some((m) => m.id === msg.id))) {
          console.log("⚠️ Ignorando duplicata visual:", msg);
          return prev;
        }

        return [...prev, msg];
      });
    });

    /* ===========================================================
       ✍️ Eventos de digitação
    ============================================================ */
    socket.on("usuario_digitando", (remetenteId: number) => {
      setDigitandoPor(remetenteId);
    });

    socket.on("usuario_parou_digitando", (remetenteId: number) => {
      setDigitandoPor((prev) => (prev === remetenteId ? null : prev));
    });

    /* ===========================================================
       🔔 Atualização de contadores de mensagens não lidas
    ============================================================ */
    socket.on("atualizar_nao_lidas", ({ remetenteId, total }: { remetenteId: number; total: number }) => {
      console.log(`🔔 Evento 'atualizar_nao_lidas' recebido:`, { remetenteId, total });
      setContadorNaoLidas((prev) => {
        const novoEstado = { ...prev, [remetenteId]: total };
        console.log(`📊 Estado do contador atualizado:`, novoEstado);
        return novoEstado;
      });
    });

    /* ===========================================================
       🟢 Eventos de online/offline de usuários
    ============================================================ */
    socket.on("user_online", ({ userId }) => {
      console.log(`🟢 Usuário ${userId} ficou online`);
      setOnlineUsers((prev) => prev.includes(userId) ? prev : [...prev, userId]);
    });

    socket.on("user_offline", ({ userId }) => {
      console.log(`🔴 Usuário ${userId} ficou offline`);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // 🔹 Recebe lista inicial de usuários online
    socket.on("online_users_list", (userIds: number[]) => {
      console.log(`📋 Lista de usuários online recebida:`, userIds);
      setOnlineUsers(userIds);
    });

    /* ===========================================================
       �🔔 Atualizações da lista de conversas
    ============================================================ */
    socket.on("nova_mensagem_lista", (msg) => {
      console.log("🔔 Atualização de lista recebida:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("nova_mensagem");
      socket.off("nova_mensagem_lista");
      socket.off("usuario_digitando");
      socket.off("usuario_parou_digitando");
      socket.off("atualizar_nao_lidas");
      socket.off("user_online");
      socket.off("user_offline");
      socket.off("online_users_list");
    };
  }, [usuarioId]);

  /* ===========================================================
     📤 Enviar mensagem privada
  ============================================================ */
  const sendMessage = useCallback(
    (destinatarioId: number, conteudo: string) => {
      if (!conteudo.trim() || !usuarioId) return;

      if (usuarioId === destinatarioId) {
        console.warn("🚫 Tentativa de enviar mensagem para si mesmo bloqueada.");
        return;
      }

      const novaMensagem: ChatMessage = {
        remetenteId: usuarioId,
        destinatarioId,
        conteudo,
        criadoEm: new Date().toISOString(),
      };

      console.log("📤 Enviando mensagem:", novaMensagem);

      socket.emit("enviar_mensagem", novaMensagem);

      // ✅ Mostra no chat imediatamente
      setMessages((prev) => [...prev, novaMensagem]);
    },
    [usuarioId]
  );

  /* ===========================================================
     🕓 Carregar histórico entre usuários (com cache)
  ============================================================ */
  const carregarHistorico = useCallback(
    async (destinatarioId: number) => {
      if (!usuarioId) return;

      try {
        console.log(
          `📚 Carregando histórico entre ${usuarioId} e ${destinatarioId}...`
        );

        // 🔹 Emite via socket para marcar como lida e receber contador atualizado
        console.log(`📤 Emitindo 'carregar_historico' ao backend...`, { usuarioA: usuarioId, usuarioB: destinatarioId });
        socket.emit("carregar_historico", {
          usuarioA: usuarioId,
          usuarioB: destinatarioId,
        });

        // 🔹 Também carrega via API para exibir as mensagens
        const data = await listarMensagensEntreUsuarios(usuarioId, destinatarioId);

        if (!Array.isArray(data)) {
          console.warn("⚠️ Retorno inesperado do histórico:", data);
          return;
        }

        const unicos = data.filter(
          (v, i, a) =>
            a.findIndex(
              (x) =>
                x.id === v.id &&
                x.conteudo === v.conteudo &&
                x.remetenteId === v.remetenteId
            ) === i
        );

        setMessages(unicos);
        historicoCarregado.current = true;

        console.log(`✅ Histórico carregado (${unicos.length} mensagens)`);
      } catch (error) {
        console.error("❌ Erro ao carregar histórico:", error);
      }
    },
    [usuarioId]
  );

  /* ===========================================================
     🧾 Listar conversas (estilo WhatsApp)
  ============================================================ */
  const listarConversas = useCallback(
    async (setLista: (lista: Contato[]) => void) => {
      if (!usuarioId) return;

      try {
        console.log("📋 Buscando conversas do usuário...");
        const data = await listarConversasDoUsuario(usuarioId);

        if (Array.isArray(data)) {
          console.log("📋 Conversas encontradas:", data.length);
          setLista(data);
        } else {
          console.warn("⚠️ Formato inesperado de conversas:", data);
          setLista([]);
        }
      } catch (error) {
        console.error("❌ Erro ao listar conversas:", error);
        setLista([]);
      }
    },
    [usuarioId]
  );

  /* ===========================================================
     🔁 Atualização automática da lista (em tempo real)
  ============================================================ */
  const registrarAtualizacaoLista = useCallback(
    (onUpdate: () => void) => {
      socket.on("nova_mensagem_lista", onUpdate);
      return () => socket.off("nova_mensagem_lista", onUpdate);
    },
    []
  );

  /* ===========================================================
     🔚 Retorno do hook
  ============================================================ */
  return {
    isConnected,
    messages,
    sendMessage,
    carregarHistorico,
    listarConversas,
    registrarAtualizacaoLista,
    digitandoPor,
    contadorNaoLidas,
    setContadorNaoLidas, // 👈 NOVO: para resetar contador do front-end
    onlineUsers, // 👈 NOVO: retorna array de usuários online
  };
}
