import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  nome: string;
  avatar?: string;
  userId: number;          // ID do contato
  onlineUsers: number[];   // lista de usuários online vinda do socket
  digitandoPor?: number | null; // id do usuário que está digitando
  onVoltar?: () => void;
}

export default function ChatHeader({
  nome,
  avatar,
  userId,
  onlineUsers,
  digitandoPor,
  onVoltar,
}: ChatHeaderProps) {

  /* ============================================================
     🔍 Detecta status em tempo real
  ============================================================ */
  const online = onlineUsers.includes(userId);
  const estaDigitando = digitandoPor === userId;

  /* ============================================================
     🖼️ Avatar seguro com fallback
  ============================================================ */
  const avatarFinal =
    avatar && avatar.startsWith("http")
      ? avatar
      : avatar && avatar.startsWith("/")
      ? `${import.meta.env.VITE_API_URL}${avatar}`
      : `https://i.pravatar.cc/100?u=${userId}`;

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
      {/* ============================================================
         🔙 Botão de voltar (quando no modo lista)
      ============================================================ */}
      <div className="!flex !items-center !gap-3">
        {onVoltar && (
          <button
            onClick={onVoltar}
            aria-label="Voltar"
            className="
              !text-white hover:!text-green-100 
              !transition-colors !duration-150
              focus:!outline-none focus:!ring-2 focus:!ring-white/40
              !rounded-full !p-1
            "
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* ============================================================
           🧑 Avatar
        ============================================================ */}
        <img
          src={avatarFinal}
          alt={nome}
          className="
            !w-9 !h-9 md:!w-10 md:!h-10
            !rounded-full !border-2 !border-white/80
            !object-cover
            !shadow-sm
          "
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?u=${userId}`;
          }}
        />

        {/* ============================================================
           🟢 Nome + Status
        ============================================================ */}
        <div className="!flex !flex-col !leading-tight">
          <span className="!font-semibold !text-sm md:!text-base !truncate !max-w-[180px]">
            {nome || "Contato"}
          </span>

          {/* Status inteligente: digitando > online > offline */}
          {estaDigitando ? (
            <span className="!text-[11px] md:!text-xs !text-green-100 italic animate-pulse">
              digitando...
            </span>
          ) : (
            <span
              className={`
                !text-[11px] md:!text-xs 
                ${online ? "!text-green-100" : "!text-gray-200"}
              `}
            >
              {online ? "Online agora" : "Offline"}
            </span>
          )}
        </div>
      </div>

      {/* ============================================================
         🔵 Indicador visual de status (bolinha)
      ============================================================ */}
      <div
        className={`
          !w-3 !h-3 !rounded-full
          transition-all duration-300
          ${online ? "!bg-green-300" : "!bg-gray-400"}
          !shadow-inner
        `}
        title={online ? "Contato online" : "Contato offline"}
      />
    </header>
  );
}
