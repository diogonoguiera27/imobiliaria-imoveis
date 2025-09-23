import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { uploadAvatar } from "@/service/authService";
import { useAuth } from "@/hooks/auth";

interface UploadAvatarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadAvatarModal({ open, onClose }: UploadAvatarModalProps) {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFile(null);
    }
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  }

  async function handleUpload() {
    if (!file || !user) return;

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar(user.id, file);
      updateUser({ ...user, avatarUrl });
      toast.success("Foto de perfil atualizada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      toast.error("Erro ao atualizar foto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
  className="
    !bg-white 
    !rounded-xl 
    !p-6 
    !flex 
    !flex-col 
    !items-center 
    !w-[90%]          /* sempre ocupa 90% da tela no mobile */
    !max-w-[400px]    /* limite fixo para desktop */
    !mx-auto          /* centraliza horizontalmente */
  "
>
  <h2 className="!text-lg !font-bold !text-center !mb-4">
    Atualizar Foto de Perfil
  </h2>

  <label className="!bg-red-50 !text-red-700 !py-2 !px-4 !rounded-md !cursor-pointer !text-sm !font-medium !hover:bg-red-100">
    Selecionar imagem
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="!hidden"
    />
  </label>

  <div className="!mt-3 !text-center !text-sm !text-gray-600">
    {file ? (
      <span>
        Arquivo selecionado: <strong>{file.name}</strong>
      </span>
    ) : (
      <span>Nenhum arquivo selecionado</span>
    )}
  </div>

  <div className="!flex !justify-center !gap-4 !mt-6 w-full">
    <Button onClick={onClose} variant="ghost" className="!px-4">
      Cancelar
    </Button>
    <Button
      onClick={handleUpload}
      disabled={loading || !file}
      className="!bg-red-600 hover:!bg-red-700 !text-white !px-6"
    >
      {loading ? "Salvando..." : "Salvar"}
    </Button>
  </div>
</DialogContent>

    </Dialog>
  );
}
