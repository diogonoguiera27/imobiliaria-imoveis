import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

interface ChartPropertyTypesProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

export function ChartPropertyTypes({ data, loading }: ChartPropertyTypesProps) {
  return (
    <Card className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 !w-[400px] !h-[390px]">
      <CardHeader>
        <CardTitle className="!text-sm !font-medium !text-black">
          Tipos de Imóveis
        </CardTitle>
      </CardHeader>
      <CardContent className="!h-full">
        <ChartContainer
          config={{
            value: { label: "Qtd", color: "hsl(var(--chart-1))" },
          }}
        >
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={loading ? [] : data}
                dataKey="value"
                nameKey="name"
                cy="60%"
                cx="50%"
                outerRadius={80}
              >
                {(loading ? [] : data).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  marginLeft: "-10px",
                  marginTop: "20px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
