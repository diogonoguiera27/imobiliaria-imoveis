import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/hooks/auth";

interface Props {
  user: {
    id: number;
    nome: string;
    telefone?: string;
    email: string;
    cidade: string;
    avatarUrl?: string; // ✅ Mantenha o avatarUrl se necessário
  };
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
}

export default function ProfileEditForm({ user }: Props) {
  const { updateUser } = useAuth();

  const [nome, setNome] = useState(user.nome);
  const [telefone, setTelefone] = useState(user.telefone || "");
  const [email, setEmail] = useState(user.email);
  const [cidade, setCidade] = useState(user.cidade);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/users/${user.id}`, {
        nome,
        telefone,
        email,
        cidade,
        avatarUrl: user.avatarUrl // ✅ Mantenha o avatarUrl se necessário
      });

      // Atualiza o contexto com os novos dados
      updateUser({
        id: user.id,
        nome,
        telefone,
        email,
        cidade,
        avatarUrl: user.avatarUrl // ✅ Mantenha o avatarUrl se necessário
      });

      toast.success("Perfil atualizado com sucesso!");
    } catch (err: unknown) {
      const error = err as ApiError;
      const errorMessage = error.response?.data?.error;

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Erro desconhecido ao atualizar o perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <h3 className="!text-lg !font-semibold !mb-6 !text-gray-800">
        Editar Perfil
      </h3>

      <form
        onSubmit={handleSubmit}
        className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4"
      >
        <div>
          <label className="!block !text-sm !text-gray-700 !mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-gray-700 !mb-1">
            Telefone
          </label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="!block !text-sm !text-gray-700 !mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
          />
        </div>

        <div>
          <label className="!block !text-sm !text-gray-700 !mb-1">Cidade</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
          />
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <Button
            type="submit"
            className="!bg-green-600 !hover:bg-green-700 !text-white !font-semibold"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
