import React, { useEffect, useRef } from "react";
import { Imovel } from "@/types";
import { imoveis as todosImoveis } from "@/data/imovel";
import MainCarouselPropertyCard from "../PropertyCard/MainCarouselPropertyCard";



const CarrosselDestaques: React.FC = () => {
  const imoveisDestaque: Imovel[] = todosImoveis.filter(imovel => imovel.categoria === "popular");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 460;
  const cardGap = 16;
  const scrollStep = cardWidth + cardGap;

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
  }, [scrollStep,imoveisDestaque.length]);

  return (
    <section className="w-full px-4 pt-2   !mt-0">
      <div className="!w-full !max-w-[80%] !mx-auto">
        <div className="w-full flex justify-center mb-0">
          <h2 className="text-6xl font-extrabold text-black !text-center !max-w-screen-lg !text-neutral-120 ">
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
                <MainCarouselPropertyCard imovel={imovel}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarrosselDestaques;
