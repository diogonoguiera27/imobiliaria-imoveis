import { useCallback, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FooterDesktop } from "@/components/FooterDesktop";
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
import heroImage from "@/assets/b.jpeg";
import PopularProperties from "@/components/PopularProperties";
import DiscountedProperties from "@/components/DiscountedProperties";
import PropertyCard from "@/components/CardProperties";
import MobileBottomBar from "@/components/MobileBottomBar";

const ITEMS_PER_PAGE = 8;

export function Home() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [filtros, setFiltros] = useState<{
    cidade?: string;
    tipo?: string;
    precoMax?: number;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { showContactModal, showPhoneModal, closeModals } = useContactContext();
  const location = useLocation();
  const navigate = useNavigate();

  // =============================
  // 🔹 Função: Carregar imóveis
  // =============================
  const carregarImoveis = useCallback(
    async (page: number, activeFilters = filtros) => {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarImoveis({
          page,
          take: ITEMS_PER_PAGE,
          ...activeFilters,
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

  useEffect(() => {
    carregarImoveis(currentPage);
  }, [carregarImoveis, currentPage]);

  // =============================
  // 🔹 Resetar filtro via URL
  // =============================
  const handleLimparFiltro = useCallback(() => {
    setFiltroAtivo(false);
    setFiltros({});
    setCurrentPage(1);
    carregarImoveis(1, {});
  }, [carregarImoveis]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("reset") === "true") {
      handleLimparFiltro();
      navigate("/home", { replace: true });
    }
  }, [location.search, navigate, handleLimparFiltro]);

  // =============================
  // 🔹 Aplicar filtros
  // =============================
  const handleFiltrar = async (novosFiltros: {
    cidade?: string;
    tipo?: string;
    precoMax?: number;
  }) => {
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

  // =============================
  // 🔹 Skeleton de carregamento
  // =============================
  const GridSkeleton = () => (
    <div className="!grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-4 !gap-6 !mt-6">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
        <div
          key={i}
          className="!w-full !max-w-[285px] !h-[460px] !bg-white !rounded-xl !shadow-md !border !border-gray-200 !p-4 !mx-auto"
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
      <div className="!w-full !min-h-screen !flex !flex-col">
        <SidebarTrigger />

        {/* ================= HERO SECTION ================= */}
        <section className="!relative !w-full">
          {/* 🔹 HERO BANNER (FUNDO VERMELHO) */}
          <div className="!absolute !top-0 !left-0 !w-full !h-[600px] !z-[0]">
            <HeroBanner />
          </div>

          {/* 🔹 BLOCO SOBREPOSTO (CARD + IMAGEM DE DESTAQUE) */}
          <div className="!relative !w-[95%] md:!w-[80%] !mx-auto !z-[10] !pt-[220px] md:!pt-[280px]">
            <div className="!relative !flex !flex-col md:!flex-row !items-start !gap-8 !z-[5]">
              {/* 🔹 CARD DE FILTRO */}
              <div className="!relative !z-[20] !w-full md:!w-[420px] !max-w-[440px] !mt-10">
                <div className="!bg-white !rounded-2xl !shadow-2xl !border !border-gray-100 !overflow-hidden">
                  <SearchFilter
                    onFiltrar={handleFiltrar}
                    onLimparFiltro={handleLimparFiltro}
                    filtroAtivo={filtroAtivo}
                  />
                </div>
              </div>

              {/* 🔹 IMAGEM DE DESTAQUE */}
              <div
                className="!relative !z-[10] 
                  !w-full md:!flex-1 
                  !h-[340px] md:!h-[590px] 
                  !rounded-2xl !overflow-hidden 
                  !shadow-xl 
                  md:!ml-[-120px]"
              >
                <img
                  src={heroImage}
                  alt="Imagem de destaque de imóveis"
                  className="!w-full !h-full !object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTEÚDO PRINCIPAL ================= */}
        <main className="!flex-1 !flex !flex-col !w-[95%] md:!w-[80%] !mx-auto">
          {filtroAtivo ? (
            <section className="!w-full !mt-8 !pb-12">
              {loading ? (
                <GridSkeleton />
              ) : imoveis.length === 0 ? (
                <div className="!text-center !text-gray-600 !text-lg !font-semibold !mt-12 !mb-24">
                  Nenhum imóvel encontrado
                </div>
              ) : (
                <>
                  {/* DESKTOP */}
                  <div className="!hidden md:!block">
                    <div
                      className={`!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 2xl:!grid-cols-5 !gap-6 !mt-6 ${
                        totalPages <= 1 ? "!mb-12" : ""
                      }`}
                    >
                      {imoveis.map((item) => (
                        <PropertyCard key={item.id} item={item} size="default" />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="!w-full !flex !mt-10 !justify-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </div>

                  {/* MOBILE */}
                  <div className="!block md:!hidden !mt-6 !max-w-[90%] !mx-auto">
                    {imoveis.map((item) => (
                      <div key={item.id} className="!mb-4">
                        <PropertyCard item={item} size="mobile" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          ) : (
            <section className="!w-full !mt-10 !pb-12">
              <div className=" !mx-auto">
                <FeaturedCarousel />
                <div className="!mt-8">
                  <PopularProperties />
                </div>
                <div className="!mt-8">
                  <DiscountedProperties />
                </div>
                <div className="!w-full !flex !justify-center !mt-12">
                  <Button
                    onClick={() => navigate("/imoveis-venda")}
                    className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 !transition-colors !duration-200"
                  >
                    Ver todos os imóveis
                  </Button>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* 🔻 RODAPÉ */}
        <div className="!mt-auto">
          <FooterDesktop variant="list" />
        </div>

        {/* 📱 MOBILE BOTTOM BAR */}
        <div className="!block md:!hidden !mt-8">
          <MobileBottomBar />
        </div>

        {/* 🧩 MODAIS */}
        <Dialog open={showContactModal} onOpenChange={(o) => !o && closeModals()}>
          <MessageFormModal />
        </Dialog>

        <Dialog open={showPhoneModal} onOpenChange={(o) => !o && closeModals()}>
          <ContactPhoneModal />
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

export default Home;
