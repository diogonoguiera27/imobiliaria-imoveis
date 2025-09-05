// src/components/MessageFormModal/index.tsx
import { useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContatoCard } from "../ContactFormCard";
import { useContactContext } from "@/hooks/contact/ContactContext";

function MessageFormModal() {
  const { selectedImovel } = useContactContext();

  useEffect(() => {
    if (selectedImovel) {
      console.log(
        "🟢 [DEBUG] Imóvel recebido no MessageFormModal:",
        selectedImovel
      );
    } else {
      console.warn("⚠️ [DEBUG] Nenhum imóvel recebido no MessageFormModal");
    }
  }, [selectedImovel]);

  if (!selectedImovel) {
    return (
      <DialogContent className="!max-w-md !bg-white !p-6 rounded-xl shadow">
        <DialogHeader>
          <DialogTitle>⚠️ Nenhum imóvel selecionado</DialogTitle>
          <DialogDescription>
            Clique em "Mensagem" em um imóvel para abrir o formulário de contato.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="!max-w-md !bg-transparent !shadow-none">
      <div className="px-4">
        <ContatoCard imovel={selectedImovel} />
      </div>
    </DialogContent>
  );
}

export default MessageFormModal;
