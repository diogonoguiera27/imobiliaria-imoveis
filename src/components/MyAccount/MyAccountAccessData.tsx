import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function MyAccountAccessData() {
  return (
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <KeyRound className="!text-red-500" /> Dados de Acesso
      </h3>

      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
        {/* E-mail */}
        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100 !shadow-sm hover:!shadow-md !transition">
          <p className="!text-xs !text-gray-500 !mb-1">E-mail</p>
          <div className="!flex !justify-between !items-center">
            <span className="!text-sm !text-gray-800">gilberto@example.com</span>
            <Button
              variant="ghost"
              size="sm"
              className="!text-red-500 hover:!text-red-600"
            >
              Alterar
            </Button>
          </div>
        </div>

        {/* Senha */}
        <div className="!bg-white !rounded-lg !p-4 !border !border-red-100 !shadow-sm hover:!shadow-md !transition">
          <p className="!text-xs !text-gray-500 !mb-1">Senha</p>
          <div className="!flex !justify-between !items-center">
            <span className="!text-sm !text-gray-800">********</span>
            <Button
              variant="ghost"
              size="sm"
              className=" !text-red-500 hover:!text-red-600"
            >
              Alterar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
