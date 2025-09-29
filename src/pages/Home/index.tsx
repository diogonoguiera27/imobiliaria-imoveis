// src/pages/Home.tsx
import { useCallback, useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Imovel } from "@/types";
import Pagination from "@/components/Pagination";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import { useLocation, useNavigate } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { buscarImoveis, PaginatedProperties } from "@/service/propertyService";
import ContactPhoneModal from "@/components/PhoneContactModal";
import { useContactContext } from "@/hooks/contact/useContact";

import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/HeroBanner";
import SearchFilter from "@/components/SearchFilter";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import PopularProperties from "@/components/PopularProperties";
import DiscountedProperties from "@/components/DiscountedProperties";
import PropertyCard from "@/components/CardProperties";

const ITEMS_PER_PAGE = 8;

export function Home() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [filtros, setFiltros] = useState<{ cidade?: string; tipo?: string; precoMax?: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { showContactModal, showPhoneModal, closeModals } = useContactContext();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Buscar imóveis paginados (com ou sem filtro)
  const carregarImoveis = useCallback(
    async (page: number, activeFilters = filtros) => {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarImoveis({
          page,
          take: ITEMS_PER_PAGE,
          ...activeFilters, // aplica filtros se existirem
        });

        setImoveis(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Erro ao buscar imóveis da API:", error);
      } finally {
        setLoading(false);
      }
    },
    [filtros]
  );

  // 🔹 Carregar imóveis quando troca de página
  useEffect(() => {
    carregarImoveis(currentPage);
  }, [carregarImoveis, currentPage]);

  // 🔹 Resetar filtros
  const handleLimparFiltro = useCallback(() => {
    setFiltroAtivo(false);
    setFiltros({});
    setCurrentPage(1);
    carregarImoveis(1, {});
  }, [carregarImoveis]);

  // 🔹 Resetar via query param ?reset=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get("reset") === "true";
    if (shouldReset) {
      handleLimparFiltro();
      navigate("/home", { replace: true });
    }
  }, [location.search, navigate, handleLimparFiltro]);

  // 🔹 Resetar via evento global
  useEffect(() => {
    const handleClear = () => {
      handleLimparFiltro();
      if (location.search) {
        navigate({ pathname: "/home", search: "" }, { replace: true });
      }
    };
    window.addEventListener("clear-filters", handleClear);
    return () => window.removeEventListener("clear-filters", handleClear);
  }, [location.search, navigate, handleLimparFiltro]);

  // 🔹 Aplicar filtro
  const handleFiltrar = async (novosFiltros: { cidade?: string; tipo?: string; precoMax?: number }) => {
    try {
      setLoading(true);
      const response: PaginatedProperties = await buscarImoveis({
        ...novosFiltros,
        page: 1,
        take: ITEMS_PER_PAGE,
      });

      setImoveis(response.data);
      setTotalPages(response.pagination.totalPages);
      setFiltros(novosFiltros);
      setFiltroAtivo(true);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao aplicar filtro:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Skeleton placeholder para o grid
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
        <div
          key={i}
          className="!w-[285px] !h-[460px] !bg-white !rounded-xl !shadow-md !border !border-gray-200 !p-4 mx-auto"
        >
          <Skeleton className="!w-full !h-[180px] !mb-4" />
          <div className="!flex !flex-col !gap-2">
            <Skeleton className="!h-4 !w-3/4" />
            <Skeleton className="!h-4 !w-1/2" />
            <Skeleton className="!h-4 !w-2/3" />
            <Skeleton className="!h-4 !w-1/3" />
            <Skeleton className="!h-6 !w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="!min-h-screen flex !flex-col !overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <HeroBanner />

          {/* 🚀 Filtro */}
          <div
            className="w-full !mx-auto !px-4 md:!px-0 
                       !max-w-[1412px] md:!max-w-[1412px] sm:!w-[95%]"
          >
            <SearchFilter
              onFiltrar={handleFiltrar}
              onLimparFiltro={handleLimparFiltro}
              filtroAtivo={filtroAtivo}
            />
          </div>

          {filtroAtivo ? (
            <section className="w-full px-4 pt-0 !mt-8">
              <div className="w-full !max-w-[1412px] !mx-auto">
                {imoveis.length > 0 && !loading && (
                  <div className="w-full !flex !justify-center !mb-4 mt-8">
                    <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2">
                      Resultados filtrados
                    </h2>
                  </div>
                )}
                {loading ? (
                  <GridSkeleton />
                ) : imoveis.length === 0 ? (
                  <div className="text-center text-gray-600 text-lg font-semibold mt-12 mb-24">
                    Nenhum imóvel encontrado
                  </div>
                ) : (
                  <>
                    <div className="w-full flex justify-center mt-6">
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 ${
                          totalPages <= 1 ? "!mb-12" : ""
                        }`}
                      >
                        {imoveis.map((item) => (
                          <PropertyCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>

                    {totalPages > 1 && (
                      <div className="w-full !flex !mt-10 !justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          ) : (
            // 🚀 Destaques (substituindo o antigo HighlightSection)
            <section className="!p-4">
              <FeaturedCarousel />
              <PopularProperties />
              <DiscountedProperties />

              <div className="w-full !flex !justify-center !mt-12">
                <Button
                  onClick={() => navigate("/imoveis-venda")}
                  className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 transition-colors duration-200"
                >
                  Ver todos os imóveis
                </Button>
              </div>
            </section>
          )}
        </main>

        <Dialog
          open={showContactModal}
          onOpenChange={(o) => !o && closeModals()}
        >
          <MessageFormModal />
        </Dialog>

        <Dialog open={showPhoneModal} onOpenChange={(o) => !o && closeModals()}>
          <ContactPhoneModal />
        </Dialog>

        <div className="!mt-8">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Home;
