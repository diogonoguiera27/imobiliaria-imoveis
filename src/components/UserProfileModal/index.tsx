// src/components/PerfilUsuarioModal.tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, HeartIcon } from "lucide-react";
import defaultAvatar from "@/assets/defaultAvatar.jpg";
import { useAuth } from "@/hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function PerfilUsuarioModal() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Se ainda não carregou o usuário → exibe skeleton
  if (!user) {
    return (
      <div className="!w-10 !h-10">
        <Skeleton className="!w-10 !h-10 !rounded-full" />
      </div>
    );
  }

  const avatar = user.avatarUrl
    ? user.avatarUrl.startsWith("http")
      ? user.avatarUrl
      : `http://localhost:3333${user.avatarUrl}`
    : defaultAvatar;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={avatar}
          alt="Foto do usuário"
          className="!w-10 !h-10 !rounded-full !border-2 !border-white !cursor-pointer object-cover"
        />
      </DialogTrigger>

      <DialogContent className="!w-[92vw] !max-w-md !p-6 !bg-gradient-to-br !from-white !via-red-50 !to-red-100 !text-gray-900 !rounded-xl">
        {/* Cabeçalho do usuário */}
        <div className="!w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3 !mb-4">
          {/* Avatar + Nome + Email */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <img
              src={avatar}
              alt={user.nome}
              className="!w-14 !h-14 !rounded-full !object-cover flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <h3
                className="!text-base !font-bold !leading-tight truncate"
                title={user.nome}
              >
                {user.nome || <Skeleton className="!h-4 !w-32" />}
              </h3>
              <p
                className="!text-sm !text-neutral-500 max-w-[200px] sm:max-w-[240px] md:max-w-[300px] truncate"
                title={user.username || user.email}
              >
                {user.username || user.email || (
                  <Skeleton className="!h-3 !w-40" />
                )}
              </p>
            </div>
          </div>

          {/* Botão "Ver Perfil" */}
          <div className="w-full sm:w-auto">
            {user ? (
              <Button
                size="sm"
                className="
                  !px-6 !py-3 !text-sm !font-bold
                  !text-white !bg-red-600 !hover:bg-red-500
                  w-full sm:w-auto sm:!px-3 sm:!py-1 sm:!text-xs
                "
                onClick={() => navigate("/profile")}
              >
                VER PERFIL
              </Button>
            ) : (
              <Skeleton className="!h-9 !w-24 !rounded-md" />
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="!space-y-4">
          <div
            onClick={() => navigate("/minha-conta")}
            className="!flex !items-center !gap-4 !cursor-pointer hover:!bg-red-100 !p-2 !rounded-md"
          >
            <User className="!text-red-600" size={20} />
            <div>
              <p className="!font-semibold">Minha conta</p>
              <p className="!text-sm !text-neutral-500">
                Gerencie dados e preferências
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/favoritos")}
            className="!flex !items-center !gap-4 !cursor-pointer hover:!bg-red-100 !p-2 !rounded-md"
          >
            <HeartIcon className="!text-red-600 fill-red-600" size={20} />
            <div>
              <p className="!font-semibold">Imóveis favoritos</p>
              <p className="!text-sm !text-neutral-500">
                Veja os imóveis que você curtiu
              </p>
            </div>
          </div>
        </div>

        <hr className="!my-4 !border-neutral-300" />

        {/* Logout */}
        <button
          onClick={() => {
            signOut();
            navigate("/login");
          }}
          className="!flex !items-center !gap-2 !text-red-600 !font-semibold !hover:underline cursor-pointer"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </DialogContent>
    </Dialog>
  );
}
