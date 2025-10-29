import * as React from "react";
import { TrendingUp, CalendarDays } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
  LabelList,
  Tooltip,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import {
  getDashboardChart,
  DashboardChartItem,
} from "@/service/dashboardService";

export default function DashboardChart() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const [chartData, setChartData] = React.useState<DashboardChartItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // === Busca dados do backend ===
  const carregarGrafico = async () => {
    if (!date?.from || !date?.to) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardChart(date.from, date.to);
      setChartData(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados do gráfico.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    carregarGrafico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="!rounded-xl !bg-gradient-to-b !from-muted/40 !to-background !shadow-sm hover:!shadow-md !transition-all !overflow-hidden">
      {/* ===== HEADER ===== */}
      <CardHeader className="!flex !items-center !justify-between !pb-3 !pt-6 !px-6 !border-b !border-muted/20">
        <div>
          <CardTitle className="!text-lg !font-semibold !flex !items-center !gap-2">
            📈 Imóveis cadastrados por dia
          </CardTitle>
          <CardDescription className="!text-sm !text-muted-foreground">
            Acompanhe o volume de cadastros diários
          </CardDescription>
        </div>

        {/* ===== CALENDÁRIO ===== */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="!p-2 !rounded-md !cursor-pointer hover:!bg-muted/50 !transition-colors">
              <CalendarDays className="!h-5 !w-5" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="!p-0 !bg-background !rounded-lg !shadow-md !z-[999]"
          >
            <div className="!p-4">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
                locale={ptBR}
                showOutsideDays
                classNames={{
                  caption_dropdowns:
                    "flex items-center justify-center gap-2 my-2",
                  dropdown:
                    "h-8 border border-input bg-background rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  caption: "flex justify-center pt-1 relative items-center",
                }}
                modifiersClassNames={{
                  range_middle: "bg-[rgba(120,120,120,0.2)] text-black",
                  range_start: "bg-red-500 text-white",
                  range_end: "bg-red-500 text-white",
                  today: "border border-red-500 text-red-600 font-semibold",
                }}
                className={`
    rounded-md shadow-none w-full
    [&_.rdp-day]:cursor-pointer
    [&_.rdp-day]:transition-all
    [&_.rdp-day:hover]:brightness-95

    /* 🧩 Corrige duplicação: esconde QUALQUER label textual de mês/ano */
    [&_.rdp-caption_label]:hidden
    [&_.rdp-caption>span.select-none]:hidden
  `}
              />
              <Button
                onClick={carregarGrafico}
                disabled={!date?.from || !date?.to || loading}
                className="!mt-3 !bg-red-600 hover:!bg-red-700 !text-white !rounded-full !cursor-pointer !font-semibold !w-full"
              >
                {loading ? "Carregando..." : "Aplicar"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>

      {/* ===== GRÁFICO ===== */}
      <CardContent className="!p-0">
        <div className="!w-full !h-[360px] md:!h-[400px] !px-6 !pt-6">
          {error ? (
            <p className="!text-center !text-red-500 !mt-10">{error}</p>
          ) : loading ? (
            <p className="!text-center !text-muted-foreground !mt-10">
              Carregando gráfico...
            </p>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 30, right: 30, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  hide
                  domain={[0, (dataMax: number) => Math.max(5, dataMax + 1)]}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Line
                  type="linear"
                  dataKey="imoveis"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                >
                  <LabelList
                    dataKey="imoveis"
                    position="top"
                    offset={10}
                    style={{
                      fontSize: "12px",
                      fill: "#f97316",
                      fontWeight: 600,
                    }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="!text-center !text-muted-foreground !mt-10">
              Nenhum dado disponível para o período selecionado
            </p>
          )}
        </div>
      </CardContent>

      {/* ===== RODAPÉ ===== */}
      <CardFooter className="!flex-col !items-start !gap-2 !text-sm !px-8 !pb-6 !border-t !border-muted/20">
        <div className="!flex !gap-2 !leading-none !font-medium">
          Crescimento de 12% esta semana <TrendingUp className="!h-4 !w-4" />
        </div>

        <div className="!text-muted-foreground !leading-none">
          {date?.from && date?.to ? (
            <>
              Mostrando imóveis cadastrados de{" "}
              {format(date.from, "dd/MM/yyyy", { locale: ptBR })} até{" "}
              {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
            </>
          ) : (
            <>Selecione um intervalo de datas</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
