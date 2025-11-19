import { useState, useEffect, useRef } from "react";
import { socket } from "@/service/socket";

interface ChatInputProps {
  onSend: (message: string) => void;
  defaultValue?: string;
  userId: number;
  destinatarioId: number;
}

export default function ChatInput({
  onSend,
  defaultValue,
  userId,
  destinatarioId,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (defaultValue) setMessage(defaultValue);
  }, [defaultValue]);

  // 🔹 Auto-ajuste da altura
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // ✍️ Evento de digitação
  const handleTyping = (text: string) => {
    setMessage(text);
    if (!socket.connected) return;
    if (!text.trim()) return;

    socket.emit("digitando", { remetenteId: userId, destinatarioId });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      socket.emit("parou_digitando", { remetenteId: userId, destinatarioId });
    }, 2000);
  };

  // 🚀 Enviar mensagem
  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");

    if (textareaRef.current) textareaRef.current.style.height = "40px";
    socket.emit("parou_digitando", { remetenteId: userId, destinatarioId });
  };

  // ⏎ Enter envia / Shift+Enter quebra linha
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="!border-t !p-3 !flex !items-end !gap-2 !bg-white">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Escreva uma mensagem..."
        value={message}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={!socket.connected}
        className="
          !flex-1 
          !resize-none 
          !border 
          !border-gray-300 
          !rounded-2xl
          !px-4 
          !py-2 
          !outline-none 
          focus:!border-green-500
          disabled:!bg-gray-100 
          disabled:!cursor-not-allowed
          !text-[15px] 
          !leading-snug 
          !overflow-hidden
          !max-h-[180px]
          !whitespace-pre-wrap 
          !break-words
        "
        style={{ transition: "height 0.1s ease-out" }}
      />

      <button
        onClick={handleSend}
        disabled={!socket.connected || !message.trim()}
        className="
          !bg-green-600 
          hover:!bg-green-700 
          !text-white 
          !cursor-pointer 
          !rounded-full 
          !px-4 
          !py-2 
          disabled:!opacity-50 
          disabled:!cursor-not-allowed
          !transition-all
        "
        title="Enviar mensagem"
      >
        ➤
      </button>
    </div>
  );
}
