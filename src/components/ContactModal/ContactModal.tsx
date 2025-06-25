import { DialogContent } from "@/components/ui/dialog";
import { ContatoCard } from "../ContatoCard/ContatoCard";

export function ContactModal() {
  return (
    <DialogContent className="!max-w-md !p-0">
      <ContatoCard />
    </DialogContent>
  );
}
