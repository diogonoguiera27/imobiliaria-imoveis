import { useEffect, useState } from "react";
import { socket } from "../service/socket";

export interface ChatMessage {
  content: string;
}

export function useChatSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor WebSocket:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do servidor WebSocket");
      setIsConnected(false);
    });

    socket.on("server_reply", (data: ChatMessage) => {
      console.log("📩 Mensagem do servidor:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("server_reply");
    };
  }, []);

  function sendMessage(message: string) {
    console.log("📤 Enviando mensagem:", message);
    socket.emit("test_message", { content: message });
  }

  return { isConnected, messages, sendMessage };
}
