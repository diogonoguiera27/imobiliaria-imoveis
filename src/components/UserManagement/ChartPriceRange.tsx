import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface ChartPriceRangeProps {
  data: { faixa: string; value: number }[];
}

export function ChartPriceRange({ data }: ChartPriceRangeProps) {
  return (
    <Card className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !w-[650px] !h-[390px] !p-4">
      <CardHeader className="!pb-1">
        <CardTitle className="!text-sm !font-medium !text-black">
          Distribuição por Faixa de Preço
        </CardTitle>
      </CardHeader>
      <CardContent className="!p-0 !relative" style={{ height: "280px" }}>
        <ChartContainer config={{ value: { label: "Qtd", color: "#ef4444" } }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: -10, bottom: 30 }}
            >
              <defs>
                <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
              <XAxis
                dataKey="faixa"
                stroke="#991b1b"
                tick={{ fill: "#991b1b", fontSize: 11 }}
                axisLine={false}
                interval={0}
              />
              <YAxis
                stroke="#991b1b"
                tick={{ fill: "#991b1b", fontSize: 12 }}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="!rounded-md !border !border-slate-200 !bg-white !px-3 !py-2 !shadow-sm text-xs" />
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                fill="url(#fillArea)"
                isAnimationActive
                animationDuration={1500}
                animationBegin={200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
