import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updateEmail } from "@/service/authService";

import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";


const emailSchema = z.object({
  newEmail: z.string().email("E-mail inválido"),
  motivo: z.string().min(3, "Por favor informe o motivo da alteração"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
}

export default function AlterarEmailModal({ open, onClose, currentEmail }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const [loading, setLoading] = useState(false);
  const { user, token, updateUser } = useAuth();

  const handleFormSubmit = async (data: EmailFormData) => {
    if (!user || !token) {
      toast.error("Usuário não autenticado");
      return;
    }

    setLoading(true);
    try {
      const response = await updateEmail(user.id, data, token);
      toast.success("E-mail atualizado com sucesso!");
      updateUser(response.user);
      reset();
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            "Erro ao atualizar e-mail";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!bg-white !text-gray-800 !rounded-xl !shadow-xl !max-w-md !p-6">
        <DialogHeader>
          <DialogTitle className="!text-xl !font-bold">Alterar e-mail</DialogTitle>
          <p className="!text-sm !text-gray-500">
            Por motivos de segurança, nossa equipe validará a alteração.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="!space-y-4">
          <div>
            <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
              E-mail atual:
            </Label>
            <div className="!bg-gray-100 !px-4 !py-2 !rounded !text-sm !text-gray-800">
              {currentEmail}
            </div>
          </div>

          <div>
            <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
              Novo e-mail:
            </Label>
            <Input
              type="email"
              placeholder="Digite o novo e-mail"
              {...register("newEmail")}
              className="w-full !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.newEmail && (
              <p className="!text-xs !text-red-500 !mt-1">
                {errors.newEmail.message}
              </p>
            )}
          </div>

          <div>
            <Label className="!block !text-sm !font-semibold !text-gray-700 !mb-1">
              Motivo da alteração:
            </Label>
            <Textarea
              placeholder="Descreva por que você precisa fazer essa alteração"
              maxLength={100}
              {...register("motivo")}
              className="w-full h-24 !border !border-gray-300 !rounded-md !px-4 !py-2 !text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.motivo && (
              <p className="!text-xs !text-red-500 !mt-1">
                {errors.motivo.message}
              </p>
            )}
          </div>

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
