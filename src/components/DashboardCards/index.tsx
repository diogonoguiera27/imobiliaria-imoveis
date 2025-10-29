import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconBuildingCommunity,
  IconUser,
  IconUserCheck,
  IconShoppingBag,
  IconBuildingBank,
} from "@tabler/icons-react";
import {
  getDashboardSummary,
  DashboardSummary,
} from "@/service/dashboardService";

export default function DashboardCards() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar dados do backend
  useEffect(() => {
    async function fetchSummary() {
      try {
        const result = await getDashboardSummary();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  // Formata valores monetários em BRL
  const formatBRL = (valor: number) =>
    valor?.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Estados de carregamento e erro
  if (loading)
    return (
      <p className="!text-center !text-muted-foreground">Carregando dados...</p>
    );

  if (error)
    return <p className="!text-center !text-red-500">{error}</p>;

  if (!data)
    return <p className="!text-center !text-muted-foreground">Nenhum dado encontrado.</p>;

  return (
    <div className="!flex !flex-col !gap-8">
      {/* ===== GRID PRINCIPAL (4 cards) ===== */}
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-6">
        {/* === Card 1 - Imóveis === */}
        <Card className="!rounded-xl !bg-gradient-to-b !from-muted/40 !to-background !shadow-sm hover:!shadow-md !transition-all !p-6">
          <CardHeader className="!p-0 !mb-3">
            <div className="!flex !items-start !justify-between">
              <CardDescription className="!text-sm !text-muted-foreground">
                Total de Imóveis
              </CardDescription>
              <Badge
                variant="outline"
                className="!flex !items-center !gap-1 !text-xs"
              >
                <IconTrendingUp className="!w-4 !h-4" /> +12%
              </Badge>
            </div>
            <CardTitle className="!text-3xl !font-semibold !flex !items-center !gap-2 !mt-2">
              <IconBuildingCommunity className="!w-7 !h-7 !text-primary" />{" "}
              {data.totalImoveis}
            </CardTitle>
          </CardHeader>
          <CardFooter className="!flex-col !items-start !gap-1.5 !text-sm !p-0">
            <div className="!flex !gap-2 !font-medium !text-green-600 dark:!text-green-400">
              {data.ativos} ativos • {data.inativos} inativos
            </div>
            <div className="!text-muted-foreground">
              Imóveis cadastrados e ativos no sistema
            </div>
          </CardFooter>
        </Card>

        {/* === Card 2 - Usuários === */}
        <Card className="!rounded-xl !bg-gradient-to-b !from-muted/40 !to-background !shadow-sm hover:!shadow-md !transition-all !p-6">
          <CardHeader className="!p-0 !mb-3">
            <div className="!flex !items-start !justify-between">
              <CardDescription className="!text-sm !text-muted-foreground">
                Usuários Ativos
              </CardDescription>
              <Badge
                variant="outline"
                className="!flex !items-center !gap-1 !text-xs"
              >
                <IconTrendingUp className="!w-4 !h-4" /> +4.5%
              </Badge>
            </div>
            <CardTitle className="!text-3xl !font-semibold !flex !items-center !gap-2 !mt-2">
              <IconUser className="!w-7 !h-7 !text-primary" />{" "}
              {data.usuariosAtivos}
            </CardTitle>
          </CardHeader>
          <CardFooter className="!flex-col !items-start !gap-1.5 !text-sm !p-0">
            <div className="!flex !gap-2 !font-medium !text-green-600 dark:!text-green-400">
              Novos cadastros semanais <IconTrendingUp className="!w-4 !h-4" />
            </div>
            <div className="!text-muted-foreground">
              Usuários engajados com a plataforma
            </div>
          </CardFooter>
        </Card>

        {/* === Card 3 - Corretores === */}
        <Card className="!rounded-xl !bg-gradient-to-b !from-red-50 !to-background !shadow-sm hover:!shadow-md !transition-all !p-6">
          <CardHeader className="!p-0 !mb-3">
            <div className="!flex !items-start !justify-between">
              <CardDescription className="!text-sm !text-muted-foreground">
                Corretores
              </CardDescription>
              <Badge
                variant="outline"
                className="!flex !items-center !gap-1 !text-xs !text-red-500"
              >
                <IconTrendingDown className="!w-4 !h-4" /> -8%
              </Badge>
            </div>
            <CardTitle className="!text-3xl !font-semibold !flex !items-center !gap-2 !mt-2">
              <IconUserCheck className="!w-7 !h-7 !text-primary" />{" "}
              {data.corretores}
            </CardTitle>
          </CardHeader>
          <CardFooter className="!flex-col !items-start !gap-1.5 !text-sm !p-0">
            <div className="!flex !gap-2 !font-medium !text-red-500">
              Queda leve no período <IconTrendingDown className="!w-4 !h-4" />
            </div>
            <div className="!text-muted-foreground">
              Menos cadastros recentes
            </div>
          </CardFooter>
        </Card>

        {/* === Card 4 - Vendedores === */}
        <Card className="!rounded-xl !bg-gradient-to-b !from-muted/40 !to-background !shadow-sm hover:!shadow-md !transition-all !p-6">
          <CardHeader className="!p-0 !mb-3">
            <div className="!flex !items-start !justify-between">
              <CardDescription className="!text-sm !text-muted-foreground">
                Vendedores
              </CardDescription>
              <Badge
                variant="outline"
                className="!flex !items-center !gap-1 !text-xs"
              >
                <IconTrendingUp className="!w-4 !h-4" /> +2%
              </Badge>
            </div>
            <CardTitle className="!text-3xl !font-semibold !flex !items-center !gap-2 !mt-2">
              <IconShoppingBag className="!w-7 !h-7 !text-primary" />{" "}
              {data.vendedores}
            </CardTitle>
          </CardHeader>
          <CardFooter className="!flex-col !items-start !gap-1.5 !text-sm !p-0">
            <div className="!flex !gap-2 !font-medium !text-green-600 dark:!text-green-400">
              Estabilidade nas vendas <IconTrendingUp className="!w-4 !h-4" />
            </div>
            <div className="!text-muted-foreground">Desempenho constante</div>
          </CardFooter>
        </Card>
      </div>

      {/* ===== NOVA SEÇÃO - VALOR PATRIMONIAL TOTAL ===== */}
      <Card className="!rounded-2xl !bg-gradient-to-b !from-muted/40 !to-background !shadow-sm hover:!shadow-md !transition-all !p-8">
        <CardHeader className="!p-0">
          <div className="!flex !items-start !justify-between">
            <CardDescription className="!text-sm !text-muted-foreground">
              Valor Patrimonial Total
            </CardDescription>
            <IconBuildingBank className="!w-7 !h-7 !text-primary" />
          </div>
          <CardTitle className="!text-4xl !font-bold !mt-4">
            {formatBRL(data.valorPatrimonialTotal)}
          </CardTitle>
        </CardHeader>

        <CardFooter className="!flex !justify-between !items-center !mt-4 !p-0">
          <div className="!flex !items-center !gap-2 !text-green-600 dark:!text-green-400">
            <IconTrendingUp className="!w-4 !h-4" />
            <span className="!text-sm !font-medium">
              Crescimento mensal estimado +5.8%
            </span>
          </div>
          <div className="!text-sm !text-muted-foreground">
            Baseado nos imóveis cadastrados
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
