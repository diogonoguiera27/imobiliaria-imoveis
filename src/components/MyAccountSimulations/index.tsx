import { useCallback, useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { NovaSimulacaoModal } from "../NewModalSimulation";
import { useAuth } from "@/hooks/auth/useAuth";
import { getSimulationsByUser } from "../../service/simulationService";

interface Simulation {
  id: number;
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
  date: string;
}

export default function MyAccountSimulations() {
  const [open, setOpen] = useState(false);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const { user } = useAuth();

  const carregarSimulacoes = useCallback(async () => {
    if (!user?.id) return;

    try {
      const data = await getSimulationsByUser(user.id);
      setSimulations(data);
    } catch (error) {
      console.error("Erro ao carregar simulações:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    carregarSimulacoes();
  }, [carregarSimulacoes]);

  return (
    <div>
      <div className="!flex !items-center !justify-between !mb-6">
        <h3 className="!text-2xl !font-bold !flex !items-center !gap-2 !text-gray-800">
          <Calculator size={20} className="!text-red-500" /> Simulações
        </h3>

        {user?.id && (
          <NovaSimulacaoModal
            open={open}
            setOpen={setOpen}
            userId={user.id}
            onSimulacaoSalva={carregarSimulacoes}
          />
        )}
      </div>

      <div className="!space-y-4">
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-4 !shadow-sm !border !border-red-100"
          >
            <p className="!font-semibold !text-gray-800">{sim.title}</p>
            <p className="!text-sm !text-gray-600">
              Simulado em {new Date(sim.date).toLocaleDateString("pt-BR")} — Entrada: R${" "}
              {sim.entry.toLocaleString()} — Parcelas: {sim.installments}x R${" "}
              {sim.installmentValue.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
