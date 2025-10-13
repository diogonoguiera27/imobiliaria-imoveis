import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  buscarImovel,
  buscarImoveisSimilares,
} from "@/service/propertyService";
import { registrarVisualizacao } from "@/service/dashboardService";
import { Imovel } from "@/types";
import SimilarProperties from "@/components/SimilarProperties";
import DescricaoEContato from "@/components/PropertyInfoAndContact";
import CarrosselPrincipal from "@/components/MainCarousel";
import { FooterDesktop } from "@/components/FooterDesktop";

export function ImovelDetalhes() {
  const { id: identifier } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [similares, setSimilares] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!identifier) return;

    const carregarImovel = async () => {
      try {
        const dados = await buscarImovel(identifier);

        if (!dados || !dados.ativo) {
          navigate("/home", { replace: true });
          return;
        }

        setImovel(dados);

        const similaresAPI = await buscarImoveisSimilares(identifier);
        const ativos = similaresAPI.filter((s: Imovel) => s.ativo);
        setSimilares(ativos);

        await registrarVisualizacao(identifier);
      } catch (err) {
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
      <div className="!flex !flex-col !w-full !overflow-x-hidden">
        <SidebarTrigger />

        <main className="!flex-grow !mt-10">
          {/* 🏠 Container centralizado com 80% no desktop */}
          <div className="!w-full !px-0 md:!max-w-[80%] md:!mx-auto">
            {/* 🖼️ Carrossel principal */}
            <CarrosselPrincipal imagem={imovel.imagem} />

            {/* 🧱 Descrição + Contato */}
            <div className="!mt-10">
              <DescricaoEContato imovel={imovel} />
            </div>

            {/* 🏘️ Imóveis Similares */}
            {similares.length > 0 && (
              <div className="!mt-10">
                <SimilarProperties imoveis={similares} />
              </div>
            )}
          </div>
        </main>

        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ImovelDetalhes;
