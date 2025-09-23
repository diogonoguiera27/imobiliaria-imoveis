// src/pages/Home.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeroBanner, SearchFilter, HighlightSection } from "@/components/Home";
import { Imovel } from "@/types";
import Pagination from "@/components/Pagination";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import { useLocation, useNavigate } from "react-router-dom";
import { CardProperties } from "@/components/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { buscarImoveis } from "@/service/propertyService";
import ContactPhoneModal from "@/components/PhoneContactModal";
import { useContactContext } from "@/hooks/contact/useContact";

const ITEMS_PER_PAGE = 12;

const norm = (s: string | null | undefined): string =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const contains = (
  hay: string | null | undefined,
  needle: string | null | undefined
): boolean => {
  const n = norm(needle);
  if (!n) return true;
  return norm(hay).includes(n);
};

export function Home() {
  const [todosImoveis, setTodosImoveis] = useState<Imovel[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ novo estado

  const { showContactModal, showPhoneModal, closeModals } = useContactContext();
  const location = useLocation();
  const navigate = useNavigate();

  const totalPages = useMemo(
    () => Math.ceil(imoveisFiltrados.length / ITEMS_PER_PAGE) || 1,
    [imoveisFiltrados.length]
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImoveis = useMemo(
    () => imoveisFiltrados.slice(startIndex, endIndex),
    [imoveisFiltrados, startIndex, endIndex]
  );

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const imoveisAPI = await buscarImoveis();
        setTodosImoveis(imoveisAPI);
        if (!filtroAtivo) {
          setImoveisFiltrados(imoveisAPI);
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis da API:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarImoveis();
  }, [filtroAtivo]);

  const handleLimparFiltro = useCallback(() => {
    setFiltroAtivo(false);
    setImoveisFiltrados(todosImoveis);
    setCurrentPage(1);
  }, [todosImoveis]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get("reset") === "true";
    if (shouldReset) {
      handleLimparFiltro();
      navigate("/home", { replace: true });
    }
  }, [location.search, navigate, handleLimparFiltro]);

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

  type Filtros = { cidade?: string; tipo?: string; precoMax?: number };

  const handleFiltrar = (filtros: Filtros) => {
    const PRECO_MIN = 50_000;
    const PRECO_MAX_DEFAULT = 3_000_000;

    const teto =
      typeof filtros.precoMax === "number" && Number.isFinite(filtros.precoMax)
        ? filtros.precoMax
        : PRECO_MAX_DEFAULT;

    let resultado = todosImoveis.filter((imovel) => {
      const okPreco = imovel.preco >= PRECO_MIN && imovel.preco <= teto;
      const okTipo = contains(imovel.tipo, filtros.tipo);
      const okCidade = contains(imovel.cidade, filtros.cidade);
      return okPreco && okTipo && okCidade;
    });

    resultado = resultado.sort((a, b) => b.preco - a.preco);

    setImoveisFiltrados(resultado);
    setFiltroAtivo(true);
    setCurrentPage(1);
  };

  // 🔹 Skeleton placeholder para o grid
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: 8 }).map((_, i) => (
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
                {" "}
                {/* ✅ largura fixa */}
                {currentImoveis.length > 0 && !loading && (
                  <div className="w-full !flex !justify-center !mb-4 mt-8">
                    <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2">
                      Resultados filtrados
                    </h2>
                  </div>
                )}
                {loading ? (
                  <GridSkeleton />
                ) : currentImoveis.length === 0 ? (
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
                        {currentImoveis.map((item) => (
                          <CardProperties key={item.id} item={item} />
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
            <HighlightSection />
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