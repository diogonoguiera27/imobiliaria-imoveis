import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";

import { updateUser } from "@/service/authService";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

export default function MyAccountPersonalData() {
  const { user, updateUser: updateUserContext, token } = useAuth();

  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    telefone: user?.telefone || "",
    cidade: user?.cidade || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    try {
      const updatedUser = await updateUser(
        user.id,
        {
          ...formData,
          email: user.email,
          avatarUrl: user.avatarUrl || "", 
        },
        token
      );

      updateUserContext(updatedUser);
      toast.success("✅ Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("❌ Erro ao atualizar os dados.");
    }
  };

  return (
    <div>
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <UserIcon size={20} className="!text-red-500" /> Dados pessoais
      </h3>

      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h4 className="!text-md !font-semibold !mb-4 !text-gray-800">
          Informações do usuário
        </h4>

        <form onSubmit={handleSubmit} className="!grid sm:!grid-cols-2 !gap-4">
          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
              required
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">Telefone *</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
              required
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">E-mail</label>
            <input
              type="email"
              value={user?.email}
              readOnly
              className="!w-full !p-2 !rounded-md !bg-gray-100 !border !border-gray-300 !text-gray-500 !cursor-not-allowed"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">Senha</label>
            <input
              type="password"
              value="********"
              readOnly
              className="!w-full !p-2 !rounded-md !bg-gray-100 !border !border-gray-300 !text-gray-500 !cursor-not-allowed"
            />
          </div>

          <div>
            <label className="!text-sm !text-gray-600 !block !mb-1">Cidade *</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="!w-full !p-2 !rounded-md !bg-white !border !border-gray-300 !text-gray-800"
              required
            />
          </div>

          <div className="sm:!col-span-2 !pt-4">
            <Button
              type="submit"
              className="!bg-red-500 !hover:bg-red-600 !text-white"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
