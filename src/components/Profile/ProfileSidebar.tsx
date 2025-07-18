/* Arquivo: components/Profile/ProfileSidebar.tsx */
import { Plus } from "lucide-react";

interface ProfileSidebarProps {
  user: {
    nome: string;
    username: string;
    email: string;
    telefone: string;
    cidade: string;
  };
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className="!w-full md:!w-[320px] !flex !flex-col !gap-6">
      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl !text-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt={user.nome}
          className="!w-24 !h-24 !rounded-[24px] !border-4 !border-white !object-cover !mx-auto !mb-4"
        />
        <h2 className="!text-lg !font-bold !mb-1">{user.nome}</h2>
        <p className="!text-sm !text-purple-400 !mb-4">{user.username}</p>

        <div className="!bg-neutral-900 !rounded-lg !p-4 !text-left !space-y-3">
          <div>
            <p className="!text-xs !text-neutral-400">E-mail</p>
            <p className="!text-sm !font-medium">{user.email}</p>
          </div>
          <div>
            <p className="!text-xs !text-neutral-400">Telefone</p>
            <p className="!text-sm !font-medium">{user.telefone}</p>
          </div>
          <div>
            <p className="!text-xs !text-neutral-400">Cidade</p>
            <p className="!text-sm !font-medium">{user.cidade}</p>
          </div>
        </div>
      </div>

      <div className="!bg-neutral-800 !rounded-xl !p-4 !shadow-xl">
        <div className="!flex !items-center !justify-between !mb-3">
          <h3 className="!text-sm !font-semibold">Links</h3>
          <button className="!text-neutral-400 hover:!text-white">
            <Plus size={18} />
          </button>
        </div>
        <div className="!grid !grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="!w-10 !h-10 !flex !items-center !justify-center !bg-neutral-700 !rounded-md !text-purple-400 hover:!bg-purple-700 hover:!text-white"
            >
              <Plus size={18} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
