import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface IndicatorsProps {
  indicadores: {
    totalImoveis: number;
    ativos: number;
    inativos: number;
    totalVisualizacoes: number;
    contatosRecebidos: number;
  };
  loading: boolean;
}

export function Indicators({ indicadores, loading }: IndicatorsProps) {
  const items = [
    { label: "Total de Imóveis", value: indicadores.totalImoveis, color: "text-black" },
    { label: "Imóveis Ativos", value: indicadores.ativos, color: "text-green-600" },
    { label: "Imóveis Inativos", value: indicadores.inativos, color: "text-gray-600" },
    { label: "Visualizações", value: indicadores.totalVisualizacoes, color: "text-blue-600" },
    { label: "Contatos Recebidos", value: indicadores.contatosRecebidos, color: "text-purple-600" },
  ];

  return (
    <div className="flex !flex-wrap !justify-center !gap-4 !mt-20">
      {items.map(({ label, value, color }, i) => (
        <Card key={i} className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 !w-[200px]">
          <CardTitle className="!text-sm !font-medium !text-black">
            {label}
          </CardTitle>
          <CardContent className="!pt-2">
            <p className={`!text-2xl !font-bold ${color}`}>
              {loading ? "..." : value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
