import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Imovel } from "@/types";
import { buscarImoveis } from "@/service/propertyService";
import { priorizarImoveisDaCidade } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import MainCarouselPropertyCard from "../MainCarouselPropertyCard";

const FeaturedCarousel: React.FC = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const response = await buscarImoveis({
          categoria: "destaque",
          take: 12,
        });

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(response.data, user.cidade)
          : response.data;

        setImoveis(ordenados);
      } finally {
        setLoading(false);
      }
    }
    carregarImoveis();
  }, [user]);

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

  const scrollDesktop = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const distance = 300;
    containerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imoveis.length - 1));

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev < imoveis.length - 1 ? prev + 1 : 0));

  return (
    <section className="!w-full !pt-2 !mt-0">
      {/* ✅ Mantém o alinhamento 80% herdado da Home */}
      <div className="!w-full">
        {/* 🔹 Título centralizado */}
        <div className="!w-full !flex !justify-center !mt-6">
          <h2 className="!text-xl !font-bold !text-gray-900 !text-center !mb-4">
            Imóveis em Destaque
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center">
          <div className="!relative !w-full">
            {/* ⬅️ Botão esquerda */}
            <button
              onClick={() => scrollDesktop("left")}
              className="!absolute !left-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 transition"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            {/* 🧱 Lista de cards */}
            <div
              ref={containerRef}
              className="!flex !gap-4 !overflow-x-hidden !scroll-smooth !items-center !w-full hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <MainCarouselPropertyCard key={i} loading />
                  ))
                : imoveis.map((imovel) => (
                    <MainCarouselPropertyCard key={imovel.id} imovel={imovel} />
                  ))}
            </div>

            {/* ➡️ Botão direita */}
            <button
              onClick={() => scrollDesktop("right")}
              className="!absolute !right-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 transition"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {loading ? (
            <div className="!max-w-[380px] !w-full !mx-auto !flex !justify-center">
              <MainCarouselPropertyCard loading />
            </div>
          ) : (
            imoveis.length > 0 && (
              <>
                <div
                  className="!relative !flex !justify-center !items-center !w-full"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="!max-w-[380px] !w-full !mx-auto !flex !justify-center">
                    <MainCarouselPropertyCard imovel={imoveis[currentIndex]} />
                  </div>
                </div>

                <div className="!flex !items-center !justify-center !gap-6 !mt-3 !mb-6">
                  <button
                    onClick={prevSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 transition"
                  >
                    <ChevronLeft className="!w-5 !h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 transition"
                  >
                    <ChevronRight className="!w-5 !h-5" />
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

export default FeaturedCarousel;
