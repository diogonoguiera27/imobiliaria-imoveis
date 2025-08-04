import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  HeroBanner,
  SearchFilter,
  HighlightSection,
} from "@/components/Home";
import { Imovel } from "@/types";
import Pagination from "@/components/Pagination";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { useLocation, useNavigate } from "react-router-dom";
import { CardProperties } from "@/components/PropertyCard";
import { buscarImoveis } from "@/service/propertyService";

const ITEMS_PER_PAGE = 12;

export function Home() {
  const [todosImoveis, setTodosImoveis] = useState<Imovel[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const totalPages = Math.ceil(imoveisFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImoveis = imoveisFiltrados.slice(startIndex, endIndex);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        const imoveisAPI = await buscarImoveis();
        setTodosImoveis(imoveisAPI);
      } catch (error) {
        console.error("Erro ao buscar imóveis da API:", error);
      }
    }

    carregarImoveis();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldReset = params.get("reset") === "true";

    if (shouldReset) {
      handleLimparFiltro();
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  type Filtros = {
    cidade?: string;
    tipo?: string;
    precoMax?: number;
  };

  const handleFiltrar = (filtros: Filtros) => {
    let resultado = todosImoveis.filter((imovel) => {
      return (
        (!filtros.cidade || imovel.cidade === filtros.cidade) &&
        (!filtros.tipo || imovel.tipo === filtros.tipo) &&
        (!filtros.precoMax || imovel.preco === filtros.precoMax)
      );
    });

    resultado = resultado.sort((a, b) => b.preco - a.preco);
    setImoveisFiltrados(resultado);
    setFiltroAtivo(true);
    setCurrentPage(1);
  };

  const handleLimparFiltro = () => {
    setFiltroAtivo(false);
    setImoveisFiltrados([]);
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="!min-h-screen flex !flex-col !overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <HeroBanner />
          <SearchFilter
            onFiltrar={handleFiltrar}
            onLimparFiltro={handleLimparFiltro}
            filtroAtivo={filtroAtivo}
          />

          {filtroAtivo ? (
            <section className="w-full px-4 pt-0 !mt-8">
              <div className="w-full !max-w-[80%] !mx-auto">

                {currentImoveis.length > 0 ? (
                  <div className="w-full !flex !justify-center !mb-4 mt-8">
                    <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2">
                      Resultados filtrados
                    </h2>
                  </div>
                ) : null}

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
                            onOpenContactModal={() =>
                              setShowContactModal(true)
                            }
                            onOpenPhoneModal={() =>
                              setShowPhoneModal(true)
                            }
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

              <Dialog
                open={showContactModal}
                onOpenChange={setShowContactModal}
              >
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
        <Footer />
      </div>
    </SidebarProvider>
  );
}
