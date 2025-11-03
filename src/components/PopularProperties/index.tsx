import { useEffect, useRef, useState } from "react";
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
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [apiPage, setApiPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileIndex, setMobileIndex] = useState(0);

  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  // ✅ ref do container para scroll real
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ largura e gap (precisa bater com Tailwind)
  const cardWidth = 340;
  const gap = 16;
  const visibleCount = 6;

  // ======================
  // 🔹 Carregar imóveis populares
  // ======================
  useEffect(() => {
    let ativo = true;

    async function carregarImoveis() {
      try {
        if (apiPage === 1) setLoading(true);
        else setIsFetchingMore(true);

        const response: PaginatedProperties = await buscarImoveis({
          categoria: "popular",
          page: apiPage,
          take: 10,
        });

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(response.data, user.cidade)
          : response.data;

        const novos = ordenados.length > 0 ? ordenados.slice(1) : [];

        if (!ativo) return;

        setImoveis((prev) =>
          apiPage === 1 ? novos : [...prev, ...novos] // concatenação incremental
        );
        setTotalPages(response.pagination.totalPages);

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
        if (apiPage === 1) setImoveis([]);
      } finally {
        if (ativo) {
          setLoading(false);
          setIsFetchingMore(false);
        }
      }
    }

    carregarImoveis();
    return () => {
      ativo = false;
    };
  }, [token, user, apiPage]);

  // ======================
  // 🔹 Scroll infinito automático
  // ======================
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth * 0.8; // 80% do fim

      if (nearEnd && !isFetchingMore && apiPage < totalPages) {
        setApiPage((prev) => prev + 1);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [apiPage, totalPages, isFetchingMore]);

  // ======================
  // 🔹 Scroll por setas (rolagem suave real)
  // ======================
  const scrollAmount = (cardWidth + gap) * 3; // rola 3 cards por clique

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ======================
  // 🔹 Paginação Mobile
  // ======================
  const prevMobile = () => {
    if (mobileIndex > 0) setMobileIndex((prev) => prev - 1);
  };

  const nextMobile = () => {
    if (mobileIndex < imoveis.length - 1) setMobileIndex((prev) => prev + 1);
  };

  // ======================
  // 🔹 Renderização
  // ======================
  return (
    <section className="!w-full !pt-2 !mt-0">
      <div className="!w-full  !mx-auto ">
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
              onClick={scrollLeft}
              className="!absolute !left-[-24px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50 !z-10"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            {/* 🧱 Lista de cards com rolagem real e paginação incremental */}
            <div
              ref={scrollRef}
              className="!flex !gap-4 !overflow-x-scroll !scroll-smooth !items-center !justify-start hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {loading && imoveis.length === 0
                ? Array.from({ length: visibleCount }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="!flex-shrink-0 !w-[340px]">
                      <PropertyCard loading />
                    </div>
                  ))
                : imoveis.map((item) => (
                    <div key={item.id} className="!flex-shrink-0 !w-[340px]">
                      <PropertyCard
                        item={item}
                        isFavoritedInitially={favoritedIds.includes(item.id)}
                      />
                    </div>
                  ))}

              {/* 🔁 Loader no fim do scroll */}
              {isFetchingMore && (
                <div className="!flex-shrink-0 !w-[340px] !flex !items-center !justify-center">
                  <span className="!text-gray-400 !text-sm">Carregando mais...</span>
                </div>
              )}
            </div>

            {/* ➡️ Botão direita */}
            <button
              onClick={scrollRight}
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
                  disabled={mobileIndex === 0}
                  className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200 disabled:!opacity-50"
                >
                  <ChevronLeft className="!w-5 !h-5 !cursor-pointer" />
                </button>
                <button
                  onClick={nextMobile}
                  disabled={mobileIndex === imoveis.length - 1}
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
