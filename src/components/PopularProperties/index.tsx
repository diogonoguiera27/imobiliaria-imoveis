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
import PropertyCardMobileWrapper from "../PropertyCardMobile";

type FavoriteIdentifier = {
  propertyId: number;
  propertyUuid?: string | null;
};

const PopularProperties = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);

  const visibleCount = 6;
  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarImoveis({
          categoria: "popular",
          page: apiPage,
          take: 10,
        });

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(response.data, user.cidade)
          : response.data;

        const semPrimeiro = ordenados.slice(1);
        setImoveis(semPrimeiro);
        setTotalPages(response.pagination.totalPages);
        setStartIndex(0);
        setMobileIndex(0);

        if (token) {
          const favoritos: FavoriteIdentifier[] = await getUserFavorites(token);
          const ids = favoritos
            .map((f) => f.propertyId)
            .filter((id): id is number => typeof id === "number");
          setFavoritedIds(ids);
        }
      } catch (err) {
        console.error("Erro ao carregar imóveis populares:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarImoveis();
  }, [token, user, apiPage]);

  const prevPage = () => {
    if (startIndex > 0) setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    else if (apiPage > 1) {
      setApiPage((prev) => prev - 1);
      setStartIndex(5);
    }
  };

  const nextPage = () => {
    const nextIndex = startIndex + visibleCount;
    if (nextIndex >= imoveis.length) {
      if (apiPage < totalPages) {
        setApiPage((prev) => prev + 1);
        setStartIndex(0);
      }
    } else setStartIndex(nextIndex);
  };

  const prevMobile = () => {
    if (mobileIndex > 0) setMobileIndex((prev) => prev - 1);
    else if (apiPage > 1) {
      setApiPage((prev) => prev - 1);
      setMobileIndex(9);
    }
  };

  const nextMobile = () => {
    if (mobileIndex < imoveis.length - 1) setMobileIndex((prev) => prev + 1);
    else if (apiPage < totalPages) {
      setApiPage((prev) => prev + 1);
      setMobileIndex(0);
    }
  };

  return (
    <section className="!w-full !pt-2 !mt-0">
      {/* ✅ Centralização padrão 80% igual ao Featured */}
      <div className="!w-full">
        <div className="!w-full !flex !justify-center !mt-6">
          <h2 className="!text-gray-900 !text-xl !font-bold !text-center !mb-4">
            Apartamentos mais populares perto de você
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center">
          <div className="!relative !w-full">
            <button
              onClick={prevPage}
              disabled={apiPage === 1 && startIndex === 0}
              className="!absolute !left-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 z-10"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            <div
              className="!flex !gap-4 !overflow-x-hidden !scroll-smooth !items-center hide-scrollbar"
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
              className="!absolute !right-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 z-10"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {imoveis.length > 0 && (
            <>
              <div className="!relative !flex !justify-center !items-center !w-full">
                <div className=" !mx-auto !flex !justify-center">
                  <PropertyCardMobileWrapper
                    item={imoveis[mobileIndex]}
                    isFavoritedInitially={favoritedIds.includes(
                      imoveis[mobileIndex].id
                    )}
                  />
                </div>
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
                  disabled={
                    apiPage === totalPages &&
                    mobileIndex === imoveis.length - 1
                  }
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
                </button>
              </div>

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

export default PopularProperties;
