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
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-white">
        <Calculator size={20} /> Simulações
      </h3>

      <div className="!space-y-4">
        {simulations.map((sim) => (
          <div
            key={sim.id}
            className="!bg-neutral-800 !rounded-xl !p-4 !shadow !text-white"
          >
            <p className="!font-semibold">{sim.title}</p>
            <p className="!text-sm !text-neutral-400">
              Simulado em {sim.date} - Entrada: {sim.entry} - Parcelas: {sim.installment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
