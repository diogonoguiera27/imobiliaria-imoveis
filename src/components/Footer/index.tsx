import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaWhatsapp } from "react-icons/fa";

const emailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export const Footer = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data: EmailFormData) => {
    console.log("Email:", data.email);
    setFormStatus("success");
    reset();
    alert("Contato salvo com sucesso!");
  };

  return (
    <footer className="!bg-gradient-to-r !from-gray-400 !to-gray-700 !py-6 !px-4 !w-full !flex !justify-center">
      {/* 🔹 Card centralizado e padronizado com os outros elementos da página */}
      <div className="!bg-gradient-to-r !from-gray-400 !to-gray-700 !w-full !max-w-[90%] sm:!max-w-[380px] md:!max-w-none !mx-auto !p-4 !rounded-xl !shadow-md !flex !flex-col !items-center !text-center !space-y-4 !border !border-gray-200">
        
        {/* 🔸 Título */}
        <div>
          <h2 className="!text-lg !font-bold !text-white">
            Fique por dentro das novidades
          </h2>
          <p className="!text-white !text-sm">Receba ofertas exclusivas!</p>
        </div>

        {/* 🔸 Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="!w-full !flex !flex-col sm:!flex-row !justify-center !items-center !gap-2"
        >
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            {...register("email")}
            className="!px-3 !py-2 !rounded-md !border !border-gray-300 !shadow-sm !w-full sm:!w-64 focus:!outline-none focus:!ring-2 focus:!ring-red-500"
          />
          <button
            type="submit"
            className="!bg-red-600 !text-white !px-5 !py-2 !rounded-md !text-sm hover:!bg-red-700 !transition"
          >
            Enviar
          </button>
        </form>

        {/* 🔸 Mensagens de validação */}
        {errors.email && (
          <p className="!text-red-100 !text-sm">{errors.email.message}</p>
        )}
        {formStatus === "success" && (
          <p className="!text-green-100 !text-sm">
            Mensagem enviada com sucesso!
          </p>
        )}

        {/* 🔸 Contato WhatsApp */}
        <div className="!text-sm !text-white">
          <p>
            WhatsApp:{" "}
            <a
              href="https://wa.me/5562994035584"
              target="_blank"
              rel="noopener noreferrer"
              className="!inline-flex !items-center !gap-1 !text-green-200 !font-medium hover:!underline"
            >
              <FaWhatsapp className="!text-lg" />
              (99) 99999-9999
            </a>
          </p>
        </div>

        {/* 🔸 Direitos autorais */}
        <p className="!text-xs !text-white">
          &copy; {new Date().getFullYear()} Sua Imobiliária. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};
