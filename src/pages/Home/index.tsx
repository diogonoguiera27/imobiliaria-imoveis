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
import { Button } from "@/components/ui/button"
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

  // 🔄 Buscar imóveis
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
      <div className="!w-screen !min-h-screen !flex !flex-col !overflow-x-hidden">
        <SidebarTrigger />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="!flex-1 !flex !flex-col">
          {/* 🏠 HERO + FILTRO SOBREPOSTO */}
          <section
            className="relative w-full flex flex-col !mb-[120px]        
            !md:mb-[180px]  "
          >
            {/* 🔴 Imagem/banner de fundo */}

            <HeroBanner />

            {/* 🔳 Filtro sobreposto (metade dentro / metade fora da imagem) */}
            <div
              className="
      absolute
      
      left-1/2
      -translate-x-1/2
      top-[calc(60vh-180px)]
      w-[95%]
      md:w-[80%]
      
      justify-start
      
      !flex
      !flex-col md:!flex-row
      !items-center
      
      !gap-6
      !rounded-[16px]
      !overflow-hidden
      !h-auto md:!h-[598px]
      !z-[0]
      !m-0
      !p-0
      !transition-all
      !duration-300
      
    "
            >
              {/* 🖼️ Imagem com border radius */}
              <div
                className="
    !relative
    !w-full
    !h-[220px]
    md:!absolute
    md:!top-0
    -mt-[60px] 
    md:!right-0
    md:!w-[80%]
    md:!h-full
    !overflow-hidden
    !rounded-[16px]          
    md:!rounded-none          
    md:!rounded-l-[16px]      
    !z-[0]
  "
              >
                <img
                  src={heroImage}
                  alt="Imagem de destaque de imóveis"
                  className="
      !w-full
      !h-full
      !object-cover
      !object-center
      !rounded-[16px]         
      md:!rounded-none        
      md:!rounded-l-[16px]    
      
    "
                />
              </div>

              {/* 🧭 Card de filtro flutuante por cima da imagem */}
              <div
                className="
        relative
        z-20
        max-w-[440px]
        -mt-[60px]
        md:-mt-[80px]
        ml-[2%]
        md:ml-[4%]
      "
              >
                <div
                  className="
          !bg-white
          !rounded-[16px]
          !shadow-[0_8px_30px_rgba(0,0,0,0.15)]
          !overflow-hidden
          !border
          !border-[#f1f1f1]
        "
                >
                  <SearchFilter
                    onFiltrar={handleFiltrar}
                    onLimparFiltro={handleLimparFiltro}
                    filtroAtivo={filtroAtivo}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 🔹 CONTEÚDO ABAIXO DO HERO */}
          <div className="!w-[95%] md:!w-[80%] !mx-auto !mt-[220px] !flex-1">
            {filtroAtivo ? (
              <section className="!w-full !mt-8 !pb-12">
                {loading ? (
                  <GridSkeleton />
                ) : imoveis.length === 0 ? (
                  <div className="text-center text-gray-600 text-lg font-semibold mt-12 mb-24">
                    Nenhum imóvel encontrado
                  </div>
                ) : (
                  <>
                    {/* 💻 Desktop */}
                    <div className="hidden md:block">
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 ${
                          totalPages <= 1 ? "!mb-12" : ""
                        }`}
                      >
                        {imoveis.map((item) => (
                          <PropertyCard key={item.id} item={item} />
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="w-full flex mt-10 justify-center">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        </div>
                      )}
                    </div>

                    {/* 📱 Mobile */}
                    <div className="block md:hidden mt-6 !max-w-[90%] !mx-auto">
                      {imoveis.map((item) => (
                        <div key={item.id} className="mb-4">
                          <PropertyCard item={item} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            ) : (
              <section className="!w-full !mt-10 !pb-12">
                <FeaturedCarousel />
                <div className="!mt-8">
                  <PopularProperties />
                </div>
                <div className="!mt-8">
                  <DiscountedProperties />
                </div>
                <div className="w-full flex justify-center !mt-12">
                  <Button
                    onClick={() => navigate("/imoveis-venda")}
                    className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 transition-colors duration-200"
                  >
                    Ver todos os imóveis
                  </Button>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* ⚙️ Rodapé */}
        <div className="!mt-auto">
          <FooterDesktop variant="list" />
        </div>

        {/* 📱 Barra inferior mobile */}
        <div className="!block md:!hidden !mt-8">
          <MobileBottomBar />
        </div>

        {/* 💬 Modais */}
        <Dialog
          open={showContactModal}
          onOpenChange={(o) => !o && closeModals()}
        >
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
