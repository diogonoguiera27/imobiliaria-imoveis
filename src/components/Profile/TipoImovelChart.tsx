"use client";

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
import {
  getMostSearchedPropertyTypes,
  getMostViewedPropertyTypes,
} from "@/service/propertyService";
import { useAuth } from "@/hooks/auth";

const COLORS = ["#EF4444", "#F97316", "#22C55E", "#3B82F6", "#A855F7"];

interface PropertyStats {
  name: string;
  value: number;
}

// 🔐 Validação segura do tipo
function isPropertyStats(item: unknown): item is PropertyStats {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    "value" in item &&
    typeof (item as any).name === "string" &&
    !isNaN(Number((item as any).value))
  );
}

export default function TipoImovelChart() {
  const [tipoData, setTipoData] = useState<PropertyStats[]>([]);
  const [visualizadosData, setVisualizadosData] = useState<PropertyStats[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;

      try {
        const buscados = await getMostSearchedPropertyTypes(token);
        const visualizados = await getMostViewedPropertyTypes(token);

        console.log("📊 Buscados recebidos (bruto):", buscados);
        console.log("📈 Visualizados recebidos (bruto):", visualizados);

        const tipoCorrigido = buscados
          .filter(isPropertyStats)
          .map((item) => ({
            ...item,
            value: Number(item.value),
          }));

        const visualizadosCorrigido = visualizados
          .filter(isPropertyStats)
          .map((item) => ({
            ...item,
            value: Number(item.value),
          }));

        setTipoData(tipoCorrigido);
        setVisualizadosData(visualizadosCorrigido);
      } catch (err) {
        console.error("❌ Erro ao carregar dados dos gráficos:", err);
      }
    }

    fetchStats();
  }, [token]);

  const isTipoDataValid =
    tipoData.length > 0 &&
    tipoData.every((item) => typeof item.value === "number" && !isNaN(item.value));

  const isVisualizadosValid =
    visualizadosData.length > 0 &&
    visualizadosData.every((item) => typeof item.value === "number" && !isNaN(item.value));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Gráfico de Pizza - Tipos mais buscados */}
      <div className="!bg-white !rounded-xl !shadow !p-4 !border !border-gray-200">
        <h3 className="!text-lg !font-semibold !text-gray-800 mb-1">
          Tipos de imóveis mais buscados
        </h3>
        <p className="!text-sm !text-muted-foreground !mb-4">
          Baseado nas buscas filtradas pelos usuários
        </p>
        {isTipoDataValid && (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={tipoData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {tipoData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gráfico de Barras - Tipos mais visualizados */}
      <div className="!bg-white !rounded-xl !shadow !p-4 !border !border-gray-200">
        <h3 className="!text-lg !font-semibold !text-gray-800 mb-1">
          Tipos de imóveis mais visualizados
        </h3>
        <p className="!text-sm !text-muted-foreground !mb-4">
          Baseado nas visualizações reais dos usuários
        </p>
        {isVisualizadosValid && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={visualizadosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
