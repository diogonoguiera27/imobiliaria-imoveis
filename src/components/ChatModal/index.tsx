import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ChatMessages from "../ChatMessages";
import ChatInput from "../ChatInput";
import ChatList from "../ChatList";
import ChatHeader from "../ChatHeader";
import { socket } from "@/service/socket";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getCorretorByProperty } from "@/service/propertyService";
import useAuth from "@/hooks/auth/useAuth";

/* ===========================================================
   🌍 EXTENSÃO DO WINDOW
=========================================================== */
declare global {
  interface Window {
    openChatModal?: (
      destinatarioId: number,
      mensagemInicial?: string
    ) => Promise<void>;
    zerar_badge_chat?: () => void;
  }
}

/* ===========================================================
   📦 Tipagem base
=========================================================== */
interface Contato {
  id: number;
  nome: string;
  avatar?: string;
  avatarUrl?: string;
  role?: "USER" | "CORRETOR" | "ADMIN";
}

interface ChatModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * 💬 ChatModal — conversa entre cliente e corretor
 */
export default function ChatModal({ open: externalOpen, onOpenChange }: ChatModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(null);
  const [mensagemInicial, setMensagemInicial] = useState("");
  const [modoLista, setModoLista] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [conversas, setConversas] = useState<Contato[]>([]);

  // 👤 Usuário logado
  const { user } = useAuth();
  const usuarioLogadoId = user?.id ?? null;
  const usuarioLogadoRole = user?.role;

  // 🔌 Hook principal do chat
  const {
    isConnected,
    messages,
    sendMessage,
    carregarHistorico,
    listarConversas,
    digitandoPor,
    contadorNaoLidas,
    setContadorNaoLidas,
    onlineUsers,
  } = useChatSocket(usuarioLogadoId || undefined);

  /* ===========================================================
     📌 Abrir conversa corretamente
=========================================================== */
  const abrirConversa = useCallback(
    async (contato: Contato) => {
      try {
        setCarregando(true);

        setContatoSelecionado(contato);
        setModoLista(false);

        // Zera contador do contato (local)
        setContadorNaoLidas((prev) => ({ ...prev, [contato.id]: 0 }));

        // 🔥 Zera badge global do botão flutuante
        window.dispatchEvent(new CustomEvent("zerar_badge_chat"));

        await carregarHistorico(contato.id);
      } catch (err) {
        console.error("❌ Erro ao abrir conversa:", err);
      } finally {
        setCarregando(false);
      }
    },
    [carregarHistorico, setContadorNaoLidas]
  );

  /* ===========================================================
     🌍 window.openChatModal
=========================================================== */
  useEffect(() => {
    window.openChatModal = async (
      destinatarioId: number,
      mensagemInicial?: string
    ): Promise<void> => {
      try {
        setMensagemInicial(mensagemInicial || "");
        setOpen(true);
        setModoLista(false);
        setCarregando(true);

        const corretor = await getCorretorByProperty(destinatarioId);

        const contato: Contato = {
          id: corretor.id,
          nome: corretor.nome || "Contato",
          avatar: corretor.avatarUrl,
          role: corretor.role,
        };

        setContatoSelecionado(contato);

        // 🔥 limpa badge global
        window.dispatchEvent(new CustomEvent("zerar_badge_chat"));

        await carregarHistorico(contato.id);
      } catch (error) {
        console.error("❌ Erro ao abrir chat:", error);
      } finally {
        setCarregando(false);
      }
    };

    return () => {
      delete window.openChatModal;
    };
  }, [carregarHistorico, setOpen]);

  /* ===========================================================
     🔁 Atualiza histórica ao reconectar
=========================================================== */
  useEffect(() => {
    if (contatoSelecionado && isConnected) {
      carregarHistorico(contatoSelecionado.id);
    }
  }, [contatoSelecionado, isConnected, carregarHistorico]);

  /* ===========================================================
     🧾 Carrega lista ao entrar no modo lista
=========================================================== */
  useEffect(() => {
    if (modoLista) listarConversas(setConversas);
  }, [modoLista, listarConversas]);

  /* ===========================================================
     📡 Atualiza lista ao abrir modal
=========================================================== */
  useEffect(() => {
    if (open && usuarioLogadoId && isConnected) {
      socket.emit("listar_contatos", { userId: usuarioLogadoId });
    }
  }, [open, usuarioLogadoId, isConnected]);

  /* ===========================================================
     🔁 Atualização em tempo real via evento global
=========================================================== */
  useEffect(() => {
    function atualizar() {
      listarConversas(setConversas);
    }

    window.addEventListener("atualizar_conversas_chat", atualizar);
    return () => window.removeEventListener("atualizar_conversas_chat", atualizar);
  }, [listarConversas]);

  /* ===========================================================
     🔙 Voltar para lista
=========================================================== */
  const voltarParaLista = () => {
    setModoLista(true);
    setContatoSelecionado(null);
  };

  /* ===========================================================
     🎨 Avatar
=========================================================== */
  const obterAvatar = (avatar?: string, id?: number): string => {
    if (avatar?.startsWith("http")) return avatar;

    if (avatar?.startsWith("/")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${avatar}`;
    }

    return `https://i.pravatar.cc/100?u=${id || 0}`;
  };

  /* ===========================================================
     🚫 Usuário não autenticado
=========================================================== */
  if (!usuarioLogadoId) return null;

  /* ===========================================================
     🧠 Renderização
=========================================================== */
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="!fixed !inset-0 !bg-transparent !z-40" />

        <Dialog.Content
          aria-describedby="chat-modal-description"
          aria-labelledby="chat-modal-title"
          className="
            !fixed !z-[9999] !bottom-20 !right-8
            !bg-white !rounded-3xl
            !shadow-2xl
            !w-[380px] !h-[540px]
            !flex !flex-col
            !overflow-hidden
            !transition-all !duration-300
          "
        >
          <Dialog.Title id="chat-modal-title" className="!sr-only">
            Chat com contato
          </Dialog.Title>

          <Dialog.Description id="chat-modal-description" className="!sr-only">
            Janela de conversa entre dois usuários.
          </Dialog.Description>

          <Dialog.Close
            className="!absolute !top-3 !right-3 !text-gray-600 hover:!text-gray-800 !cursor-pointer"
            aria-label="Fechar chat"
          >
            <X size={20} />
          </Dialog.Close>

          {/* ======================= CORPO ======================= */}
          {modoLista ? (
            <ChatList
              corretores={conversas}
              onSelectCorretor={abrirConversa}
              userId={usuarioLogadoId}
              userRole={usuarioLogadoRole}
              digitandoPor={digitandoPor}
              contadorNaoLidas={contadorNaoLidas}
              usuariosOnline={onlineUsers}
            />
          ) : contatoSelecionado ? (
            <>
              <ChatHeader
                nome={contatoSelecionado.nome}
                avatar={obterAvatar(contatoSelecionado.avatar, contatoSelecionado.id)}
                userId={contatoSelecionado.id}
                onlineUsers={onlineUsers}
                digitandoPor={digitandoPor}
                onVoltar={voltarParaLista}
              />

              {carregando ? (
                <div className="!flex !flex-1 !items-center !justify-center !text-gray-500">
                  Carregando conversa...
                </div>
              ) : (
                <>
                  <ChatMessages
                    messages={messages}
                    userId={usuarioLogadoId}
                    destinatarioId={contatoSelecionado.id}
                    digitandoPor={digitandoPor}
                  />

                  <ChatInput
                    defaultValue={mensagemInicial}
                    onSend={(texto) => {
                      sendMessage(contatoSelecionado.id, texto);
                      if (mensagemInicial) setMensagemInicial("");
                    }}
                    userId={usuarioLogadoId}
                    destinatarioId={contatoSelecionado.id}
                  />
                </>
              )}
            </>
          ) : (
            <div className="!flex !flex-1 !items-center !justify-center !text-gray-500">
              Selecione uma conversa para começar
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
