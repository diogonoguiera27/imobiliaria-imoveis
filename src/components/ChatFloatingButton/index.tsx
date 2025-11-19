import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatModal from "@/components/ChatModal";
import useAuth from "@/hooks/auth/useAuth";
import { useLocation } from "react-router-dom";
import { useChat } from "@/hooks/usechat";
import type { Contato } from "@/hooks/useChatSocket";
import { socket } from "@/service/socket";

/**
 * 💬 Botão flutuante global com WebSocket em tempo real
 */
export default function ChatFloatingButton() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();

  const usuarioLogadoId = user?.id;

  // 📌 Vem do ChatProvider (global)
  const { contatosComMensagens } = useChat();

  // 📌 Estado local (para atualizar imediatamente)
  const [contador, setContador] = useState(contatosComMensagens);

  // Sincroniza com o provider quando mudar
  useEffect(() => {
    setContador(contatosComMensagens);
  }, [contatosComMensagens]);

  // controle de rota login
  const [isLoginRoute, setIsLoginRoute] = useState(false);

  useEffect(() => {
    setIsLoginRoute(pathname.startsWith("/login"));
  }, [pathname]);

  /* ============================================================
     🎧 LISTENER DO SOCKET → Notificações em tempo real
  ============================================================ */
  useEffect(() => {
    if (!usuarioLogadoId) return;

    // Nota: não registramos listener para 'nova_mensagem_lista' aqui
    // para evitar contabilizar duplicadamente — o hook `useChatSocket`
    // já gerencia o estado global `contatosComMensagens` e emite
    // `contatos_atualizados` / `atualizar_notificacao_global` que
    // o botão escuta abaixo.

    // Atualiza o badge com os dados globais quando o backend emite
    // 'atualizar_notificacao_global' (totalContatos) — isso garante
    // que o botão responda instantaneamente a mudanças feitas no server.
    const handleAtualizarNotificacaoGlobal = (data: { totalContatos?: number }) => {
      console.log("🔔 [BOTÃO] atualizar_notificacao_global recebida:", data);
      // Se o backend enviar detalhes (via useChatSocket), ele já terá
      // excluído o próprio usuário. Mas quando recebemos apenas
      // 'totalContatos' sem detalhes, usamos o valor informado.
      // Para segurança, se houver detalhes (payload maior), o provider
      // é a fonte de verdade; caso contrário, usamos o total.
      // Aqui aceitamos o `totalContatos` direto.
      setContador(data?.totalContatos || 0);
    };

    socket.on("atualizar_notificacao_global", handleAtualizarNotificacaoGlobal);

    // Também atualiza o badge quando a lista de contatos chega — útil
    // se o backend enviar o evento 'contatos_atualizados' com o número
    // de não-lidas por contato.
    const handleContatosAtualizados = (lista: Contato[]) => {
      console.log("🔔 [BOTÃO] contatos_atualizados recebida:", lista);
      const total = Array.isArray(lista)
        ? lista
            .filter((c) => c.id !== usuarioLogadoId)
            .filter((c) => (c.naoLidas || 0) > 0).length
        : 0;
      setContador(total);
    };

    socket.on("contatos_atualizados", handleContatosAtualizados);

    return () => {
      socket.off("atualizar_notificacao_global", handleAtualizarNotificacaoGlobal);
      socket.off("contatos_atualizados", handleContatosAtualizados);
    };
  }, [usuarioLogadoId]);

  /* ============================================================
     🧹 LISTENER GLOBAL PARA ZERAR BADGE AO ABRIR CONVERSA
  ============================================================ */
  useEffect(() => {
    const limpar = () => {
      console.log("🧹 Zerando badge pelo evento global...");
      setContador(0);
    };

    window.addEventListener("zerar_badge_chat", limpar);

    return () => {
      window.removeEventListener("zerar_badge_chat", limpar);
    };
  }, []);

  /* ============================================================
     🔒 Condições de exibição
  ============================================================ */
  if (!usuarioLogadoId) return null;
  if (isLoginRoute) return null;
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <div className="!fixed !bottom-6 !right-6 !z-[9999]">
        <button
          onClick={() => setOpen(true)}
          className="
            !relative
            !bg-green-600 hover:!bg-green-700
            !text-white !p-4
            !rounded-full
            !shadow-lg
            !transition-all !duration-200
            hover:!scale-110
            active:!scale-95
            focus:!outline-none focus:!ring-2 focus:!ring-green-400
          "
        >
          <MessageCircle className="!w-6 !h-6" />

          {/* BADGE — TEMPO REAL */}
          {contador > 0 && (
            <span
              className="
                !absolute !-top-1 !-right-1
                !bg-red-500 !text-white
                !text-[10px] !font-bold
                !rounded-full
                !w-5 !h-5
                !flex !items-center !justify-center
                !shadow-md
              "
            >
              {contador > 99 ? "99+" : contador}
            </span>
          )}
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <ChatModal open={open} onOpenChange={(estado) => setOpen(estado)} />
      )}
    </>
  );
}
