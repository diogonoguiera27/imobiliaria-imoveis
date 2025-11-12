import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/hooks/useChatSocket";
import { formatarHorario, formatarDia } from "@/utils/formatarHorario";

interface ChatMessagesProps {
  messages: ChatMessage[];
  userId: number;
  destinatarioId: number;
  digitandoPor?: number | null; // 👈 novo: indica quem está digitando
}

/**
 * 💬 Exibe as mensagens do chat com agrupamento estilo WhatsApp
 * + separadores de dia (Hoje, Ontem, Segunda, etc)
 * + horários nas bolhas
 */
export default function ChatMessages({
  messages,
  userId,
  destinatarioId,
  digitandoPor,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------------------------
     🔄 Scroll automático até a última mensagem
  ------------------------------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, digitandoPor]);

  /* ------------------------------------------
     🧩 Agrupa mensagens consecutivas do mesmo autor
  ------------------------------------------ */
  const grupos: ChatMessage[][] = [];
  let grupoAtual: ChatMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const anterior = messages[i - 1];

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

  /* ------------------------------------------
     🎨 Renderização com separadores de dia
  ------------------------------------------ */
  const renderizarComSeparadores = () => {
    const elementos: React.ReactNode[] = [];
    let ultimoDia = "";

    for (let i = 0; i < grupos.length; i++) {
      const grupo = grupos[i];
      const primeiroMsg = grupo[0];
      const diaLabel = formatarDia(primeiroMsg.criadoEm);

      // 📅 Adiciona separador de dia se mudou
      if (diaLabel !== ultimoDia) {
        elementos.push(
          <div key={`dia-${diaLabel}-${i}`} className="!text-center !my-4">
            <span className="!bg-gray-300 !text-gray-700 !text-xs !px-3 !py-1 !rounded-full !shadow-sm">
              {diaLabel}
            </span>
          </div>
        );
        ultimoDia = diaLabel;
      }

      // 💬 Renderiza grupo de mensagens
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

              {/* ⏰ Horário da mensagem (canto inferior direito) */}
              <span
                className={`!text-[11px] !self-end !flex-shrink-0 ${
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

  return (
    <div
      className="
        !flex-1 
        !p-4 
        !bg-gray-50 
        !overflow-x-hidden 
        !overflow-y-auto 
        !scroll-smooth
      "
    >
      {messages.length === 0 ? (
        <p className="!text-gray-400 !text-sm !text-center mt-5">
          Nenhuma mensagem ainda. Inicie uma conversa 💬
        </p>
      ) : (
        renderizarComSeparadores()
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

      {/* Âncora invisível para scroll automático */}
      <div ref={messagesEndRef} />
    </div>
  );
}
