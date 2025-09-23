import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  CartesianGrid,
  YAxis,
  Bar,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ChartNeighborhoodsProps {
  data: { bairro: string; value: number }[];
}

export function ChartNeighborhoods({ data }: ChartNeighborhoodsProps) {
  return (
    <Card
      className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl"
      style={{ width: "100%", maxWidth: 500, height: 320, padding: "16px" }}
    >
      <CardHeader style={{ paddingBottom: "8px" }}>
        <CardTitle style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>
          Imóveis por Localização
        </CardTitle>
        <CardDescription style={{ color: "#334155" }}>
          Top 5 bairros com mais imóveis cadastrados
        </CardDescription>
      </CardHeader>

      <CardContent
        style={{
          height: "240px",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: -45, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
            
            {/* Remove eixo X para não exibir nomes */}
            {/* <XAxis ... /> */}

            <YAxis
              stroke="#991b1b"
              tick={{ fill: "#991b1b", fontSize: 12 }}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="value"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
              barSize={40}
              isAnimationActive
              animationDuration={1000}
            >
              <LabelList
                dataKey="value"
                position="top"
                style={{ fill: "#000", fontSize: "12px" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
