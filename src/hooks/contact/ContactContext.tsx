import { createContext, useContext, useState, ReactNode } from "react";
import { Imovel } from "@/types";


interface ContactContextType {
  selectedImovel: Imovel | null;
  showContactModal: boolean;
  showPhoneModal: boolean;
  openContactModal: (imovel: Imovel) => void;
  openPhoneModal: (imovel: Imovel) => void;
  closeModals: () => void;
}


const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  
  const openContactModal = (imovel: Imovel) => {
    
    setSelectedImovel(imovel);
    setShowContactModal(true);
  };

  
  const openPhoneModal = (imovel: Imovel) => {
    
    setSelectedImovel(imovel);
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


export function useContactContext() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error(
      "useContactContext deve ser usado dentro de ContactProvider"
    );
  }
  return ctx;
}
