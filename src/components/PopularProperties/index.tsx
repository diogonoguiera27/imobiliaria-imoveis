// src/components/Home/PopularProperties.tsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { Dialog } from "../ui/dialog";
import { Imovel } from "@/types";

import { buscarImoveis, PaginatedProperties } from "@/service/propertyService";
import { getUserFavorites } from "@/service/favoriteService";
import { priorizarImoveisDaCidade } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useContactContext } from "@/hooks/contact/useContact";
import PropertyCard from "../CardProperties";

// ✅ mesmo formato retornado pela rota /favorites
type FavoriteIdentifier = {
  propertyId: number;
  propertyUuid?: string | null;
};

const PopularProperties = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 paginação backend
  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 índice de início do bloco visível
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5; // 👈 quantos cards mostrar por vez

  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  // 🔄 carregar imóveis da categoria "popular"
  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarImoveis({
          categoria: "popular",
          page: apiPage,
          take: 10, // backend retorna 10
        });

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(response.data, user.cidade)
          : response.data;

        setImoveis((prev) =>
          apiPage === 1 ? ordenados : [...prev, ...ordenados]
        );
        setTotalPages(response.pagination.totalPages);

        // carregar favoritos
        if (token) {
          try {
            const favoritos: FavoriteIdentifier[] = await getUserFavorites(token);
            const ids = favoritos
              .map((f) => f.propertyId)
              .filter((id): id is number => typeof id === "number");
            setFavoritedIds(ids);
          } catch (err) {
            console.error("Erro ao buscar favoritos:", err);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    carregarImoveis();
  }, [token, user, apiPage]);

  // 👉 navegação
  const prevPage = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const nextPage = () => {
    const nextIndex = startIndex + visibleCount;

    if (nextIndex >= imoveis.length) {
      if (apiPage < totalPages) {
        setApiPage((prev) => prev + 1);
        setStartIndex(nextIndex);
      }
    } else {
      setStartIndex(nextIndex);
    }
  };

  return (
    <section className="!w-full !px-4 !pt-0">
      <div className="!w-full !max-w-[80%] !mx-auto">
        <div className="!w-full !flex !justify-center !mt-8">
          <h2 className="!text-gray-900 !text-xl !font-bold !text-center !max-w-screen-lg">
            Apartamentos mais populares perto de você
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center !mt-4">
          <div className="!relative !max-w-[1412px] !w-full">
            {/* seta esquerda */}
            <button
              onClick={prevPage}
              disabled={startIndex === 0 && apiPage === 1}
              className="!absolute !left-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            {/* cards */}
            <div
              className="!flex !gap-4 !overflow-x-hidden !items-center hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading && imoveis.length === 0
                ? Array.from({ length: visibleCount }).map((_, i) => (
                    <PropertyCard key={`skeleton-${i}`} loading />
                  ))
                : imoveis
                    .slice(startIndex, startIndex + visibleCount)
                    .map((item) => (
                      <PropertyCard
                        key={item.id}
                        item={item}
                        isFavoritedInitially={favoritedIds.includes(item.id)}
                      />
                    ))}
            </div>

            
            <button
              onClick={nextPage}
              disabled={
                apiPage === totalPages &&
                startIndex + visibleCount >= imoveis.length
              }
              className="!absolute !right-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {imoveis.length > 0 && (
            <>
              <div className="!w-[90%] !flex !flex-col !gap-4">
                {imoveis.map((item) => (
                  <PropertyCard
                    key={item.id}
                    item={item}
                    isFavoritedInitially={favoritedIds.includes(item.id)}
                  />
                ))}
              </div>

              <div className="!flex !items-center !justify-center !gap-6 !mt-3">
                <button
                  onClick={prevPage}
                  disabled={startIndex === 0 && apiPage === 1}
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronLeft className="!w-5 !h-5 !cursor-pointer" />
                </button>

                <span className="text-gray-700 text-sm">
                  Página {apiPage} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={
                    apiPage === totalPages &&
                    startIndex + visibleCount >= imoveis.length
                  }
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      
      {showContactModal && (
        <Dialog open onOpenChange={(o) => !o && closeModals()}>
          <MessageFormModal />
        </Dialog>
      )}
      {showPhoneModal && (
        <Dialog open onOpenChange={(o) => !o && closeModals()}>
          <PhoneContactModal />
        </Dialog>
      )}
    </section>
  );
};

export default PopularProperties;
