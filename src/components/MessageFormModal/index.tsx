
import { useEffect } from "react";
import {
  DialogContent,
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

  if (!selectedImovel) return null;

  return (
    <DialogContent className="!max-w-md !bg-transparent !shadow-none">
      <div className="px-4">
        <ContatoCard imovel={selectedImovel} />
      </div>
    </DialogContent>
  );
}

export default MessageFormModal;
