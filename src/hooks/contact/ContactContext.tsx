import { createContext, useContext, useState, ReactNode } from "react";
import { Imovel } from "@/types";

/* 🔹 Tipagem do contexto */
interface ContactContextType {
  selectedImovel: Imovel | null;
  showContactModal: boolean;
  showPhoneModal: boolean;
  openContactModal: (imovel: Imovel) => void;
  openPhoneModal: (imovel: Imovel) => void;
  closeModals: () => void;
}

/* 🔹 Criação do contexto */
const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  /* Abre modal de mensagem */
  const openContactModal = (imovel: Imovel) => {
    console.log("🟢 [DEBUG] Abrindo modal de contato com imóvel:", imovel);
    setSelectedImovel(imovel);
    setShowContactModal(true);
  };

  /* Abre modal de telefone */
  const openPhoneModal = (imovel: Imovel) => {
    console.log("🟢 [DEBUG] Abrindo modal de telefone com imóvel:", imovel);
    setSelectedImovel(imovel);
    setShowPhoneModal(true);
  };

  /* Fecha ambos os modais */
  const closeModals = () => {
    console.log("🟡 [DEBUG] Fechando modais de contato/telefone");
    setShowContactModal(false);
    setShowPhoneModal(false);
    setSelectedImovel(null);
  };

  return (
    <ContactContext.Provider
      value={{
        selectedImovel,
        showContactModal,
        showPhoneModal,
        openContactModal,
        openPhoneModal,
        closeModals,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

/* 🔹 Hook customizado */
export function useContactContext() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error(
      "useContactContext deve ser usado dentro de ContactProvider"
    );
  }
  return ctx;
}
