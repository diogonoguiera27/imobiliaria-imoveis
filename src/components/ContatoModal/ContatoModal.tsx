import { DialogContent } from "@/components/ui/dialog";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

export function ContatoModal() {
  return (
    <DialogContent className="!bg-white !rounded-xl !shadow-xl !max-w-md !mx-auto !p-6">
      <h2 className="!text-xl !font-bold !text-gray-800 mb-4">Entre em Contato</h2>

      <div className="!space-y-4 !text-sm !text-gray-700">
        <p>
          A <strong>Imobiliária Luxury</strong> atua há mais de 10 anos no mercado de imóveis
          de alto padrão, oferecendo segurança, transparência e atendimento exclusivo.
        </p>

        <div>
          <p><strong>Telefone:</strong> (62) 3232-1234</p>
          <p>
            <strong>WhatsApp:</strong>{" "}
            <a
              href="https://wa.me/5562987654321"
              target="_blank"
              rel="noopener noreferrer"
              className="!text-green-600 !font-semibold !hover:underline"
            >
              (62) 98765-4321
            </a>
          </p>
          <p><strong>Email:</strong> atendimento@imobiliaria.com</p>
        </div>

        <div className="flex !items-start !gap-2">
          <FaMapMarkerAlt className="mt-1" />
          <span>
            Av. T-63, nº 1000<br />
            Setor Bueno, Goiânia - GO
          </span>
        </div>

        <div className="flex !items-center !gap-2">
          <FaClock />
          <span>
            Atendimento: Seg à Sex - 08h às 18h / Sáb - 08h às 12h
          </span>
        </div>
      </div>
    </DialogContent>
  );
}
