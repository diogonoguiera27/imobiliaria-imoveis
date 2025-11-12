import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import ChatMessages from "../ChatMessages";
import ChatInput from "../ChatInput";
import ChatList from "../ChatList";
import ChatHeader from "../ChatHeader";
import { useChatSocket } from "@/hooks/useChatSocket";
import { getCorretorByProperty } from "@/service/propertyService";
import useAuth from "@/hooks/auth/useAuth";

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

/**
 * 💬 ChatModal — conversa entre cliente e corretor
 */
export default function ChatModal() {
  const [open, setOpen] = useState(false);
  const [contatoSelecionado, setContatoSelecionado] = useState<Contato | null>(
    null
  );
  const [mensagemInicial, setMensagemInicial] = useState("");
  const [modoLista, setModoLista] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [conversas, setConversas] = useState<Contato[]>([]);


  // Obtém usuário logado via contexto de autenticação
  const { user } = useAuth();
  
  // ✅ Garante que usuarioLogadoId é sempre um número válido
  const usuarioLogadoId = user?.id ?? null;
  const usuarioLogadoRole = user?.role;

  const {
    isConnected,
    messages,
    sendMessage,
    carregarHistorico,
    listarConversas,
    digitandoPor,
    contadorNaoLidas,
    setContadorNaoLidas, // 👈 NOVO: para resetar contador
    onlineUsers, // 👈 NOVO: array de usuários online
  } = useChatSocket(usuarioLogadoId || undefined);

  /* ===========================================================
     🧹 Função para zerar contador de não lidas localmente
  ============================================================ */
  const zerarContador = (contatoId: number, nomeContato: string) => {
    if (contadorNaoLidas[contatoId] > 0) {
      console.log(`🧹 Limpando contador local de não lidas para ${nomeContato} (ID: ${contatoId})`);
      setContadorNaoLidas((prev) => ({ ...prev, [contatoId]: 0 }));
    }
  };

  /* ===========================================================
     🌍 Permite abrir o chat globalmente
  ============================================================ */
  useEffect(() => {
    window.openChatModal = async (
      destinatarioId: number,
      mensagem?: string
    ) => {
      try {
        setMensagemInicial(mensagem || "");
        setOpen(true);
        setModoLista(false);
        setCarregando(true);

        // 🔍 Busca informações do corretor (ou usuário destino)
        const corretor = await getCorretorByProperty(destinatarioId);

        const contato = {
          id: corretor.id,
          nome: corretor.nome || "Contato",
          avatar:
            corretor.avatarUrl || `https://i.pravatar.cc/100?u=${corretor.id}`,
          role: corretor.role,
        };

        setContatoSelecionado(contato);

        // 🔄 Carrega histórico logo após conectar
        if (isConnected) {
          await carregarHistorico(contato.id);
        }
      } catch (error) {
        console.error("❌ Erro ao abrir chat:", error);
      } finally {
        setCarregando(false);
      }
    };

    return () => {
      delete window.openChatModal;
    };
  }, [carregarHistorico, isConnected]);

  /* ===========================================================
     🔁 Recarrega histórico após reconexão do socket
  ============================================================ */
  useEffect(() => {
    if (contatoSelecionado && isConnected) {
      console.log("🔄 Recarregando histórico após reconexão...");
      carregarHistorico(contatoSelecionado.id);
    }
  }, [contatoSelecionado, isConnected, carregarHistorico]);

  /* ===========================================================
     🧾 Carrega lista de conversas (modo WhatsApp)
  ============================================================ */
  useEffect(() => {
    if (modoLista && isConnected) {
      listarConversas(setConversas);
    }
  }, [modoLista, isConnected, listarConversas]);

  /* ===========================================================
     🔙 Voltar para a lista de conversas
  ============================================================ */
  const voltarParaLista = () => {
    setModoLista(true);
    setContatoSelecionado(null);
  };

  /* ===========================================================
     🎨 Função para obter avatar correto com fallback
  ============================================================ */
  const obterAvatar = (avatar?: string, id?: number): string => {
    // ✅ Prioridade 1: avatar como URL HTTP
    if (avatar && avatar.startsWith("http")) {
      return avatar;
    }
    
    // ✅ Prioridade 2: avatar como caminho local
    if (avatar && avatar.startsWith("/")) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${avatar}`;
    }
    
    // ✅ Fallback: Avatar genérico
    return `https://i.pravatar.cc/100?u=${id || 0}`;
  };

  /* ===========================================================
     🧠 Render
  ============================================================ */
  
  // ✅ Se não houver usuário logado, não renderiza o chat
  if (!usuarioLogadoId) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* 🟢 Botão flutuante */}
      <Dialog.Trigger asChild>
        <button
          onClick={() => {
            setOpen(true);
            setModoLista(true);
          }}
          className="
            !fixed !bottom-6 !right-6 
            !bg-green-600 hover:!bg-green-700 
            !text-white !p-4 !rounded-full 
            !shadow-lg !z-50 !cursor-pointer
            !transition-all !duration-200
          "
          aria-label="Abrir chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="!w-6 !h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.38-3.24A7.58 7.58 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </Dialog.Trigger>

      {/* 💬 Janela principal */}
      <Dialog.Portal>
        <Dialog.Overlay className="!fixed !inset-0 !bg-transparent !z-40" />
        <Dialog.Content
          aria-describedby="chat-modal-description"
          aria-labelledby="chat-modal-title"
          className="
            !fixed !z-50 !bottom-20 !right-8
            !bg-white !rounded-3xl 
            !shadow-2xl 
            !w-[380px] !h-[540px]
            !flex !flex-col
            !overflow-hidden
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

          {/* ======================= Corpo do chat ======================= */}
          {modoLista ? (
            <ChatList
              corretores={conversas}
              onSelectCorretor={(c) => {
                console.log(`✅ Selecionando contato: ${c.nome} (ID: ${c.id})`);
                // 🧹 Zera contador de não lidas imediatamente
                zerarContador(c.id, c.nome);
                setContatoSelecionado(c);
                setModoLista(false);
              }}
              userId={usuarioLogadoId}
              userRole={usuarioLogadoRole}
              digitandoPor={digitandoPor}
              contadorNaoLidas={contadorNaoLidas}
              usuariosOnline={onlineUsers}
            />
          ) : contatoSelecionado ? (
            <>
              {/* Cabeçalho atualizado com status em tempo real */}
              <ChatHeader
                nome={contatoSelecionado.nome}
                avatar={obterAvatar(contatoSelecionado.avatar, contatoSelecionado.id)}
                userId={contatoSelecionado.id}
                onlineUsers={onlineUsers}
                onVoltar={voltarParaLista}
              />

              {/* Conteúdo */}
              {carregando ? (
                <div className="!flex !flex-1 !items-center !justify-center !text-gray-500">
                  Carregando conversa...
                </div>
              ) : (
                <>
                  <ChatMessages
                    messages={messages}
                    userId={usuarioLogadoId!}
                    destinatarioId={contatoSelecionado.id}
                    digitandoPor={digitandoPor}
                  />
                  <ChatInput
                    defaultValue={mensagemInicial}
                    onSend={(texto) => {
                      // Envia a mensagem via socket
                      sendMessage(contatoSelecionado.id, texto);

                      // Se havia uma mensagem inicial pré-definida, removemos
                      // ela após o primeiro envio para que não reapareça.
                      if (mensagemInicial) {
                        setMensagemInicial("");
                      }
                    }}
                    isConnected={isConnected}
                    userId={usuarioLogadoId!}
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
