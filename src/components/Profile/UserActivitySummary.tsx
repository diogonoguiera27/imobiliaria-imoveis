import { Heart, Clock, Calendar } from "lucide-react";

interface UserActivitySummaryProps {
  favoritosCount: number;
  ultimoAcesso: string; // ex: 'Hoje', 'Ontem', etc
  membroDesde: string;  // ex: 'Jul/2024'
}

export default function UserActivitySummary({
  favoritosCount,
  ultimoAcesso,
  membroDesde,
}: UserActivitySummaryProps) {
  return (
    <div className="flex flex-wrap !items-center !justify-center !gap-6 !md:gap-8 !text-sm !text-gray-700 !font-medium !bg-white !rounded-xl !shadow-md !p-4 !border !border-red-100">
      <div className="flex !items-center !gap-2">
        <Heart className="!text-red-500" size={18} />
        <span className="!text-sm">Favoritou {favoritosCount} imóveis</span>
      </div>
      <div className="flex !items-center !gap-2">
        <Clock className="!text-blue-500" size={18} />
        <span className="!text-sm">Último acesso: {ultimoAcesso}</span>
      </div>
      <div className="flex !items-center !gap-2">
        <Calendar className="!text-green-500" size={18} />
        <span className="!text-sm">Membro desde: {membroDesde}</span>
      </div>
    </div>
  );
}
