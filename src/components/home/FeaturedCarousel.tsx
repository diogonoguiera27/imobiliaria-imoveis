// src/components/CarrosselDestaques/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Imovel } from "@/types";
import MainCarouselPropertyCard from "../PropertyCard/MainCarouselPropertyCard";
import { buscarImoveis } from "@/service/propertyService";
import { priorizarImoveisDaCidade } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

const CarrosselDestaques: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0); // 📱 mobile
  const containerRef = useRef<HTMLDivElement>(null);

  // controle de swipe
  const touchStartX = useRef<number | null>(null);

  // 🔄 Carregar imóveis
  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const todos = await buscarImoveis();

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(todos, user.cidade)
          : todos;

        const destaque = ordenados.filter((i) => i.categoria === "destaque");
        setImoveis(destaque);
      } finally {
        setLoading(false);
      }
    }

    carregarImoveis();
  }, [user]);

  // 📱 Auto play no mobile
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    if (imoveis.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === imoveis.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [imoveis.length]);

  // 💻 Auto scroll desktop
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 460;
    const cardGap = 16;
    const scrollStep = cardWidth + cardGap;

    const visibleCards = 3;
    const totalCards = imoveis.length;
    const maxScrollIndex = totalCards - visibleCards;

    let index = 0;

    const interval = setInterval(() => {
      if (index >= maxScrollIndex) {
        index = 0;
      } else {
        index += 1;
      }

      container.scrollTo({
        left: index * scrollStep,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [imoveis.length]);

  // 👉 Prefetch da próxima imagem
  useEffect(() => {
    if (imoveis.length === 0) return;
    const nextIndex = (currentIndex + 1) % imoveis.length;
    const next = imoveis[nextIndex];
    if (next?.imagem) {
      const img = new Image();
      img.src = `${API_URL}${next.imagem}`;
    }
  }, [currentIndex, imoveis]);

  // Funções de swipe (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (deltaX < -50 && currentIndex < imoveis.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    touchStartX.current = null;
  };

  // Setas manuais mobile
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imoveis.length - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < imoveis.length - 1 ? prev + 1 : 0));
  };

  // Scroll manual desktop
  const scrollDesktop = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const distance = 300; // ajuste conforme a largura dos cards
    containerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="!w-full !px-4 !pt-2 !mt-0">
      <div className="!w-full !max-w-[80%] !mx-auto">
        <div className="!w-full !flex !justify-center !mb-0">
          <h2 className="!text-xl !font-bold !text-gray-900 !text-center !max-w-screen-lg !mb-4">
            Imóveis em Destaque
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center">
          <div className="!relative !max-w-[1412px] !w-full">
            {/* Botão PREV */}
            <button
              onClick={() => scrollDesktop("left")}
              className="!absolute !left-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
            >
              <ChevronLeft className="!w-5 !h-5 !cursor-pointer"  />
            </button>

            <div
              ref={containerRef}
              className="!flex !gap-4 !overflow-x-hidden !scroll-smooth !items-center !w-full hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <MainCarouselPropertyCard key={i} loading />
                  ))
                : imoveis.map((imovel) => (
                    <MainCarouselPropertyCard key={imovel.id} imovel={imovel} />
                  ))}
            </div>

            {/* Botão NEXT */}
            <button
              onClick={() => scrollDesktop("right")}
              className="!absolute !right-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
            >
              <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center">
          {loading ? (
            <div className="!w-[95%] !flex !justify-center">
              <MainCarouselPropertyCard loading />
            </div>
          ) : (
            imoveis.length > 0 && (
              <>
                <div
                  className="!w-[95%] !flex !justify-center"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <MainCarouselPropertyCard imovel={imoveis[currentIndex]} />
                </div>

                <div className="!flex !items-center !justify-center !gap-4 !mt-3">
                  <button
                    onClick={prevSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 !text-sm hover:!bg-gray-200"
                  >
                    ◀
                  </button>

                  <div className="!flex !gap-2">
                    {imoveis.map((_, i) => (
                      <span
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`!w-2 !h-2 !rounded-full !cursor-pointer !transition-all ${
                          i === currentIndex
                            ? "!bg-red-500 !w-4"
                            : "!bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 !text-sm hover:!bg-gray-200"
                  >
                    ▶
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CarrosselDestaques;
