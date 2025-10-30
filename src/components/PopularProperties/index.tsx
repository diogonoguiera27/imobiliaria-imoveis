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

  // ✅ Correção principal — sincronização entre troca de página e carregamento
  useEffect(() => {
    let ativo = true;

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

        const semPrimeiro = ordenados.length > 0 ? ordenados.slice(1) : [];

        if (!ativo) return;

        setImoveis(semPrimeiro);
        setTotalPages(response.pagination.totalPages);

        // 🔹 Reset controlado
        setStartIndex(0);
        setMobileIndex(0);

        // 🔹 Favoritos
        if (token) {
          try {
            const favoritos: FavoriteIdentifier[] = await getUserFavorites(token);
            const ids = favoritos
              .map((f) => f.propertyId)
              .filter((id): id is number => typeof id === "number");
            setFavoritedIds(ids);
          } catch (err) {
            console.warn("⚠️ Erro ao buscar favoritos:", err);
            setFavoritedIds([]);
          }
        }
      } catch (err) {
        console.error("❌ Erro ao carregar imóveis populares:", err);
        setImoveis([]);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarImoveis();
    return () => {
      ativo = false;
    };
  }, [token, user, apiPage]);

  // ======================
  // 🔹 Paginação Desktop
  // ======================
  const prevPage = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - visibleCount, 0));
    } else if (apiPage > 1) {
      setImoveis([]); // Evita render de imóveis antigos
      setLoading(true);
      setApiPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    const nextIndex = startIndex + visibleCount;
    if (nextIndex >= imoveis.length) {
      if (apiPage < totalPages) {
        setImoveis([]);
        setLoading(true);
        setApiPage((prev) => prev + 1);
      }
    } else {
      setStartIndex(nextIndex);
    }
  };

  // ======================
  // 🔹 Paginação Mobile
  // ======================
  const prevMobile = () => {
    if (mobileIndex > 0) {
      setMobileIndex((prev) => prev - 1);
    } else if (apiPage > 1) {
      setImoveis([]);
      setLoading(true);
      setApiPage((prev) => prev - 1);
    }
  };

  const nextMobile = () => {
    if (mobileIndex < imoveis.length - 1) {
      setMobileIndex((prev) => prev + 1);
    } else if (apiPage < totalPages) {
      setImoveis([]);
      setLoading(true);
      setApiPage((prev) => prev + 1);
    }
  };

  // ======================
  // 🔹 Renderização
  // ======================
  return (
    <section className="!w-full !pt-2 !mt-0">
      <div className="!w-full !max-w-[1920px] !mx-auto ">
        {/* 🔹 Título */}
        <div className="!w-full !flex !justify-center !mt-6">
          <h2 className="!text-gray-900 !text-xl !font-bold !text-center !mb-4">
            Apartamentos mais populares perto de você
          </h2>
        </div>

        {/* 💻 Desktop */}
        <div className="!hidden md:!flex !w-full !justify-center">
          <div className="!relative !w-full">
            {/* ⬅️ Botão esquerda */}
            <button
              onClick={prevPage}
              disabled={apiPage === 1 && startIndex === 0}
              className="!absolute !left-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 !z-10"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            {/* 🧱 Lista de cards */}
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

            {/* ➡️ Botão direita */}
            <button
              onClick={nextPage}
              disabled={
                apiPage === totalPages &&
                startIndex + visibleCount >= imoveis.length
              }
              className="!absolute !right-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 !z-10"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {imoveis.length > 0 ? (
            <>
              <div className="!relative !w-full">
                <PropertyCardMobileWrapper
                  item={imoveis[mobileIndex] ?? null}
                  isFavoritedInitially={
                    !!imoveis[mobileIndex] &&
                    favoritedIds.includes(imoveis[mobileIndex].id)
                  }
                />
              </div>

              {/* 🔘 Navegação mobile */}
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

              {/* 🔴 Indicadores */}
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
          ) : (
            // 🔹 Fallback seguro para evitar tela branca
            <div className="!h-[480px] !flex !items-center !justify-center">
              <span className="!text-gray-400 !text-sm">
                Carregando imóveis...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 🪟 Modais */}
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
