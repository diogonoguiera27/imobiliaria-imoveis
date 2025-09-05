// src/components/EmptyState/index.tsx
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  redirectTo?: string; // rota para onde deve ir
}

export function EmptyState({ message, actionLabel, redirectTo }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="!flex !flex-col !items-center !justify-center !h-full !text-center !text-slate-500 !py-6">
      {/* Ícone ilustrativo */}
      <PlusCircle className="!h-10 !w-10 !text-slate-400 !mb-3" />

      {/* Mensagem amigável */}
      <p className="!text-base !font-medium !mb-3">{message}</p>

      {/* Botão de ação opcional */}
      {actionLabel && redirectTo && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(redirectTo)}
          className="!text-sm !rounded-lg !px-4 !py-2 !border-slate-300 hover:!bg-slate-100"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
