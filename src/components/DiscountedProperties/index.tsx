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

const DiscountedProperties = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<(number | string)[]>([]);
  const [loading, setLoading] = useState(true);

  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const visibleCount = 5;

  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

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

        const semPrimeiro = ordenados.slice(1);
        setImoveis(semPrimeiro);
        setTotalPages(response.pagination.totalPages);
        setStartIndex(0);
        setMobileIndex(0);

        if (token) {
          try {
            const favoritos = await getUserFavorites(token);
            const idsOuUuids = favoritos
              .map((f) => f.propertyUuid || f.propertyId)
              .filter(Boolean);
            setFavoritedIds([...new Set(idsOuUuids)]);
          } catch (err) {
            console.error("Erro ao buscar favoritos:", err);
            setFavoritedIds([]);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    carregarImoveis();
  }, [apiPage, token, user]);

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
    <section className="!w-full !px-4 !pt-2 !mt-0">
      {/* 🔹 Container central padronizado */}
      <div className="!w-full !max-w-[80%] !mx-auto md:!max-w-[1412px]">
        {/* 🔹 Título */}
        <div className="!w-full !flex !justify-center !mt-6">
          <h2 className="!text-gray-900 !text-xl !font-bold !text-center">
            Imóveis que baixaram de preço em até 32% próximos a você
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center !mt-4">
          <div className="!relative !max-w-[1412px] !w-full">
            {/* ⬅️ seta esquerda */}
            <button
              onClick={prevPage}
              disabled={apiPage === 1 && startIndex === 0}
              className="!absolute !left-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 z-10"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            {/* lista de cards */}
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
                    .map((item) => {
                      const isFav =
                        favoritedIds.includes(item.uuid ?? "") ||
                        favoritedIds.includes(item.id ?? 0);

                      return (
                        <PropertyCard
                          key={item.uuid ?? item.id}
                          item={item}
                          isFavoritedInitially={isFav}
                        />
                      );
                    })}
            </div>

            {/* ➡️ seta direita */}
            <button
              onClick={nextPage}
              disabled={
                apiPage === totalPages &&
                startIndex + visibleCount >= imoveis.length
              }
              className="!absolute !right-[-20px] !top-1/2 -translate-y-1/2
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
              <div className="!max-w-[380px] !w-full !mx-auto !flex !justify-center">
                <PropertyCard
                  item={imoveis[mobileIndex]}
                  isFavoritedInitially={
                    favoritedIds.includes(imoveis[mobileIndex].uuid ?? "") ||
                    favoritedIds.includes(imoveis[mobileIndex].id ?? 0)
                  }
                />
              </div>

              {/* setas */}
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
                    apiPage === totalPages && mobileIndex === imoveis.length - 1
                  }
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
                </button>
              </div>

              {/* Indicadores */}
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

      {/* 🔹 Modais globais */}
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
