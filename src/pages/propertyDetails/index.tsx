import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  buscarImovel,
  buscarImoveisSimilares,
} from "@/service/propertyService";
import { Imovel } from "@/types";
import SimilarProperties from "@/components/SimilarProperties";
import DescricaoEContato from "@/components/PropertyInfoAndContact";
import CarrosselPrincipal from "@/components/MainCarousel";
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

/**
 * ============================================================
 * 🏠 PÁGINA DE DETALHES DO IMÓVEL
 * ============================================================
 * - Busca o imóvel pelo ID (ou UUID)
 * - Mostra informações, descrição, imagens e imóveis similares
 * - Não registra mais visualizações (essa lógica foi removida)
 * ============================================================
 */
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
          <div className="!w-full !px-0 md:!max-w-[80%] md:!mx-auto">
            {/* ===== CARROSSEL DE IMAGENS ===== */}
            <CarrosselPrincipal imagem={imovel.imagem} />

            {/* ===== DESCRIÇÃO E FORMULÁRIO DE CONTATO ===== */}
            <div className="!mt-10">
              <DescricaoEContato imovel={imovel} />
            </div>

            {/* ===== IMÓVEIS SIMILARES ===== */}
            {similares.length > 0 && (
              <div className="!mt-10">
                <SimilarProperties imoveis={similares} />
              </div>
            )}
          </div>
        </main>

        {/* ===== FOOTER ===== */}
        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>

        {/* ===== BARRA INFERIOR MOBILE ===== */}
        <div className="block md:hidden !mt-8">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ImovelDetalhes;
