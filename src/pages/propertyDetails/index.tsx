import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  buscarImovel,             // ✅ função já existente
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
  // ⚡ agora pode ser UUID ou número
  const { id: identifier } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [similares, setSimilares] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) return;

    const carregarImovel = async () => {
      try {
        // ✅ busca por identifier (uuid ou id)
        const dados = await buscarImovel(identifier);

        if (!dados || !dados.ativo) {
          navigate("/home", { replace: true });
          return;
        }

        setImovel(dados);

        // ✅ também aceita identifier (id ou uuid)
        const similaresAPI = await buscarImoveisSimilares(identifier);
        const ativos = similaresAPI.filter((s: Imovel) => s.ativo);
        setSimilares(ativos);

        await registrarVisualizacao(identifier);
      } catch (err: unknown) {
        console.error("Erro ao buscar imóvel:", err);
        navigate("/home", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    carregarImovel();
  }, [identifier, navigate]);

  if (loading || !imovel) return null;

  return (
    <SidebarProvider>
      <div className="flex flex-col !w-full !overflow-x-hidden">
        <SidebarTrigger />

        <main className="flex-grow !mt-10">
          {/* 🚀 Wrapper que força responsividade */}
          <div className="!w-full !px-3 sm:!px-4 md:!max-w-6xl md:!mx-auto">
            <MainCarousel imagem={imovel.imagem} />
            <PropertyInfoAndContact imovel={imovel} />
            {similares.length > 0 && (
              <SimilarProperties imoveis={similares} />
            )}
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
