import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/hooks/useChatSocket";
import { formatarHorario, formatarDia } from "@/utils/formatarHorario";

interface ChatMessagesProps {
  messages: ChatMessage[];
  userId: number;
  destinatarioId: number;
  digitandoPor?: number | null;
  carregando?: boolean; // 👈 controla estado de carregamento
}

/**
 * 💬 ChatMessages — exibe histórico agrupado + scroll automático no fim
 */
export default function ChatMessages({
  messages,
  userId,
  destinatarioId,
  digitandoPor,
  carregando = false,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [exibindo, setExibindo] = useState<ChatMessage[]>([]);

  /* ===========================================================
     🧹 Filtra duplicadas e ordena por data
  ============================================================ */
  useEffect(() => {
    const unicos = messages
      .filter(
        (v, i, a) =>
          a.findIndex(
            (x) =>
              x.id === v.id &&
              x.conteudo === v.conteudo &&
              x.remetenteId === v.remetenteId
          ) === i
      )
      .sort(
        (a, b) =>
          new Date(a.criadoEm || "").getTime() -
          new Date(b.criadoEm || "").getTime()
      );

    setExibindo(unicos);
  }, [messages]);

  /* ===========================================================
     🔄 Scroll automático até a última mensagem
  ============================================================ */
  useEffect(() => {
    if (!containerRef.current) return;

    // Pequeno delay garante que DOM terminou de renderizar
    const timeout = setTimeout(() => {
      containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
    }, 150); // 150ms = timing seguro após render

    return () => clearTimeout(timeout);
  }, [exibindo, carregando, digitandoPor]);

  /* ===========================================================
     🧩 Agrupa mensagens consecutivas do mesmo autor
  ============================================================ */
  const grupos: ChatMessage[][] = [];
  let grupoAtual: ChatMessage[] = [];

  for (let i = 0; i < exibindo.length; i++) {
    const msg = exibindo[i];
    const anterior = exibindo[i - 1];

    if (
      i === 0 ||
      msg.remetenteId !== anterior?.remetenteId ||
      new Date(msg.criadoEm || "").getTime() -
        new Date(anterior?.criadoEm || "").getTime() >
        120000 // 2 minutos = novo grupo
    ) {
      if (grupoAtual.length > 0) grupos.push(grupoAtual);
      grupoAtual = [msg];
    } else {
      grupoAtual.push(msg);
    }
  }
  if (grupoAtual.length > 0) grupos.push(grupoAtual);

  /* ===========================================================
     🎨 Renderização com separadores de dia
  ============================================================ */
  const renderizarMensagens = () => {
    const elementos: React.ReactNode[] = [];
    let ultimoDia = "";

    for (let i = 0; i < grupos.length; i++) {
      const grupo = grupos[i];
      const primeiroMsg = grupo[0];
      const diaLabel = formatarDia(primeiroMsg.criadoEm);

      if (diaLabel !== ultimoDia) {
        elementos.push(
          <div key={`dia-${diaLabel}-${i}`} className="!text-center !my-4">
            <span className="!bg-gray-200 !text-gray-600 !text-xs !px-3 !py-1 !rounded-full">
              {diaLabel}
            </span>
          </div>
        );
        ultimoDia = diaLabel;
      }

      const isMine = grupo[0].remetenteId === userId;

      elementos.push(
        <div
          key={`grupo-${i}`}
          className={`!flex !flex-col ${
            isMine ? "!items-end" : "!items-start"
          } !mb-3`}
        >
          {grupo.map((msg, j) => (
            <div
              key={`${i}-${j}`}
              className={`!rounded-2xl !px-3 !py-2 !my-1 !max-w-[75%] !shadow-sm !flex !flex-col !gap-1 ${
                isMine
                  ? "!bg-green-600 !text-white"
                  : "!bg-white !text-gray-800 !border !border-gray-200"
              }`}
            >
              <div className="!whitespace-pre-wrap !break-words !text-[15px] !leading-relaxed">
                {msg.conteudo}
              </div>
              <span
                className={`!text-[11px] !self-end ${
                  isMine ? "!text-gray-100/70" : "!text-gray-500/70"
                }`}
              >
                {formatarHorario(msg.criadoEm)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return elementos;
  };

  /* ===========================================================
     🧠 Render principal
  ============================================================ */
  return (
    <div
      ref={containerRef}
      className="
        !flex-1 
        !p-4 
        !bg-gray-50 
        !overflow-x-hidden 
        !overflow-y-auto 
        !scroll-smooth
      "
    >
      {carregando ? (
        <p className="!text-gray-400 !text-sm !text-center mt-5">
          Carregando mensagens...
        </p>
      ) : exibindo.length === 0 ? (
        <p className="!text-gray-400 !text-sm !text-center mt-5">
          Nenhuma mensagem ainda. Inicie uma conversa 💬
        </p>
      ) : (
        renderizarMensagens()
      )}

      {/* ✍️ Indicador de digitação */}
      {digitandoPor === destinatarioId && (
        <div className="!flex !items-center !gap-2 !mt-2 !ml-2">
          <div className="!flex !gap-1">
            <span className="!w-2 !h-2 !bg-gray-400 !rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="!w-2 !h-2 !bg-gray-400 !rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="!w-2 !h-2 !bg-gray-400 !rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      )}

      {/* Âncora invisível */}
      <div ref={messagesEndRef} />
    </div>
  );
}
