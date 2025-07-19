import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function MyAccountPersonalData() {
  return (
    <div>
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-white">
        <User size={20} /> Dados pessoais
      </h3>

      <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
        <h4 className="!text-md !font-semibold !mb-4 !text-white">
          Informações do usuário
        </h4>

        <form className="!grid sm:!grid-cols-2 !gap-4">
          <div>
            <label className="!text-sm !text-neutral-400 !block !mb-1">
              Nome *
            </label>
            <input
              type="text"
              defaultValue="Gilberto Bessa"
              className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
            />
          </div>

          <div>
            <label className="!text-sm !text-neutral-400 !block !mb-1">
              Telefone *
            </label>
            <input
              type="text"
              defaultValue="(11) 98765-4321"
              className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
            />
          </div>

          <div>
            <label className="!text-sm !text-neutral-400 !block !mb-1">
              E-mail *
            </label>
            <input
              type="email"
              defaultValue="gilberto@example.com"
              className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
            />
          </div>

          <div>
            <label className="!text-sm !text-neutral-400 !block !mb-1">
              Senha
            </label>
            <input
              type="password"
              value="********"
              readOnly
              className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white !cursor-not-allowed"
            />
          </div>

          <div>
            <label className="!text-sm !text-neutral-400 !block !mb-1">
              Cidade *
            </label>
            <input
              type="text"
              defaultValue="São Paulo"
              className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
            />
          </div>

          <div className="sm:!col-span-2 !pt-4">
            <Button className="!bg-purple-600 !hover:bg-purple-700 !text-white">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
