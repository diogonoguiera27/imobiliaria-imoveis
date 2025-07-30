import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { getPropertyTypeStats } from "@/service/propertyService";
import { useAuth } from "@/hooks/auth";

const visualizacaoData = [
  { name: "Imóvel 1", value: 300 },
  { name: "Imóvel 2", value: 150 },
  { name: "Imóvel 3", value: 100 },
];

const COLORS = ["#EF4444", "#F97316", "#22C55E", "#3B82F6", "#A855F7"];

export default function TipoImovelChart() {
  const [tipoData, setTipoData] = useState<{ name: string; value: number }[]>(
    []
  );
  const { token } = useAuth();

  useEffect(() => {
  async function fetchStats() {
    if (!token) return; // evita chamar a API se não houver token

    try {
      const stats = await getPropertyTypeStats(token);
      setTipoData(stats);
    } catch (err) {
      console.error("Erro ao carregar dados do gráfico de tipos de imóveis:", err);
    }
  }

  fetchStats();
}, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Gráfico 1 - Tipo de Imóveis (Pizza) */}
      <div className="!bg-white !rounded-xl !shadow !p-4 !border !border-gray-200">
        <h3 className="!text-lg !font-semibold !text-gray-800 mb-1">
          Tipos de imóveis mais buscados
        </h3>
        <p className="!text-sm !text-muted-foreground !mb-4">
          Janeiro - Junho 2025
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={tipoData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent = 0 }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {tipoData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 2 - Imóveis mais visualizados (Barras) */}
      <div className="!bg-white !rounded-xl !shadow !p-4 !border !border-gray-200">
        <h3 className="!text-lg !font-semibold !text-gray-800 mb-1">
          Imóveis mais visualizados
        </h3>
        <p className="!text-sm !text-muted-foreground !mb-4">
          Janeiro - Junho 2025
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={visualizacaoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
