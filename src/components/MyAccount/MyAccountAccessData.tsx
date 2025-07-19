import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function MyAccountAccessData() {
  return (
    <div>
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-white">
        <KeyRound size={20} /> Dados de acesso
      </h3>

      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow !flex !flex-col sm:!flex-row !gap-4">
        {/* E-mail */}
        <div className="!flex-1">
          <p className="!text-sm !text-neutral-400 !mb-1">E-mail</p>
          <div className="!bg-neutral-900 !p-4 !rounded-lg !flex !justify-between !items-center">
            <span className="!text-sm !text-white">gilberto@example.com</span>
            <Button
              variant="ghost"
              size="sm"
              className="!text-purple-400 hover:!text-purple-300"
            >
              Alterar
            </Button>
          </div>
        </div>

        {/* Senha */}
        <div className="!flex-1">
          <p className="!text-sm !text-neutral-400 !mb-1">Senha</p>
          <div className="!bg-neutral-900 !p-4 !rounded-lg !flex !justify-between !items-center">
            <span className="!text-sm !text-white">********</span>
            <Button
              variant="ghost"
              size="sm"
              className="!text-purple-400 hover:!text-purple-300"
            >
              Alterar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
