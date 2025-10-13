import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Imovel } from "@/types";
import { Textarea } from "../ui/textarea";
import { enviarContato } from "@/service/propertyService";

const contatoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato: (xx) xxxxx-xxxx"),
  mensagem: z.string().min(5, "Mensagem muito curta"),
});

type ContatoFormData = z.infer<typeof contatoSchema>;

interface ContatoCardProps {
  imovel?: Imovel | null;
}

export function ContatoCard({ imovel }: ContatoCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  });

  const onSubmit = async (data: ContatoFormData) => {
    if (!imovel?.id) {
      alert("Imóvel não encontrado. Tente novamente.");
      return;
    }

    const nomeProprietario = imovel.user?.nome ?? "proprietário";
    const numeroWhatsapp = imovel.user?.telefone
      ? imovel.user.telefone.replace(/\D/g, "")
      : "";

    try {
      await enviarContato(imovel.id, data);
      console.log("✅ Contato registrado no backend:", {
        imovelId: imovel.id,
        ...data,
      });
    } catch (err) {
      console.error("❌ Erro ao registrar contato:", err);
    }

    if (!numeroWhatsapp) {
      alert("Número de WhatsApp do proprietário não disponível.");
      return;
    }

    const texto = `Olá, ${nomeProprietario}! Meu nome é ${data.nome}, meu e-mail é ${data.email}, meu telefone é ${data.telefone}. Mensagem: ${data.mensagem}`;
    const url = `https://wa.me/55${numeroWhatsapp}?text=${encodeURIComponent(
      texto
    )}`;
    window.open(url, "_blank");

    reset();
  };

  return (
    <section className="!w-full !flex !justify-center">
      <div
        className="
          !w-full  
          !mx-auto 
          !flex !justify-end 
          !px-0
        "
      >
        <div
          className="
            !w-full 
            md:!max-w-sm 
            !bg-white 
            !rounded-xl 
            !shadow-md 
            !border !border-gray-200 
            !p-6 
            !space-y-6
          "
        >
          {/* 🔹 Cabeçalho */}
          <div>
            <h2 className="!text-lg !font-bold !text-gray-900">
              Fale com o Proprietário
            </h2>
            <p className="!text-sm !text-gray-500">
              Preencha os campos abaixo e entraremos em contato com você.
            </p>
          </div>

          {/* 🔹 Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
            {/* Nome */}
            <div>
              <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
                Seu nome:
              </Label>
              <Input
                type="text"
                placeholder="Digite seu nome"
                {...register("nome")}
                className="!w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:!outline-none focus:!ring-2 focus:!ring-pink-500"
              />
              {errors.nome && (
                <p className="!text-xs !text-red-500 !mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>

            {/* E-mail / Telefone */}
            <div className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
              <div>
                <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
                  E-mail:
                </Label>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register("email")}
                  className="!w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:!outline-none focus:!ring-2 focus:!ring-pink-500"
                />
                {errors.email && (
                  <p className="!text-xs !text-red-500 !mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
                  Celular:
                </Label>
                <Input
                  type="tel"
                  placeholder="(xx) xxxxx-xxxx"
                  {...register("telefone")}
                  className="!w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:!outline-none focus:!ring-2 focus:!ring-pink-500"
                />
                {errors.telefone && (
                  <p className="!text-xs !text-red-500 !mt-1">
                    {errors.telefone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
                Mensagem:
              </Label>
              <Textarea
                placeholder="Escreva sua mensagem aqui..."
                {...register("mensagem")}
                className="!w-full !h-24 !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm !leading-relaxed focus:!outline-none focus:!ring-2 focus:!ring-pink-500"
              />
              {errors.mensagem && (
                <p className="!text-xs !text-red-500 !mt-1">
                  {errors.mensagem.message}
                </p>
              )}
            </div>

            {/* Botão */}
            <Button
              type="submit"
              className="!w-full !bg-green-700 hover:!bg-green-800 !text-white !font-bold !py-2 !rounded-md !transition"
              disabled={!imovel?.id}
            >
              Enviar Mensagem
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
