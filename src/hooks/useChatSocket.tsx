import { useEffect, useState, useCallback } from "react";
import { socket } from "@/service/socket";
import {
  listarConversasDoUsuario,
  listarMensagensEntreUsuarios,
} from "@/service/chatService";
import toast from "react-hot-toast";


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
  naoLidas?: number;
}

interface NotificacaoMensagem {
  titulo: string;
  conteudo: string;
  remetente: string;
  remetenteId: number;
  timestamp: string;
}

interface AtualizacaoGlobal {
  totalContatos: number;
  detalhes?: { remetenteId: number; _count: { _all: number } }[];
}


export function useChatSocket(usuarioId?: number) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [digitandoPor, setDigitandoPor] = useState<number | null>(null);
  const [contadorNaoLidas, setContadorNaoLidas] = useState<
    Record<number, number>
  >({});
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [contatosComMensagens, setContatosComMensagens] = useState(0);

 
  useEffect(() => {
    if (!usuarioId) return;

    
    const handleConnect = () => {
      console.log("🟢 Socket conectado:", socket.id);
      setIsConnected(true);
      socket.emit("registrar_usuario", usuarioId);
      socket.emit("get_online_users");
      socket.emit("listar_contatos", { userId: usuarioId });
    };

    const handleDisconnect = () => {
      console.log("🔴 Socket desconectado");
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    
    const handleNovaMensagem = (msg: ChatMessage) => {
      console.log("📩 Mensagem recebida:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    const handleNotificacaoMensagem = (data: NotificacaoMensagem) => {
      toast.success(`💬 ${data.remetente}: ${data.conteudo.substring(0, 60)}`);
    };

    const handleAtualizarNotificacaoGlobal = (data: AtualizacaoGlobal) => {
      if (Array.isArray(data.detalhes)) {
        const novos: Record<number, number> = {};
        data.detalhes
          .filter((c) => c.remetenteId !== usuarioId)
          .forEach((c) => {
            novos[c.remetenteId] = c._count._all;
          });
        setContadorNaoLidas((prev) => ({ ...prev, ...novos }));
        const total = Object.values(novos).filter((v) => v > 0).length;
        setContatosComMensagens(total);
      } else {
        setContatosComMensagens(data.totalContatos || 0);
      }
    };

    const handleContatosAtualizados = (lista: Contato[]) => {
      const filtered = lista.filter((c) => c.id !== usuarioId);
      const novos: Record<number, number> = {};
      filtered.forEach((c) => {
        novos[c.id] = c.naoLidas || 0;
      });
      setContadorNaoLidas((prev) => ({ ...prev, ...novos }));
      const total = Object.values(novos).filter((v) => v > 0).length;
      setContatosComMensagens(total);
    };

    const handleUsuarioDigitando = (rid: number) => setDigitandoPor(rid);
    const handleUsuarioParouDigitando = (rid: number) =>
      setDigitandoPor((prev) => (prev === rid ? null : prev));

    const handleAtualizarNaoLidas = ({ remetenteId, total }: { remetenteId: number; total: number }) => {
      setContadorNaoLidas((prev) => ({ ...prev, [remetenteId]: total }));
    };

    const handleUserOnline = ({ userId: onlineUserId }: { userId: number }) => {
      if (onlineUserId !== usuarioId) {
        setOnlineUsers((prev) => (prev.includes(onlineUserId) ? prev : [...prev, onlineUserId]));
      }
    };

    const handleUserOffline = ({ userId: offlineUserId }: { userId: number }) =>
      setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId));

    const handleOnlineUsersList = (ids: number[]) => setOnlineUsers(ids.filter(id => id !== usuarioId));

    socket.on("nova_mensagem", handleNovaMensagem);
    socket.on("notificacao_mensagem", handleNotificacaoMensagem);
    socket.on("atualizar_notificacao_global", handleAtualizarNotificacaoGlobal);
    socket.on("contatos_atualizados", handleContatosAtualizados);
    socket.on("usuario_digitando", handleUsuarioDigitando);
    socket.on("usuario_parou_digitando", handleUsuarioParouDigitando);
    socket.on("atualizar_nao_lidas", handleAtualizarNaoLidas);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    socket.on("online_users_list", handleOnlineUsersList);

   
    return () => {
      console.log("🧹 Limpando listeners do socket…");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("nova_mensagem", handleNovaMensagem);
      socket.off("notificacao_mensagem", handleNotificacaoMensagem);
      socket.off("atualizar_notificacao_global", handleAtualizarNotificacaoGlobal);
      socket.off("contatos_atualizados", handleContatosAtualizados);
      socket.off("usuario_digitando", handleUsuarioDigitando);
      socket.off("usuario_parou_digitando", handleUsuarioParouDigitando);
      socket.off("atualizar_nao_lidas", handleAtualizarNaoLidas);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("online_users_list", handleOnlineUsersList);
    };
  }, [usuarioId]);

 
  const sendMessage = useCallback(
    (destinatarioId: number, conteudo: string) => {
      if (!conteudo.trim() || !usuarioId) return;
      if (usuarioId === destinatarioId) return;

      const novaMensagem: ChatMessage = {
        remetenteId: usuarioId,
        destinatarioId,
        conteudo,
        criadoEm: new Date().toISOString(),
      };

      socket.emit("enviar_mensagem", novaMensagem);
    },
    [usuarioId]
  );

 
  const carregarHistorico = useCallback(
    async (destinatarioId: number) => {
      if (!usuarioId) return;

      try {
        const data = await listarMensagensEntreUsuarios(
          usuarioId,
          destinatarioId
        );

        if (Array.isArray(data)) {
          setMessages(data);

          socket.emit("carregar_historico", {
            usuarioA: usuarioId,
            usuarioB: destinatarioId,
          });

            
            setContadorNaoLidas((prev) => {
              const novo = { ...prev, [destinatarioId]: 0 };
              const total = Object.values(novo).filter((v) => (v || 0) > 0).length;
              setContatosComMensagens(total);
              return novo;
            });
        }
      } catch (err) {
        console.error("❌ Erro ao carregar histórico:", err);
      }
    },
    [usuarioId]
  );

  
  const listarConversas = useCallback(
    async (setLista: (lista: Contato[]) => void) => {
      if (!usuarioId) return;
      try {
        const data = await listarConversasDoUsuario(usuarioId);
        setLista(Array.isArray(data) ? data : []);
      } catch {
        setLista([]);
      }
    },
    [usuarioId]
  );

  
  return {
    isConnected,
    messages,
    sendMessage,
    carregarHistorico,
    listarConversas,
    digitandoPor,
    contadorNaoLidas,
    setContadorNaoLidas,
    onlineUsers,
    contatosComMensagens,
  };
}
