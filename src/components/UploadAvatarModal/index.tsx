import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { toast } from "react-toastify";
import { uploadAvatar } from "@/service/authService";

interface UploadAvatarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadAvatarModal({ open, onClose }: UploadAvatarModalProps) {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleUpload() {
    if (!file || !user) return;

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar(user.id, file); // ✅ serviço separado
      updateUser({ ...user, avatarUrl }); // ✅ contexto atualizado
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
      <DialogContent className="!max-w-sm !p-6 !bg-white !rounded-xl">
        <h2 className="!text-lg !font-bold mb-4">Atualizar Foto de Perfil</h2>

        <div className="!mb-4 text-center">
          {preview ? (
            <img src={preview} alt="Prévia" className="!w-24 !h-24 !rounded-full !mx-auto" />
          ) : (
            <p className="!text-sm !text-neutral-500">Selecione uma imagem</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="!mb-4"
        />

        <div className="!flex !justify-end !gap-2">
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
