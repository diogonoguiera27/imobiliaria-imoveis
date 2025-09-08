// src/hooks/contact/ContactContext.ts
import { createContext } from "react";
import type { Imovel } from "@/types";

export interface ContactContextType {
  selectedImovel: Imovel | null;
  showContactModal: boolean;
  showPhoneModal: boolean;
  openContactModal: (imovel: Imovel) => void;
  openPhoneModal: (imovel: Imovel) => void;
  closeModals: () => void;
}

export const ContactContext = createContext<ContactContextType | undefined>(
  undefined
);
