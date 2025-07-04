import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeroBanner, SearchFilter, HighlightSection } from "@/components/Home";
import { imoveis as todosImoveis } from "@/data/imovel";
import { Imovel } from "@/types";
import { Heart } from "lucide-react";
import { FaRulerCombined, FaBed, FaBath, FaCar } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MessageFormModal, PhoneContactModal } from "@/components/Modals";
import { useLocation, useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

export function Home() {
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(imoveisFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImoveis = imoveisFiltrados.slice(startIndex, endIndex);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const shouldReset = params.get("reset") === "true";

  if (shouldReset) {
    handleLimparFiltro();             // limpa os filtros
    navigate("/", { replace: true }); // remove o ?reset=true da URL
  }
}, [location.search,navigate]);

  type Filtros = {
    cidade?: string;
    tipo?: string;
    precoMax?: number;
  };

  const handleFiltrar = (filtros: Filtros) => {
    const resultado = todosImoveis.filter((imovel) => {
      return (
        (!filtros.cidade || imovel.cidade === filtros.cidade) &&
        (!filtros.tipo || imovel.tipo === filtros.tipo) &&
        (!filtros.precoMax || imovel.preco <= filtros.precoMax)
      );
    });

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
                <div className="w-full !flex !justify-center !mb-4 mt-8">
                  <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2">
                    Resultados filtrados
                  </h2>
                </div>
                <div className="w-full flex justify-center mt-6">
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6 ${
                      totalPages <= 1 ? "!mb-12" : ""
                    }`}
                  >
                    {currentImoveis.map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          (window.location.href = `/imovel/${item.id}`)
                        }
                        className="w-[285px] !h-[431px] !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-700 hover:scale-[1.01] transition cursor-pointer flex flex-col"
                      >
                        <div className="w-full !h-[180px] !overflow-hidden">
                          <img
                            src={item.imagem}
                            alt={`${item.tipo} em ${item.bairro}, ${item.cidade}`}
                            className="w-full h-full !object-cover !block"
                          />
                        </div>

                        <div className="!p-4 !bg-gray-100 !border-t !border-gray-800 flex flex-col justify-between gap-4 !rounded-b-xl flex-1">
                          <div className="flex flex-col gap-2 text-left">
                            <h3 className="!text-base !font-semibold !text-gray-900 !leading-snug break-words">
                              {item.bairro}, {item.cidade}
                            </h3>
                            <p className="!text-sm !text-gray-500 break-words">
                              {item.endereco}
                            </p>
                            <p className="text-xs font-semibold uppercase text-red-600">
                              {item.tipoNegocio === "venda"
                                ? "Venda"
                                : "Aluga-se"}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-x-3 gap-y-2 !text-gray-600 !text-sm">
                            <div className="flex items-center gap-2">
                              <FaRulerCombined className="text-[15px]" />
                              {item.metragem} m²
                            </div>
                            <div className="flex items-center gap-2">
                              <FaBed className="text-[15px]" />
                              {item.quartos}
                            </div>
                            <div className="flex items-center gap-2">
                              <FaBath className="text-[15px]" />
                              {item.banheiros}
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCar className="text-[15px]" />
                              {item.vagas}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <p className="!text-xs !text-gray-800 !font-bold mb-1">
                                {item.tipo}
                              </p>
                              <p className="!text-base !font-bold !text-gray-900">
                                {" "}
                                R${" "}
                                {item.preco.toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </p>
                              {item.infoExtra && (
                                <p className="!text-xs !text-gray-500">
                                  {item.infoExtra}
                                </p>
                              )}
                            </div>
                            <button className="!text-red-500 hover:!text-red-600">
                              <Heart strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="flex justify-between gap-2 mt-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowContactModal(true);
                              }}
                              className="flex-1 !bg-red-500 text-white !text-sm !rounded hover:!bg-red-700 transition-colors duration-200"
                            >
                              Mensagem
                            </Button>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPhoneModal(true);
                              }}
                              className="flex-1 !bg-transparent !text-red-600 text-sm rounded hover:bg-red-700"
                            >
                              Telefone
                            </Button>
                          </div>
                        </div>
                      </div>
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
