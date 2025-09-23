// src/components/ImoveisPromocao/index.tsx
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { Imovel } from "@/types";
import { CardProperties } from "@/components/PropertyCard";
import { buscarImoveis } from "@/service/propertyService";
import { getUserFavorites } from "@/service/favoriteService";
import { priorizarImoveisDaCidade } from "@/lib/utils";
import { useAuth } from "@/hooks/auth";
import { useContactContext } from "@/hooks/contact/useContact";

// ✅ mesmo formato retornado pela rota /favorites
type FavoriteIdentifier = {
  propertyId: number;
  propertyUuid?: string | null;
};

const ImoveisPromocao = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const { token, user } = useAuth();
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const todos = await buscarImoveis();

        const ordenados = user?.cidade
          ? priorizarImoveisDaCidade(todos, user.cidade)
          : todos;

        const promocao = ordenados.filter((i) => i.categoria === "promocao");
        setImoveis(promocao);

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
  }, [token, user]);

  // Setas no mobile
  const prevSlide = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : imoveis.length - 1));
  };

  const nextSlide = () => {
    setCurrentPage((prev) => (prev < imoveis.length - 1 ? prev + 1 : 0));
  };

  // Scroll horizontal no desktop
  const scrollDesktop = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const distance = 300; // ajuste conforme a largura dos cards
    containerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
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
            {/* Botão PREV */}
            <button
              onClick={() => scrollDesktop("left")}
              className="!absolute !left-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
            >
              <ChevronLeft className="!w-5 !h-5" />
            </button>

            <div
              ref={containerRef}
              className="!flex !gap-4 !overflow-x-hidden !scroll-smooth !items-center hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CardProperties key={i} loading />
                  ))
                : imoveis.map((item) => (
                    <CardProperties
                      key={item.id}
                      item={item}
                      isFavoritedInitially={favoritedIds.includes(item.id)}
                    />
                  ))}
            </div>

            {/* Botão NEXT */}
            <button
              onClick={() => scrollDesktop("right")}
              className="!absolute !right-[-20px] !top-1/2 -translate-y-1/2
                         !bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
            >
              <ChevronRight className="!w-5 !h-5" />
            </button>
          </div>
        </div>

        {/* 📱 Mobile - 1 card + setas */}
        <div className="md:!hidden !w-full !flex !flex-col !items-center !mt-6">
          {loading ? (
            <div className="!w-[90%] !flex !justify-center">
              <CardProperties loading />
            </div>
          ) : (
            imoveis.length > 0 && (
              <>
                <div className="!w-[90%] !flex !justify-center">
                  <CardProperties
                    item={imoveis[currentPage]}
                    isFavoritedInitially={favoritedIds.includes(
                      imoveis[currentPage].id
                    )}
                  />
                </div>

                <div className="!flex !items-center !justify-center !gap-6 !mt-3">
                  <button
                    onClick={prevSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
                  >
                    <ChevronLeft className="!w-5 !h-5 !cursor-pointer" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
                  >
                    <ChevronRight className="!w-5 !h-5 !cursor-pointer" />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* Modais de contato */}
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

export default ImoveisPromocao;
