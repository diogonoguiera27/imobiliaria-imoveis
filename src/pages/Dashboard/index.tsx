// src/pages/UserManagement/index.tsx
import { Footer } from "@/components/Footer";
import SidebarTrigger, { SidebarProvider } from "@/components/ui/sidebar";
import { getDashboardSummary } from "@/service/dashboardService";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";

import {
  Indicators,
  ChartPropertyTypes,
  ChartPriceRange,
  ChartNeighborhoods,
  ChartTopViewed,
} from "@/components/UserManagement";

type TipoImovelData = { name: string; value: number };
type FaixaPrecoData = { faixa: string; value: number };
type BairroData = { bairro: string; value: number };
type TopVisualizado = { property: string; views: number };

export default function Dashboard() {
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
          totalImoveis: Number(summary.totalImoveis) || 0,
          ativos: Number(summary.ativos) || 0,
          inativos: Number(summary.inativos) || 0,
          totalVisualizacoes: Number(summary.totalVisualizacoes) || 0,
          contatosRecebidos: Number(summary.contatosRecebidos) || 0,
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

  const semDados = !loading && indicadores.totalImoveis === 0;

  return (
    <SidebarProvider>
      <div className="!w-screen !px-6 !pt-20 !space-y-10">
        <SidebarTrigger />

        {semDados ? (
          <div className="!flex !justify-center !items-center !h-[70vh]">
            <EmptyState
              message="Você ainda não possui imóveis cadastrados"
              actionLabel="Cadastrar Imóvel"
              redirectTo="/imovel/novo"
            />
          </div>
        ) : (
          <>
            <Indicators indicadores={indicadores} loading={loading} />

            {/* Primeira linha de gráficos */}
            <div className="!flex !flex-wrap !gap-6 !justify-center !mt-4">
              <div className="!w-full sm:!w-[48%]">
                <ChartPropertyTypes data={tiposDeImoveisData} loading={loading} />
              </div>
              <div className="!w-full sm:!w-[48%]">
                <ChartPriceRange data={faixaPrecoData} />
              </div>
            </div>

            {/* Segunda linha de gráficos */}
            <div className="!flex !flex-wrap !gap-6 !justify-center !mt-4">
              <div className="!w-full sm:!w-[48%]">
                <ChartNeighborhoods data={bairrosData} />
              </div>
              <div className="!w-full sm:!w-[48%]">
                <ChartTopViewed topVisualizados={topVisualizados} />
              </div>
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
