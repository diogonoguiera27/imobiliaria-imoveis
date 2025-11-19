import { createContext } from "react";
import type { ChatMessage, Contato } from "@/hooks/useChatSocket";

export interface ChatContextData {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (destinatarioId: number, conteudo: string) => void;
  carregarHistorico: (destinatarioId: number) => Promise<void>;
  listarConversas: (setLista: (lista: Contato[]) => void) => Promise<void>;
  digitandoPor: number | null;
  contadorNaoLidas: Record<number, number>;
  setContadorNaoLidas: React.Dispatch<
    React.SetStateAction<Record<number, number>>
  >;
  onlineUsers: number[];
  contatosComMensagens: number;
}

export const ChatContext = createContext<ChatContextData | null>(null);
