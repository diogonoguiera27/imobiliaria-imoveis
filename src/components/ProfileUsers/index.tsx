import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";

export default function PerfilUsuarioModal() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Foto do usuário"
          className="!w-10 !h-10 !rounded-full !border-2 !border-white !cursor-pointer"
        />
      </DialogTrigger>

      <DialogContent className="!max-w-sm !p-6 !bg-neutral-100 !text-white !rounded-xl">
        <div className="!flex !items-center !gap-4 !mb-4">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Gilberto Bessa"
            className="!w-14 !h-14 !rounded-full"
          />
          <div>
            <h3 className="!text-lg !font-bold !leading-tight">
              GILBERTO BESSA
            </h3>
            <p className="!text-sm !text-neutral-400">@gilberto-bessa</p>
          </div>
          <Button
            size="sm"
            className="!ml-auto !px-3 !py-1 !text-xs !text-white !bg-neutral-800 !hover:bg-neutral-500"
            onClick={() => navigate("/profile")}
          >
            VER PERFIL
          </Button>
        </div>

        <div className="!space-y-4">
          <div
            onClick={() => navigate("/minha-conta")}
            className="!flex !items-center !gap-4 !cursor-pointer hover:!bg-neutral-800 !p-2 !rounded-md"
          >
            <User className="!text-cyan-400" size={20} />
            <div>
              <p className="!font-semibold">Minha conta</p>
              <p className="!text-sm !text-neutral-400">
                Gerencie dados e preferências
              </p>
            </div>
          </div>

          <div className="!flex !items-center !gap-4">
            <Home className="!text-cyan-400" size={20} />
            <div>
              <p className="!font-semibold">Imóveis</p>
              <p className="!text-sm !text-neutral-400">
                Veja todos os seus imóveis
              </p>
            </div>
          </div>

        </div>

        <hr className="!my-4 !border-neutral-700" />

        <button
          onClick={() => {
            signOut();
            navigate("/login");
          }}
          className="!flex !items-center !gap-2 !text-red-500 !font-semibold !hover:underline"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </DialogContent>
    </Dialog>
  );
}
