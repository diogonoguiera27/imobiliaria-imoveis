import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { getUserOverview, UserOverview } from "@/service/authService";

export default function MyAccountOverview() {
  const { user, token } = useAuth();
  const [overview, setOverview] = useState<UserOverview | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      if (!user || !token) return;

      try {
        const data = await getUserOverview(user.id, token);
        setOverview(data);
      } catch (error) {
        console.error("Erro ao buscar dados de visão geral:", error);
      }
    }

    fetchOverview();
  }, [user, token]);

  const simulacoes = overview?.simulations || [];
  const userData = overview?.user || user;

  return (
    <div className="!space-y-6">
      {/* Simulações */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Simulações</h3>
        {simulacoes.length > 0 ? (
          <>
            <p className="!text-sm !text-gray-600">
              Você possui {simulacoes.length} simulação{simulacoes.length > 1 ? "s" : ""} de financiamento em andamento.
            </p>
            <ul className="!mt-2 !text-sm !text-gray-800 !list-disc !ml-5">
              {simulacoes.map((sim) => (
                <li key={sim.id}>
                  {sim.title} -{" "}
                  <span className="!text-green-600">
                    R$ {sim.installments * sim.installmentValue}
                  </span>{" "}
                  - Entrada{" "}
                  <span className="!text-green-600">
                    R$ {sim.entry}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="!text-sm !text-gray-500">Você ainda não possui simulações cadastradas.</p>
        )}
      </div>

      {/* Dados pessoais */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Dados pessoais</h3>
        <p className="!text-sm !text-gray-700">
          Nome: <strong>{userData?.nome}</strong><br />
          Cidade: <strong>{userData?.cidade}</strong><br />
          Telefone: <strong>{userData?.telefone || "Não informado"}</strong>
        </p>
      </div>

      {/* Dados de acesso */}
      <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-6 !shadow-xl !border !border-red-100">
        <h3 className="!text-lg !font-semibold !mb-2 !text-gray-800">Dados de acesso</h3>
        <p className="!text-sm !text-gray-700">
          E-mail: <strong>{userData?.email}</strong><br />
          Senha: <strong>********</strong>
        </p>
      </div>
    </div>
  );
}
