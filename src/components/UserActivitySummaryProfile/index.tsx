// src/components/UserActivitySummary.tsx
import { Heart, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserActivitySummaryProps {
  favoritosCount: number;
  ultimoAcesso: string;
  membroDesde: string;
  loading?: boolean; // ✅ novo
}

export default function UserActivitySummaryProfile({
  favoritosCount,
  ultimoAcesso,
  membroDesde,
  loading = false,
}: UserActivitySummaryProps) {
  if (loading) {
    // 🔹 Skeleton de carregamento
    return (
      <div className="flex flex-wrap !items-center !justify-center !gap-6 !md:gap-8 !bg-white !rounded-xl !shadow-md !p-4 !border !border-red-100">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex !items-center !gap-2">
            <Skeleton className="!h-5 !w-5 !rounded-full" />
            <Skeleton className="!h-4 !w-36" />
          </div>
        ))}
      </div>
    );
  }

  // 🔹 Conteúdo normal
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
