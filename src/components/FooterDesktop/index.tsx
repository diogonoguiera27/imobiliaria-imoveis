import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaWhatsapp } from "react-icons/fa";

const emailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface FooterDesktopProps {
  variant?: "grid" | "list" | "create" | "gridFix" | "gridTight";
}

/**
 * ✅ FooterDesktop — alinhado perfeitamente com o layout principal.
 * - variant="create": para página de cadastro
 * - variant="gridFix" | "gridTight": para a grade de imóveis
 * - variant="list": visual padrão
 */
export const FooterDesktop = ({ variant = "list" }: FooterDesktopProps) => {
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
  };

  // 🔹 Container principal — largura e padding equivalentes ao layout de cards
  const containerClass =
    variant === "create"
      ? "!w-full !max-w-6xl !mx-auto !px-6 lg:!px-20"
      : variant === "gridFix" || variant === "gridTight"
      ? "!w-full !max-w-6xl !mx-auto !px-6 md:!px-10" // ⬅️ mesmo espaçamento lateral da grid dos cards
      : "!w-full !max-w-6xl !mx-auto !px-6 md:!px-10";

  // 🔹 Card interno (caixa cinza do footer)
  const cardClass =
    variant === "create"
      ? "!bg-gradient-to-r !from-gray-500 !to-gray-700 !w-full !max-w-[1024px] !mx-auto !p-10  !rounded-xl !shadow-md !flex !flex-col !items-center !text-center !space-y-5 !border !border-gray-400"
      : "!bg-gradient-to-r !from-gray-500 !to-gray-700 !w-full !max-w-[1152px] !mx-auto !p-8 !rounded-xl !shadow-md !flex !flex-col !items-center !text-center !space-y-5 !border !border-gray-400";

  return (
    <footer className="!bg-gradient-to-r !from-gray-500 !to-gray-700 !py-10 !w-full">
      <div className={containerClass}>
        <div className={cardClass}>
          {/* 🔹 Cabeçalho */}
          <div>
            <h2 className="!text-xl !font-bold !text-white">
              Fique por dentro das novidades
            </h2>
            <p className="!text-white !text-sm">Receba ofertas exclusivas!</p>
          </div>

          {/* 🔹 Formulário */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="!w-full !flex !flex-row !justify-center !items-center 
                       !gap-3 !max-w-[720px]"
          >
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              {...register("email")}
              className="!px-4 !py-3 !rounded-md !border !border-gray-300 !shadow-sm 
                         !w-full focus:!outline-none focus:!ring-2 focus:!ring-red-500"
            />
            <button
              type="submit"
              className="!bg-red-600 !text-white !px-8 !py-3 !rounded-md 
                         !text-base hover:!bg-red-700 !transition"
            >
              Enviar
            </button>
          </form>

          {/* 🔹 Mensagens de validação */}
          {errors.email && (
            <p className="!text-red-100 !text-sm">{errors.email.message}</p>
          )}
          {formStatus === "success" && (
            <p className="!text-green-100 !text-sm">
              Mensagem enviada com sucesso!
            </p>
          )}

          {/* 🔹 Contato WhatsApp */}
          <div className="!text-sm !text-white">
            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/5562994035584"
                target="_blank"
                rel="noopener noreferrer"
                className="!inline-flex !items-center !gap-1 
                           !text-green-200 !font-medium hover:!underline"
              >
                <FaWhatsapp className="!text-lg" />
                (99) 99999-9999
              </a>
            </p>
          </div>

          {/* 🔹 Direitos autorais */}
          <p className="!text-xs !text-white">
            &copy; {new Date().getFullYear()} Sua Imobiliária. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
