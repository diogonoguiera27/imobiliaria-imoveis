import { useContext } from "react";
import { ChatContext } from "@/context/chatContext";

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat deve ser usado dentro de <ChatProvider>");
  }
  return ctx;
}
 