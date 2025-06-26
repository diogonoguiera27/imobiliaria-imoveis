import { DialogContent } from "@/components/ui/dialog";
import { ContatoCard } from "../ContatoCard/ContatoCard";

export function ContactModal() {
  return (
    <DialogContent className="!max-w-md !bg-transparent !shadow-none !p-0">
      <div className="px-4">
        <ContatoCard />
      </div>
    </DialogContent>
  );
}
