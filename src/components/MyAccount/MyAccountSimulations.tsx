import { Calculator } from "lucide-react";

export default function MyAccountSimulations() {
  const simulations = [
    {
      id: 1,
      title: "Apartamento - Setor Bueno",
      date: "20/06/2025",
      entry: "R$ 40.000",
      installment: "240x R$ 1.200",
    },
    {
      id: 2,
      title: "Casa - Jardim América",
      date: "05/07/2025",
      entry: "R$ 80.000",
      installment: "300x R$ 1.500",
    },
  ];

  return (
    <div>
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-gray-800">
        <Calculator size={20} className="!text-red-500" /> Simulações
      </h3>

      <div className="!space-y-4">
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-4 !shadow-sm !border !border-red-100"
          >
            <p className="!font-semibold !text-gray-800">{sim.title}</p>
            <p className="!text-sm !text-gray-600">
              Simulado em {sim.date} — Entrada: {sim.entry} — Parcelas: {sim.installment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
