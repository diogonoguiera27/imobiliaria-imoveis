import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  nome: string;
  avatar?: string;
  userId: number; // id do contato
  onlineUsers: number[]; // array de usuários online
  onVoltar?: () => void;
}

export default function ChatHeader({
  nome,
  avatar,
  userId,
  onlineUsers,
  onVoltar,
}: ChatHeaderProps) {
  const online = onlineUsers.includes(userId);
  return (
    <header
      className="
        !flex !items-center !justify-between
        !p-3 md:!p-4
        !border-b !border-green-700/40
        !bg-gradient-to-r !from-green-600 !to-emerald-700
        !text-white
        !shadow-md
      "
    >
      <div className="!flex !items-center !gap-3">
        {/* 🔙 Botão de voltar (opcional) */}
        {onVoltar && (
          <button
            onClick={onVoltar}
            aria-label="Voltar"
            className="
              !text-white hover:!text-green-100 
              !transition-colors !duration-150
              focus:!outline-none focus:!ring-2 focus:!ring-green-300
              rounded-full p-1
            "
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* 🧑 Avatar do contato */}
        <img
          src={avatar || "https://i.pravatar.cc/60?u=default"}
          alt={nome}
          className="
            !w-9 !h-9 md:!w-10 md:!h-10
            !rounded-full !border-2 !border-white/80
            !object-cover
            !shadow-sm
          "
        />

        {/* 🟢 Nome + status */}
        <div className="!flex !flex-col">
          <span className="!font-semibold !text-sm md:!text-base">
            {nome || "Corretor Imobiliário"}
          </span>
          <span
            className={`!text-[11px] md:!text-xs ${
              online ? "!text-green-100" : "!text-gray-200"
            }`}
          >
            {online ? "Online agora" : "Offline"}
          </span>
        </div>
      </div>

      {/* ⚪ Indicador visual de status */}
      <div
        className={`
          !w-3 !h-3 !rounded-full 
          ${online ? "!bg-green-300" : "!bg-gray-400"} 
          !shadow-inner
        `}
        title={online ? "Contato online" : "Contato offline"}
      />
    </header>
  );
}
