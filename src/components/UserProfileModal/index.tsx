import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, HeartIcon } from "lucide-react";
import defaultAvatar from "@/assets/defaultAvatar.jpg";

export default function PerfilUsuarioModal() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

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
        <div className="!w-full !flex !items-start !gap-4 !mb-4 !pr-16 relative">
          <img
            src={avatar}
            alt={user.nome}
            className="!w-14 !h-14 !rounded-full !object-cover flex-shrink-0"
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <h3
              className="!text-lg !font-bold !leading-tight truncate"
              title={user.nome}
            >
              {user.nome}
            </h3>

            {/* Para e-mails longos: quebrar ou truncar */}
            <p
              className="!text-sm !text-neutral-500 break-all sm:truncate"
              title={user.username || user.email}
            >
              {user.username || user.email}
            </p>
          </div>

          <Button
            size="sm"
            className="absolute top-0 right-4 !px-3 !py-1 !text-xs !text-white !bg-red-600 !hover:bg-red-500 whitespace-nowrap"
            onClick={() => navigate("/profile")}
          >
            VER PERFIL
          </Button>
        </div>

        {/* Links rápidos */}
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
