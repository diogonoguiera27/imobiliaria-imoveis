import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    setEmail("");
    alert("Contato salvo com sucesso!");
  };

  return (
    <footer className="!bg-gray-300 !py-6 !px-4 !w-full !flex !justify-center">
      <div className="!bg-gray-300 !w-full !max-w-xl !p-4 !rounded-xl !shadow-md !flex !flex-col !items-center !text-center !space-y-4 !border !border-gray-200">
        <div>
          <h2 className="!text-lg !font-bold !text-white">
            Fique por dentro das novidades
          </h2>
          <p className="!text-gray-600 !text-sm">
            Receba ofertas exclusivas!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="!w-full !flex !flex-col sm:!flex-row !justify-center !items-center !gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            className="!px-3 !py-2 !rounded-md !border !border-gray-300 !shadow-sm !w-full sm:!w-64 focus:!outline-none focus:!ring-2 focus:!ring-red-500"
          />
          <button
            type="submit"
            className="!bg-red-600 !text-white !px-5 !py-2 !rounded-md !text-sm hover:!bg-red-700 !transition"
          >
            Enviar
          </button>
        </form>

        <div className="!text-sm !text-gray-700">
          <p>
            WhatsApp:{" "}
            <a
              href="https://wa.me/5599999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="!inline-flex !items-center !gap-1 !text-green-600 !font-medium hover:!underline"
            >
              <FaWhatsapp className="!text-lg" />
              (99) 99999-9999
            </a>
          </p>
        </div>

        <p className="!text-xs !text-gray-400">
          &copy; {new Date().getFullYear()} Sua Imobiliária. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
