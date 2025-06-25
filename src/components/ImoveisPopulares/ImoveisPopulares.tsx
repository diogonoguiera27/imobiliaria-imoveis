import { useEffect, useRef, useState } from "react";
import { FaBath, FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const imoveis = [
  {
    id: 1,
    imagem:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    titulo: "Parque Amazônia, Goiânia",
    endereco: "Rua Salvador",
    metragem: 75,
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    preco: "Aluguel de R$ 2.200/mês",
    infoExtra: "Cond. R$ 480",
  },
  {
    id: 2,
    imagem:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    titulo: "Setor Garavelo I, Trindade",
    endereco: "Rua José Braz",
    metragem: 30,
    quartos: 1,
    banheiros: 1,
    vagas: 1,
    preco: "R$ 600/mês",
    infoExtra: "",
  },
  {
    id: 3,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Parque Verde, Alagoinhas",
    endereco: "Rua Gregório de Mattos",
    metragem: 68,
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    preco: "R$ 350.000",
    infoExtra: "",
  },
  {
    id: 4,
    imagem:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    titulo: "Campeche, Florianópolis",
    endereco: "Rua Coruja Dourada",
    metragem: 75,
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    preco: "Aluguel de R$ 3.300/mês",
    infoExtra: "IPTU R$ 45",
  },
  {
    id: 5,
    imagem:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    titulo: "Nova Esperança, Natal",
    endereco: "Rua do Sol",
    metragem: 90,
    quartos: 2,
    banheiros: 1,
    vagas: 2,
    preco: "R$ 280.000",
    infoExtra: "Cond. R$ 320",
  },
  {
    id: 6,
    imagem:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    titulo: "Santa Rosa",
    endereco: "Rua do Sol",
    metragem: 90,
    quartos: 2,
    banheiros: 1,
    vagas: 2,
    preco: "R$ 280.000",
    infoExtra: "Cond. R$ 320",
  },
  {
    id: 7,
    imagem:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    titulo: "Santa Rosa",
    endereco: "Rua do Sol",
    metragem: 90,
    quartos: 2,
    banheiros: 1,
    vagas: 2,
    preco: "R$ 280.000",
    infoExtra: "Cond. R$ 320",
  },
];
export const ImoveisPopulares = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const cardWidth = 285 + 16; // largura do card + gap
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
    <section className="w-full px-4 pt-0  !mt-0">
      <div className="w-full flex justify-center mb-0">
        <h2 className="text-white text-xl font-bold text-center max-w-screen-lg">
          Apartamentos mais populares perto de você
        </h2>
      </div>

      <div className="w-full flex justify-center">
        <div className="relative max-w-[1200px] w-full">
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
              <Link to={`/imovel/${item.id}`} key={item.id}>
                <div className="w-[285px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-700 hover:scale-[1.01] transition">
                  <img
                    src={item.imagem}
                    alt={item.titulo}
                    className="w-full h-[180px] object-cover"
                  />

                  {/* Aqui aplicamos padding lateral com Tailwind */}
                  <div className="!p-4 !bg-gray-100 !border !border-gray-800 flex flex-col gap-4 !rounded-b-xl">
                    {/* Título + Endereço */}
                    <div className="flex flex-col gap-2 text-left">
                      <h3 className="text-base font-semibold text-gray-900 leading-snug break-words">
                        {item.titulo}
                      </h3>
                      <p className="text-sm text-gray-500 break-words">
                        {item.endereco}
                      </p>
                    </div>

                    {/* Ícones */}
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

                    {/* Preço e coração */}
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          Aluguel de {item.preco}
                        </p>
                        {item.infoExtra && (
                          <p className="text-xs text-gray-500">
                            {item.infoExtra}
                          </p>
                        )}
                      </div>
                      <button className="text-red-500 hover:text-red-600">
                        <Heart strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-between gap-2 mt-4">
                      <Button className="flex-1 !bg-red-500 text-white !text-sm !rounded hover:!bg-red-700 transition-colors duration-200">
                        Mensagem
                      </Button>
                      <Button className="flex-1 !bg-transparent !text-red-600 text-sm rounded hover:bg-red-700">
                        Telefone
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
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
    </section>
  );
};
