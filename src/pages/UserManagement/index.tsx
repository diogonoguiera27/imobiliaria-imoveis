// src/pages/UserManagement/index.tsx
import { Footer } from "@/components/Footer";
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
import SidebarTrigger, { SidebarProvider } from "@/components/ui/sidebar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  AreaChart,
  Area,
} from "recharts";
import { getDashboardSummary } from "@/service/dashboardService";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

const chartConfig = {
  views: { label: "Visualizações", color: "var(--chart-2)" },
  label: { color: "var(--background)" },
} satisfies ChartConfig;

type TipoImovelData = { name: string; value: number };
type FaixaPrecoData = { faixa: string; value: number };
type BairroData = { bairro: string; value: number };
type TopVisualizado = { property: string; views: number };

export default function UserManagement() {
  const [tiposDeImoveisData, setTiposDeImoveisData] = useState<TipoImovelData[]>([]);
  const [faixaPrecoData, setFaixaPrecoData] = useState<FaixaPrecoData[]>([]);
  const [bairrosData, setBairrosData] = useState<BairroData[]>([]);
  const [topVisualizados, setTopVisualizados] = useState<TopVisualizado[]>([]);
  const [indicadores, setIndicadores] = useState({
    totalImoveis: 0,
    ativos: 0,
    inativos: 0,
    totalVisualizacoes: 0,
    contatosRecebidos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const summary = await getDashboardSummary();

        setTiposDeImoveisData(
          summary.tiposDeImoveis.map((item: { tipo: string; total: number }) => ({
            name: item.tipo,
            value: item.total,
          }))
        );

        const faixaArray: FaixaPrecoData[] = Object.entries(summary.distribuicaoPorFaixa).map(
          ([faixa, value]) => ({
            faixa,
            value: Number(value),
          })
        );
        setFaixaPrecoData(faixaArray);

        setBairrosData(
          summary.topBairros.map((item: { bairro: string; total: number }) => ({
            bairro: item.bairro,
            value: item.total,
          }))
        );

        setTopVisualizados(
          summary.topVisualizados.map(
            (item: { titulo: string; visualizacoes: number | null | undefined }) => ({
              property: item.titulo,
              views: item.visualizacoes ?? 0,
            })
          )
        );

        setIndicadores({
          totalImoveis: summary.totalImoveis ?? 0,
          ativos: summary.ativos ?? 0,
          inativos: summary.inativos ?? 0,
          totalVisualizacoes: summary.totalVisualizacoes ?? 0,
          contatosRecebidos: summary.contatosRecebidos ?? 0,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erro ao carregar resumo do dashboard:", error.message);
        } else {
          console.error("Erro desconhecido ao carregar resumo do dashboard:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // helper p/ truncar nomes grandes no eixo
  function truncate(text: string, max = 28) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
  }

  // Só mostra o EmptyState quando terminou de carregar e realmente não há nada
  const semDados =
    !loading &&
    indicadores.totalImoveis === 0 &&
    faixaPrecoData.length === 0 &&
    bairrosData.length === 0 &&
    topVisualizados.length === 0;

  return (
    <SidebarProvider>
      <div className="w-screen px-6 pt-20 space-y-10 ">
        <SidebarTrigger />

        {semDados ? (
          <div className="flex justify-center items-center h-[70vh]">
            <EmptyState
              message="Você ainda não possui imóveis cadastrados"
              actionLabel="Cadastrar Imóvel"
              redirectTo="/imovel/novo"
            />
          </div>
        ) : (
          <>
            {/* Linha 1 - Indicadores */}
            <div className="flex !flex-wrap !justify-center !gap-4 !mt-20">
              {[
                {
                  label: "Total de Imóveis",
                  value: indicadores.totalImoveis,
                  color: "text-black",
                },
                {
                  label: "Imóveis Ativos",
                  value: indicadores.ativos,
                  color: "text-green-600",
                },
                {
                  label: "Imóveis Inativos",
                  value: indicadores.inativos,
                  color: "text-gray-600",
                },
                {
                  label: "Visualizações",
                  value: indicadores.totalVisualizacoes,
                  color: "text-blue-600",
                },
                {
                  label: "Contatos Recebidos",
                  value: indicadores.contatosRecebidos,
                  color: "text-purple-600",
                },
              ].map(({ label, value, color }, i) => (
                <Card
                  key={i}
                  className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 !w-[200px]"
                >
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

            {/* Linha 2 e 3 - Gráficos */}
            <div className="!flex !flex-wrap !gap-6 !justify-center !mt-4">
              {/* Gráfico Tipos de Imóveis */}
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
                          data={loading ? [] : tiposDeImoveisData}
                          dataKey="value"
                          nameKey="name"
                          cy="60%"
                          cx="50%"
                          outerRadius={80}
                        >
                          {(loading ? [] : tiposDeImoveisData).map((_, i) => (
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

              {/* Gráfico 2 - Distribuição por Faixa de Preço */}
              <Card className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !w-[650px] !h-[390px] !p-4">
                <CardHeader className="!pb-1">
                  <CardTitle className="!text-sm !font-medium !text-black">
                    Distribuição por Faixa de Preço
                  </CardTitle>
                </CardHeader>
                <CardContent className="!p-0 !relative" style={{ height: "280px" }}>
                  <ChartContainer
                    config={{ value: { label: "Qtd", color: "#ef4444" } }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={faixaPrecoData}
                        margin={{ top: 20, right: 30, left: -10, bottom: 30 }}
                      >
                        <defs>
                          <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="#ef4444"
                              stopOpacity={0.6}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ef4444"
                              stopOpacity={0.05}
                            />
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
            </div>

            {/* Linha 3 - Mais 2 gráficos */}
            <div className="!flex !flex-wrap !gap-6 !justify-center !mt-4">
              {/* Gráfico 3 - Imóveis por Localização */}
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
                      data={bairrosData}
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

              {/* Gráfico 4 - Top 5 imóveis mais visualizados */}
              <Card className="!bg-red-50 !border-red-200 !shadow-md !rounded-xl !p-4 !w-[550px] !h-[330px]">
                <CardHeader className="!pb-2">
                  <CardTitle className="!text-sm !font-medium !text-black">
                    Top 5 imóveis mais visualizados
                  </CardTitle>
                  <CardDescription className="!text-gray-700">
                    Últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent className="!overflow-hidden">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={topVisualizados}
                        layout="vertical"
                        margin={{ top: 10, right: 60, left: 8, bottom: 10 }}
                      >
                        <CartesianGrid horizontal={false} stroke="#fca5a5" />
                        <YAxis
                          dataKey="property"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#991b1b", fontSize: 12 }}
                          width={160}
                          tickFormatter={(v: string) => truncate(v, 30)}
                        />
                        <XAxis
                          dataKey="views"
                          type="number"
                          hide
                          domain={[
                            0,
                            Math.ceil(
                              (topVisualizados.reduce(
                                (m: number, d: TopVisualizado) =>
                                  Math.max(m, d.views || 0),
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
                          barSize={35}
                          minPointSize={8}
                          maxBarSize={40}
                          isAnimationActive
                          animationDuration={1200}
                        >
                          <LabelList
                            dataKey="views"
                            position="right"
                            offset={8}
                            fontSize={12}
                            fill="#000"
                            textAnchor="start"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <div className="!mt-10">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
