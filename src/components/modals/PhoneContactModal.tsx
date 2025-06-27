// components/ContactPhoneModal.tsx
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FaPhoneAlt, FaWhatsapp, FaUserTie, FaClock } from "react-icons/fa";

export default function ContactPhoneModal() {
  return (
    <DialogContent className="!max-w-md !rounded-xl !p-6">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-gray-800">Fale com um Corretor Agora</DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          Contato rápido direto com um dos nossos especialistas.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-red-600" />
          <span><strong>Telefone fixo:</strong> (62) 3333-0000</span>
        </div>

        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-green-600" />
          <span>
            <strong>WhatsApp:</strong>{" "}
            <a
              href="https://wa.me/5562999990000"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-green-600 hover:underline font-medium"
            >
              (62) 99999-0000
            </a>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaUserTie className="text-blue-600" />
          <span><strong>Corretor:</strong> João da Silva (CRECI: 12345-GO)</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="text-yellow-600" />
          <span><strong>Atendimento:</strong> Segunda a Sábado, 08h às 18h</span>
        </div>
      </div>
    </DialogContent>
  );
}
