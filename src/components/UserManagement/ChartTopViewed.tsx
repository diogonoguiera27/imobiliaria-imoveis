import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Bar,
  LabelList,
} from "recharts";

type TopVisualizado = { property: string; views: number };

const chartConfig = {
  views: { label: "Visualizações", color: "var(--chart-2)" },
  label: { color: "var(--background)" },
} satisfies ChartConfig;

// 🔥 Hook para detectar se é mobile
function useIsMobile(maxWidth = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(typeof window !== "undefined" && window.innerWidth < maxWidth);

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [maxWidth]);

  return isMobile;
}

interface ChartTopViewedProps {
  topVisualizados: TopVisualizado[];
}

export function ChartTopViewed({ topVisualizados }: ChartTopViewedProps) {
  const isMobile = useIsMobile(); // detecta se está no mobile

  function truncate(text: string, max = 28) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
  }

  return (
    <Card
      className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 
                 !w-full sm:!w-1/2 lg:!w-[550px] 
                 !h-[300px] lg:!h-[330px]"
    >
      <CardHeader className="!pb-2">
        <CardTitle className="!text-sm !font-medium !text-black">
          Top 5 imóveis mais visualizados
        </CardTitle>
        <CardDescription className="!text-gray-700">
          Últimos 30 dias
        </CardDescription>
      </CardHeader>

      <CardContent className="!overflow-hidden !h-[220px] lg:!h-[240px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topVisualizados}
              layout="vertical"
              margin={{ top: 20, right: -40, left: 8, bottom: 10 }}
            >
              <CartesianGrid horizontal={false} stroke="#fca5a5" />

              {/* 🔥 Esconde labels no mobile */}
              <YAxis
                dataKey="property"
                type="category"
                tickLine={false}
                axisLine={false}
                hide={isMobile}
                tick={{
                  fill: "#991b1b",
                  fontSize: 11,
                }}
                width={isMobile ? 0 : 140}
                tickFormatter={(v: string) => truncate(v, 22)}
              />

              <XAxis
                dataKey="views"
                type="number"
                hide
                domain={[
                  0,
                  Math.ceil(
                    (topVisualizados.reduce(
                      (max, d) => Math.max(max, d.views || 0),
                      0
                    ) || 1) * 1.15
                  ),
                ]}
                allowDecimals={false}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent className="!rounded-md !border !border-slate-200 !bg-white !px-3 !py-2 !shadow-sm text-xs" />
                }
              />

              <Bar
                dataKey="views"
                layout="vertical"
                fill="#ef4444"
                radius={6}
                barSize={28}
                minPointSize={6}
                isAnimationActive
                animationDuration={1000}
              >
                <LabelList
                  dataKey="views"
                  position="right"
                  offset={6}
                  fontSize={11}
                  fill="#000"
                  textAnchor="start"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
