// src/components/ContactPhoneModal.tsx
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FaPhoneAlt, FaWhatsapp, FaUserTie, FaClock } from "react-icons/fa";
import { useContactContext } from "@/hooks/contact/useContact";

export function ContactPhoneModal() {
  const { selectedImovel } = useContactContext();

   if (!selectedImovel) return null;

  const nomeProprietario = selectedImovel.user?.nome || "Proprietário";
  const telefoneOriginal = selectedImovel.user?.telefone || null;
  const numeroWhatsapp = telefoneOriginal ? telefoneOriginal.replace(/\D/g, "") : null;

  return (
    <DialogContent className="!max-w-md !rounded-xl !p-6">
      <DialogHeader>
        <DialogTitle className="!text-lg !font-bold !text-gray-800">
          Fale com {nomeProprietario}
        </DialogTitle>
        <DialogDescription className="!text-sm !text-gray-500">
          Contato rápido direto com o proprietário.
        </DialogDescription>
      </DialogHeader>

      <div className="!space-y-4 !mt-4 !text-sm !text-gray-700">
        {telefoneOriginal && (
          <div className="!flex !items-center !gap-2">
            <FaPhoneAlt className="!text-red-600" />
            <span>
              <strong>Telefone:</strong> {telefoneOriginal}
            </span>
          </div>
        )}

        {numeroWhatsapp && (
          <div className="!flex !items-center !gap-2">
            <FaWhatsapp className="!text-green-600" />
            <span>
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/55${numeroWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="!text-green-600 hover:!underline !font-medium"
              >
                {telefoneOriginal}
              </a>
            </span>
          </div>
        )}

        <div className="!flex !items-center !gap-2">
          <FaUserTie className="!text-blue-600" />
          <span>
            <strong>Proprietário:</strong> {nomeProprietario}
          </span>
        </div>

        <div className="!flex !items-center !gap-2">
          <FaClock className="!text-yellow-600" />
          <span>
            <strong>Atendimento:</strong> Todos os dias, horário comercial
          </span>
        </div>
      </div>
    </DialogContent>
  );
}

export default ContactPhoneModal;
