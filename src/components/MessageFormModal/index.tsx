import { DialogContent } from "@/components/ui/dialog";
import { ContatoCard } from "../ContactFormCard";

 function ContactModal() {
  return (
    <DialogContent className="!max-w-md !bg-transparent !shadow-none !p-0">
      <div className="px-4">
        <ContatoCard />
      </div>
    </DialogContent>
  );
}

export default ContactModal;