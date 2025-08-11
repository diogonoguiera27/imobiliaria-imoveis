import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { updatePassword } from "@/service/authService";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

const schema = z
  .object({
    atual: z.string().min(1, "Senha atual obrigatória"),
    nova: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmacao: z.string().min(1, "Confirme sua nova senha"),
  })
  .refine((data) => data.nova === data.confirmacao, {
    message: "As senhas não coincidem",
    path: ["confirmacao"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AlterarSenhaModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    if (!user || !token) {
      toast.error("Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(
        user.id,
        {
          currentPassword: data.atual,
          newPassword: data.nova,
        },
        token
      );

      toast.success("Senha alterada com sucesso!");
      reset();
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            "Erro ao alterar senha";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!bg-white !text-gray-800 !rounded-xl !shadow-xl !max-w-md !p-6">
        <DialogHeader>
          <DialogTitle className="!text-xl !font-bold">Alterar Senha</DialogTitle>
          <p className="!text-sm !text-gray-500">
            Informe sua senha atual e a nova senha para continuar.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="!space-y-4">
          {/* Senha atual */}
          <div>
            <Label className="!text-sm !font-semibold !text-gray-700 !mb-1">
              Senha atual:
            </Label>
            <div className="relative">
              <Input
                type={showAtual ? "text" : "password"}
                {...register("atual")}
                className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowAtual((prev) => !prev)}
              >
                {showAtual ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.atual && (
              <p className="!text-xs !text-red-500 !mt-1">
                {errors.atual.message}
              </p>
            )}
          </div>

          {/* Nova senha */}
          <div>
            <Label className="!text-sm !font-semibold !text-gray-700 !mb-1">
              Nova senha:
            </Label>
            <div className="relative">
              <Input
                type={showNova ? "text" : "password"}
                {...register("nova")}
                className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowNova((prev) => !prev)}
              >
                {showNova ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.nova && (
              <p className="!text-xs !text-red-500 !mt-1">
                {errors.nova.message}
              </p>
            )}
          </div>

          {/* Confirmação */}
          <div>
            <Label className="!text-sm !font-semibold !text-gray-700 !mb-1">
              Confirmar nova senha:
            </Label>
            <div className="relative">
              <Input
                type={showConfirmacao ? "text" : "password"}
                {...register("confirmacao")}
                className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowConfirmacao((prev) => !prev)}
              >
                {showConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.confirmacao && (
              <p className="!text-xs !text-red-500 !mt-1">
                {errors.confirmacao.message}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="!flex !justify-end !gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="!bg-gray-200 hover:!bg-gray-300 !text-gray-700 !font-bold !py-2 !px-4 !rounded-md !transition"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="!bg-red-600 hover:!bg-red-700 !text-white !font-bold !py-2 !px-6 !rounded-md !transition"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Alterar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
