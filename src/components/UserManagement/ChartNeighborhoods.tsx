import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList } from "recharts";

interface ChartNeighborhoodsProps {
  data: { bairro: string; value: number }[];
}

export function ChartNeighborhoods({ data }: ChartNeighborhoodsProps) {
  return (
    <Card className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 !w-[500px] !h-[330px]">
                <CardHeader className="!pb-2">
                  <CardTitle className="!text-sm !font-medium !text-black">
                    Imóveis por Localização
                  </CardTitle>
                  <CardDescription className="!text-slate-700">
                    Top 5 bairros com mais imóveis cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent className="!h-full">
                  <ChartContainer
                    config={{
                      value: { label: "Qtd", color: "hsl(var(--chart-2))" },
                    }}
                  >
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 20, left: -20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" />
                      <XAxis
                        dataKey="bairro"
                        stroke="#991b1b"
                        tick={{ fill: "#991b1b", fontSize: 11 }}
                        axisLine={false}
                        interval={0}
                        tickLine={false}
                        angle={-15}
                        textAnchor="end"
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
                      <Bar
                        dataKey="value"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        isAnimationActive
                        animationDuration={1200}
                      >
                        <LabelList
                          dataKey="value"
                          position="top"
                          className="!ill-black"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
  );
}
