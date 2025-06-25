import React, { useEffect, useRef } from "react";
import { FaBed, FaCar, FaRulerCombined } from "react-icons/fa";

import { Button } from "../ui/button";

const imoveisDestaque = [
  {
    id: 1,
    imagem:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    tipo: "Apartamento",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    endereco: "Rua Constante Ramos",
    metragem: 118,
    quartos: 3,
    vagas: 1,
    preco: "R$ 900.000",
  },
  {
    id: 2,
    imagem:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    tipo: "Apartamento",
    bairro: "Ipanema",
    cidade: "Rio de Janeiro",
    endereco: "Rua Almirante Saddock de Sá",
    metragem: 160,
    quartos: 3,
    vagas: 2,
    preco: "R$ 3.100.000",
  },
  {
    id: 3,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    tipo: "Apartamento",
    bairro: "Botafogo",
    cidade: "Rio de Janeiro",
    endereco: "Rua Voluntários da Pátria",
    metragem: 95,
    quartos: 2,
    vagas: 1,
    preco: "R$ 750.000",
  },
  {
    id: 4,
    imagem:
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
    tipo: "Apartamento",
    bairro: "Laranjeiras",
    cidade: "Rio de Janeiro",
    endereco: "Rua das Laranjeiras",
    metragem: 82,
    quartos: 2,
    vagas: 1,
    preco: "R$ 690.000",
  },
  {
    id: 5,
    imagem:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    tipo: "Casa",
    bairro: "Barra da Tijuca",
    cidade: "Rio de Janeiro",
    endereco: "Av. das Américas",
    metragem: 300,
    quartos: 4,
    vagas: 3,
    preco: "R$ 2.700.000",
  },
  {
    id: 6,
    imagem:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    tipo: "Casa",
    bairro: "Barra da Tijuca",
    cidade: "Rio de Janeiro",
    endereco: "Av. das Américas",
    metragem: 300,
    quartos: 4,
    vagas: 3,
    preco: "R$ 2.700.000",
  },
];

export const CarrosselDestaques: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 460; // largura real do card
  const cardGap = 16; // gap entre os cards (gap-4)
  const scrollStep = cardWidth + cardGap; // scroll de 1 card por vez

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const visibleCards = 3;
    const totalCards = imoveisDestaque.length;
    const maxScrollIndex = totalCards - visibleCards;

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex >= maxScrollIndex) {
        currentIndex = 0;
      } else {
        currentIndex += 1;
      }

      container.scrollTo({
        left: currentIndex * scrollStep,
        behavior: "smooth",
      });
    }, 4000); // rola a cada 4s

    return () => clearInterval(interval);
  }, [scrollStep]);

  return (
    <section className="w-full px-4 pt-2   !mt-0">
  <div className="w-full flex justify-center mb-0">
    <h2 className="text-6xl font-extrabold text-black text-center max-w-screen-lg text-neutral-120">
      Imóveis em Destaque
    </h2>
  </div>

  <div className="w-full flex justify-center">
    <div className="relative max-w-[1412px] w-full">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden scroll-smooth items-center w-full hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {imoveisDestaque.map((imovel) => (
          <div
            key={imovel.id}
            className="w-[460px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-700 hover:scale-[1.01] transition"
          >
            <img
              src={imovel.imagem}
              alt={imovel.bairro}
              className="w-full !h-[200px] object-cover"
            />
            <div className="h-[190px] !p-4 !bg-gray-100 !border !border-gray-800 flex flex-col gap-4 !rounded-b-xl">
              <div className="flex flex-col gap-2 text-left">
                <p className="text-xs text-black font-semibold uppercase">
                  {imovel.tipo}
                </p>
                <h3 className="text-base font-bold text-gray-800 leading-snug">
                  {imovel.bairro}, {imovel.cidade}
                </h3>
                <p className="text-sm text-gray-500">{imovel.endereco}</p>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-700 text-sm mt-1">
                <div className="flex items-center gap-1">
                  <FaRulerCombined className="text-[15px]" />
                  {imovel.metragem} m²
                </div>
                <div className="flex items-center gap-1">
                  <FaBed className="text-[15px]" />
                  {imovel.quartos}
                </div>
                <div className="flex items-center gap-1">
                  <FaCar className="text-[15px]" />
                  {imovel.vagas}
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <p className="text-base font-bold text-green-600 mt-1">
                    {imovel.preco}
                  </p>
                </div>
              </div>
              <div className="flex flex-col !gap-1 !px-4 !pb-3">
                <Button className="text-sm font-semibold text-white bg-red-600 px-4 py-1 rounded hover:bg-red-700">
                  Ver mais
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
  );
};
