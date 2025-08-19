import { useCallback, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeroBanner, SearchFilter, HighlightSection } from "@/components/Home";
import { Imovel } from "@/types";
import Pagination from "@/components/Pagination";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { useLocation, useNavigate } from "react-router-dom";
import { CardProperties } from "@/components/PropertyCard";
import { buscarImoveis } from "@/service/propertyService";

const ITEMS_PER_PAGE = 12;

// helpers locais para normalização e comparação de texto
const norm = (s: string | null | undefined): string =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const contains = (hay: string | null | undefined, needle: string | null | undefined): boolean => {
  const n = norm(needle);
  if (!n) return true; // filtro vazio não restringe
  return norm(hay).includes(n); // substring insensitive
};

export function Home() {
  const [todosImoveis, setTodosImoveis] = useState<Imovel[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // paginação derivada
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

  // carrega imóveis da API
  useEffect(() => {
    async function carregarImoveis() {
      try {
        const imoveisAPI = await buscarImoveis();
        setTodosImoveis(imoveisAPI);
        // se não houver filtro ativo, exibir todos
        if (!filtroAtivo) {
          setImoveisFiltrados(imoveisAPI);
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis da API:", error);
      }
    }
    carregarImoveis();
  }, [filtroAtivo]);

  // limpar filtro
  const handleLimparFiltro = useCallback(() => {
    setFiltroAtivo(false);
    setImoveisFiltrados(todosImoveis);
    setCurrentPage(1);
  }, [todosImoveis]);

  // suporte a reset via query param / evento global
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

  // -------------------------
  // FILTRO (faixa + substring)
  // -------------------------
  type Filtros = {
    cidade?: string;
    tipo?: string;
    precoMax?: number; // usuário escolhe o teto; mínimo é fixo (50k)
  };

  const handleFiltrar = (filtros: Filtros) => {
    const PRECO_MIN = 50_000;
    const PRECO_MAX_DEFAULT = 3_000_000;

    const teto =
      typeof filtros.precoMax === "number" && Number.isFinite(filtros.precoMax)
        ? filtros.precoMax!
        : PRECO_MAX_DEFAULT;

    let resultado = todosImoveis.filter((imovel) => {
      const okPreco = imovel.preco >= PRECO_MIN && imovel.preco <= teto;
      const okTipo = contains(imovel.tipo, filtros.tipo);
      const okCidade = contains(imovel.cidade, filtros.cidade);
      return okPreco && okTipo && okCidade;
    });

    // ordenar do maior preço para o menor (mantido)
    resultado = resultado.sort((a, b) => b.preco - a.preco);

    setImoveisFiltrados(resultado);
    setFiltroAtivo(true);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="!min-h-screen flex !flex-col !overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <HeroBanner />

          {/* Componente de busca/filtro */}
          <SearchFilter
            onFiltrar={handleFiltrar}
            onLimparFiltro={handleLimparFiltro}
            filtroAtivo={filtroAtivo}
          />

          {filtroAtivo ? (
            <section className="w-full px-4 pt-0 !mt-8">
              <div className="w-full !max-w-[80%] !mx-auto">
                {currentImoveis.length > 0 && (
                  <div className="w-full !flex !justify-center !mb-4 mt-8">
                    <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2">
                      Resultados filtrados
                    </h2>
                  </div>
                )}

                {currentImoveis.length === 0 ? (
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
                          <CardProperties
                            key={item.id}
                            item={item}
                            onOpenContactModal={() => setShowContactModal(true)}
                            onOpenPhoneModal={() => setShowPhoneModal(true)}
                          />
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

              <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <MessageFormModal />
              </Dialog>

              <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
                <PhoneContactModal />
              </Dialog>
            </section>
          ) : (
            <HighlightSection />
          )}
        </main>

        <div className="!mt-8">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Home;
