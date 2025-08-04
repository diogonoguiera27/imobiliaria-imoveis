// components/Profile/ProfileSidebar.tsx
import { useState } from "react";
import {  Pencil } from "lucide-react";
import defaultAvatar from "@/assets/defaultAvatar.jpg";
import UploadAvatarModal from "../UploadAvatarModal";
import { useAuth } from "@/hooks/auth"; // ← importante para manter dados atualizados

export default function ProfileSidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth(); // ← pega direto do contexto global

  if (!user) return null;

  const avatar = user.avatarUrl
  ? `http://localhost:3333${user.avatarUrl}` // ✅ Caminho completo
  : defaultAvatar;

  return (
    <div className="!w-full md:!w-[320px] !flex !flex-col !gap-6">
      {/* Card do perfil */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !text-center">
        <div className="!relative !w-24 !h-24 !mx-auto !mb-4">
          <img
            src={avatar}
            alt={user.nome}
            className="!w-24 !h-24 !rounded-[24px] !border-4 !border-white !object-cover"
          />
          <button
            title="Alterar foto"
            onClick={() => setModalOpen(true)}
            className="!absolute !bottom-1 !right-1 !bg-white !p-1 !rounded-full !shadow !text-purple-600 hover:!text-white hover:!bg-purple-600 transition"
          >
            <Pencil size={14} />
          </button>
        </div>

        <h2 className="!text-lg !font-bold !mb-1 !text-gray-800">{user.nome}</h2>
        <p className="!text-sm !text-purple-500 !mb-4">{user.username || user.email}</p>

        <div className="!bg-white !rounded-lg !p-4 !text-left !space-y-3 !border !border-red-100">
          <div>
            <p className="!text-xs !text-gray-500">E-mail</p>
            <p className="!text-sm !font-medium !text-gray-800">{user.email}</p>
          </div>
          <div>
            <p className="!text-xs !text-gray-500">Telefone</p>
            <p className="!text-sm !font-medium !text-gray-800">{user.telefone}</p>
          </div>
          <div>
            <p className="!text-xs !text-gray-500">Cidade</p>
            <p className="!text-sm !font-medium !text-gray-800">{user.cidade}</p>
          </div>
        </div>
      </div>

      
  

      {/* Modal de Upload */}
      <UploadAvatarModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
