// src/pages/propertyDetails/index.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  buscarImovelPorId,
  buscarImoveisSimilares,
} from "@/service/propertyService";
import { registrarVisualizacao } from "@/service/dashboardService";
import { Imovel } from "@/types";

import {
  MainCarousel,
  PropertyInfoAndContact,
  SimilarProperties,
} from "@/components/PropertyDetails/";

export function ImovelDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [similares, setSimilares] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const propertyId = Number(id);

      const carregarImovel = async () => {
        try {
          const dados = await buscarImovelPorId(propertyId);

          // 🔥 se o imóvel não existir ou estiver inativo → redireciona
          if (!dados || !dados.ativo) {
            navigate("/home", { replace: true });
            return;
          }

          setImovel(dados);

          const similaresAPI = await buscarImoveisSimilares(propertyId);

          // 🔥 garante que só imóveis ativos aparecem nos similares
          const ativos = similaresAPI.filter((s: Imovel) => s.ativo);
          setSimilares(ativos);

          await registrarVisualizacao(propertyId);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Erro ao buscar imóvel:", err.message);
          } else {
            console.error("Erro desconhecido ao buscar imóvel:", err);
          }
          navigate("/home", { replace: true });
        } finally {
          setLoading(false);
        }
      };

      carregarImovel();
    }
  }, [id, navigate]);

  if (loading) {
    return null; // não mostra nada durante carregamento
  }

  if (!imovel) {
    return null; // não mostra nada se não encontrou (já redirecionou)
  }

  return (
    <SidebarProvider>
      <div className="flex !flex-col !w-screen !overflow-x-hidden">
        <SidebarTrigger />
        <main className="!flex-grow !mt-10">
          <div className="w-full !max-w-[80%] !mx-auto !px-4 !mt-6">
            <MainCarousel imagem={imovel.imagem} />
            <PropertyInfoAndContact imovel={imovel} />
            {similares.length > 0 && <SimilarProperties imoveis={similares} />}
          </div>
        </main>
        <div className="!mt-4">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ImovelDetalhes;
