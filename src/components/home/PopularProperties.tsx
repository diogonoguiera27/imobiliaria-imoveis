import { useEffect, useRef, useState } from "react";
import { FaBath, FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { MessageFormModal, PhoneContactModal } from "@/components/Modals";
import { Dialog } from "../ui/dialog";
import { Imovel } from "@/types";
import { imoveis as todosImoveis } from "@/data/imovel";


const ImoveisPopulares = () => {
  const imoveis: Imovel[] = todosImoveis.filter(imovel => imovel.categoria === "popular");

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const cardWidth = 285 + 16;
      const visibleCards = Math.floor(container.offsetWidth / cardWidth);
      setCardsPerPage(visibleCards);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(imoveis.length / cardsPerPage);

  const scrollToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = 285 + 16;
    const scrollLeft = page * cardWidth * cardsPerPage;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setCurrentPage(page);
  };

  return (
    <section className="w-full px-4 pt-0">
      <div className="w-full !max-w-[80%] !mx-auto">
        <div className="w-full flex justify-center mb-0 !mt-8">
          <h2 className="text-black text-xl font-bold text-center max-w-screen-lg ">
            Apartamentos mais populares perto de você
          </h2>
        </div>

        <div className="w-full flex justify-center !mt-4">
          <div className="relative max-w-[1412px] w-full">
            {currentPage > 0 && (
              <button
                onClick={() => scrollToPage(currentPage - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronLeft />
              </button>
            )}

            <div
              ref={containerRef}
              className="flex gap-4 overflow-x-hidden scroll-smooth items-center w-full hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {imoveis.map((item) => (
                <div
                  key={item.id}
                  onClick={() => (window.location.href = `/imovel/${item.id}`)}
                  className="w-[285px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-700 hover:scale-[1.01] transition cursor-pointer "
                >
                  <img
                    src={item.imagem}
                    alt={`${item.tipo} em ${item.bairro}, ${item.cidade}`}
                    className="w-full h-[180px] object-cover"
                  />

                  <div className="!p-4 !bg-gray-100 !border !border-gray-800 flex flex-col gap-4 !rounded-b-xl">
                    <div className="flex flex-col gap-2 text-left">
                      <h3 className="text-base font-semibold text-gray-900 leading-snug break-words">
                        {item.bairro},{item.cidade}
                      </h3>
                      <p className="text-sm text-gray-500 break-words">
                        {item.endereco}
                      </p>
                      <p className="text-xs font-semibold uppercase text-red-600">
                        {item.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-600 text-sm">
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
                        <p className="!text-xs !text-gray-800 !font-bold mb-1">{item.tipo}</p>
                        <p className="text-base font-bold text-gray-900">
                          R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        {item.infoExtra && (
                          <p className="text-xs text-gray-500">
                            {item.infoExtra}
                          </p>
                        )}
                      </div>
                      <button className="!text-red-500 !hover:text-red-600">
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

            {currentPage < totalPages - 1 && (
              <button
                onClick={() => scrollToPage(currentPage + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <MessageFormModal />
      </Dialog>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <PhoneContactModal />
      </Dialog>
    </section>
  );
};

export default ImoveisPopulares;
