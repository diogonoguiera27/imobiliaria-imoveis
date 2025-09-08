
import { useState, type ReactNode } from "react";
import type { Imovel } from "@/types";
import { ContactContext } from "./ContactContext";

export function ContactProvider({ children }: { children: ReactNode }) {
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const openContactModal = (imovel: Imovel) => {
    setSelectedImovel(imovel);
    setShowPhoneModal(false);   
    setShowContactModal(true);
  };

  const openPhoneModal = (imovel: Imovel) => {
    setSelectedImovel(imovel);
    setShowContactModal(false);
    setShowPhoneModal(true);
  };

  const closeModals = () => {
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
