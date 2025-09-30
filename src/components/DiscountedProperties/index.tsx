// src/components/ImoveisPromocao/index.tsx
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
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

const DiscountedProperties = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // paginação backend
  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // índice desktop
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

  // índice mobile
  const [mobileIndex, setMobileIndex] = useState(0);

  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  // carregar imóveis da API
  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);

        const response: PaginatedProperties = await buscarImoveis({
          categoria: "promocao",
          page: apiPage,
          take: 10,
        });

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(response.data, user.cidade)
          : response.data;

        // 👉 sempre substitui os imóveis da página atual
        setImoveis(ordenados);
        setTotalPages(response.pagination.totalPages);
        setStartIndex(0); // reset desktop ao trocar página
        setMobileIndex(0); // reset mobile ao trocar página

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
  }, [apiPage, token, user]);

  // 🔹 Navegação desktop
  const prevPage = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    } else if (apiPage > 1) {
      setApiPage((prev) => prev - 1);
      setStartIndex(5); // último bloco da página anterior
    }
  };

  const nextPage = () => {
    const nextIndex = startIndex + visibleCount;
    if (nextIndex >= imoveis.length) {
      if (apiPage < totalPages) {
        setApiPage((prev) => prev + 1);
        setStartIndex(0);
      }
    } else {
      setStartIndex(nextIndex);
    }
  };

  // 🔹 Navegação mobile
  const prevMobile = () => {
    if (mobileIndex > 0) {
      setMobileIndex((prev) => prev - 1);
    } else if (apiPage > 1) {
      setApiPage((prev) => prev - 1);
      setMobileIndex(9); // último item da página anterior
    }
  };

  const nextMobile = () => {
    if (mobileIndex < imoveis.length - 1) {
      setMobileIndex((prev) => prev + 1);
    } else if (apiPage < totalPages) {
      setApiPage((prev) => prev + 1);
      setMobileIndex(0); // primeiro item da próxima página
    }
  };

  return (
    <section className="!w-full !px-4 !pt-0 !mt-0">
      <div className="!w-full !max-w-[80%] !mx-auto">
        <div className="!w-full !flex !justify-center !mb-0 !mt-8">
          <h2 className="!text-gray-900 !text-xl !font-bold !text-center !max-w-screen-lg">
            Imóveis que baixaram de preço em até 32% próximos a você
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center !mt-4">
          <div className="!relative !max-w-[1412px] !w-full">
            <button
              onClick={prevPage}
              disabled={apiPage === 1 && startIndex === 0}
              className="!absolute !left-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

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
              disabled={apiPage === totalPages && startIndex + visibleCount >= imoveis.length}
              className="!absolute !right-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {imoveis.length > 0 && (
            <>
              <div className="!w-[90%]">
                <PropertyCard
                  item={imoveis[mobileIndex]}
                  isFavoritedInitially={favoritedIds.includes(imoveis[mobileIndex].id)}
                />
              </div>

              <div className="!flex !items-center !justify-center !gap-6 !mt-3">
                <button
                  onClick={prevMobile}
                  disabled={apiPage === 1 && mobileIndex === 0}
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronLeft className="!w-5 !h-5 !cursor-pointer" />
                </button>
                <button
                  onClick={nextMobile}
                  disabled={apiPage === totalPages && mobileIndex === imoveis.length - 1}
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
                </button>
              </div>

              {/* 🔹 Bolinhas (máx 10 por página) */}
              <div className="!flex !gap-2 !mt-3">
                {imoveis.map((_, i) => (
                  <span
                    key={i}
                    className={`!w-2 !h-2 !rounded-full ${
                      i === mobileIndex ? "!bg-red-500" : "!bg-gray-300"
                    }`}
                  />
                ))}
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

export default DiscountedProperties;
