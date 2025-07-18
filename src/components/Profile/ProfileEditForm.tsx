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
    <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-6">Editar Perfil</h3>

      <form className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
        <div>
          <label className="!block !text-sm !text-neutral-400 mb-1">Nome</label>
          <input
            type="text"
            defaultValue={user.nome}
            className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-neutral-400 mb-1">Telefone</label>
          <input
            type="text"
            defaultValue={user.telefone}
            className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
          />
        </div>

        <div className="md:!col-span-2">
          <label className="!block !text-sm !text-neutral-400 mb-1">E-mail</label>
          <input
            type="email"
            defaultValue={user.email}
            className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-neutral-400 mb-1">Senha</label>
          <input
            type="password"
            value={user.senha}
            readOnly
            className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white !cursor-not-allowed"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-neutral-400 mb-1">Cidade</label>
          <input
            type="text"
            defaultValue={user.cidade}
            className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
          />
        </div>

        <div className="md:!col-span-2 !flex !justify-end !pt-4">
          <Button className="!bg-green-600 !hover:bg-green-700 !text-white !font-semibold">
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
