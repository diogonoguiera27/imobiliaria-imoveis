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
    <footer className="bg-pink-700 py-12 px-6 border-t border-gray-200 mt-12 w-full">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Fique por dentro das novidades
          </h2>
          <p className="text-gray-600 mt-2">
            Cadastre seu e-mail e receba ofertas exclusivas!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            required
            className="px-4 py-2 rounded-md border border-gray-300 w-full sm:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Enviar
          </button>
        </form>

        <div className="pt-6 border-t border-gray-300 w-full flex flex-col items-center">
          <p className="text-gray-600 mb-2">Atendimento via WhatsApp:</p>
          <a
            href="https://wa.me/5599999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline"
          >
            <FaWhatsapp className="text-xl" />
            (99) 99999-9999
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Sua Imobiliária. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
