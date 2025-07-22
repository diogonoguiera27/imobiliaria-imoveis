import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function MyAccountPersonalData() {
  return (
    <div>
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <User size={20} className="!text-red-500" /> Dados pessoais
      </h3>

      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h4 className="!text-md !font-semibold !mb-4 !text-gray-800">
          Informações do usuário
        </h4>

        <form className="!grid sm:!grid-cols-2 !gap-4">
          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">
              Nome *
            </label>
            <input
              type="text"
              defaultValue="Gilberto Bessa"
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">
              Telefone *
            </label>
            <input
              type="text"
              defaultValue="(11) 98765-4321"
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">
              E-mail *
            </label>
            <input
              type="email"
              defaultValue="gilberto@example.com"
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">
              Senha
            </label>
            <input
              type="password"
              value="********"
              readOnly
              className="!w-full !p-2 !rounded-md !bg-gray-100 !border !border-gray-300 !text-gray-500 !cursor-not-allowed"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">
              Cidade *
            </label>
            <input
              type="text"
              defaultValue="São Paulo"
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
            />
          </div>

          <div className="sm:!col-span-2 !pt-4">
            <Button className="!bg-red-500 !hover:bg-red-600 !text-white">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
