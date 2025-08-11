import React, { useEffect, useRef, useState } from "react";
import { Imovel } from "@/types";

import MainCarouselPropertyCard from "../PropertyCard/MainCarouselPropertyCard";
import { buscarImoveis } from "@/service/propertyService";
import { useAuth } from "@/hooks/auth";
import { priorizarImoveisDaCidade } from "@/lib/utils";

const CarrosselDestaques: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const { user } = useAuth(); // ✅ pega cidade do usuário

  useEffect(() => {
    async function carregarImoveis() {
      const todos = await buscarImoveis();

      // ✅ Prioriza os imóveis da cidade do usuário
      const ordenados = user?.cidade
        ? priorizarImoveisDaCidade(todos, user.cidade)
        : todos;

      // ✅ Filtra categoria "destaque"
      const destaque = ordenados.filter((i) => i.categoria === "destaque");
      setImoveis(destaque);
    }

    carregarImoveis();
  }, [user]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 460;
  const cardGap = 16;
  const scrollStep = cardWidth + cardGap;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const visibleCards = 3;
    const totalCards = imoveis.length;
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
    }, 4000);

    return () => clearInterval(interval);
  }, [scrollStep, imoveis.length]);

  return (
    <section className="w-full px-4 pt-2 !mt-0">
      <div className="!w-full !max-w-[80%] !mx-auto">
        <div className="w-full flex justify-center mb-0">
          <h2 className="text-6xl font-extrabold text-black !text-center !max-w-screen-lg !text-neutral-120 !mb-4">
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
              {imoveis.map((imovel) => (
                <MainCarouselPropertyCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarrosselDestaques;
