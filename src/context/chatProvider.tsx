import { ReactNode, useEffect } from "react";
import { ChatContext } from "./chatContext";
import { useChatSocket } from "@/hooks/useChatSocket";
import { socket } from "@/service/socket";

interface ChatProviderProps {
  userId?: number;
  children: ReactNode;
}

export function ChatProvider({ userId, children }: ChatProviderProps) {
  const chat = useChatSocket(userId);

  // Garante registro imediato quando userId mudar
  useEffect(() => {
    if (userId && socket.connected) {
      socket.emit("registrar_usuario", userId);
      socket.emit("listar_contatos", { userId });
      socket.emit("get_online_users");
    }
  }, [userId]);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}
