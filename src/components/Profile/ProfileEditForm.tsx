import { Button } from "@/components/ui/button";

interface Props {
  user: {
    nome: string;
    telefone: string;
    email: string;
    senha: string;
    cidade: string;
  };
}

export default function ProfileEditForm({ user }: Props) {
  return (
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <h3 className="!text-lg !font-semibold !mb-6 !text-gray-800">Editar Perfil</h3>

      <form className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
        <div>
          <label className="!block !text-sm !text-gray-700 !mb-1">Nome</label>
          <input
            type="text"
            defaultValue={user.nome}
            className="w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800 !focus:outline-none !focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div>
          <label className="block !text-sm !text-gray-700 !mb-1">Telefone</label>
          <input
            type="text"
            defaultValue={user.telefone}
            className="w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800 !focus:outline-none !focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="!block !text-sm !text-gray-700 !mb-1">E-mail</label>
          <input
            type="email"
            defaultValue={user.email}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800 !focus:outline-none !focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div>
          <label className="!block text-sm !text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            value={user.senha}
            readOnly
            className="1w-full !p-2 !rounded-md !bg-gray-100 !border !border-gray-300 !text-gray-500 !cursor-not-allowed"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-gray-700 !mb-1">Cidade</label>
          <input
            type="text"
            defaultValue={user.cidade}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800 !focus:outline-none !focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div className="md:col-span-2 !flex !justify-end!pt-4">
          <Button className="!bg-green-600 1hover:bg-green-700 !text-white !font-semibold">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
