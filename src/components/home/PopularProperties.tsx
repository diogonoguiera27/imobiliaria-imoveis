import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { Dialog } from "../ui/dialog";
import { Imovel } from "@/types";
import { CardProperties } from "@/components/PropertyCard";
import { buscarImoveis } from "@/service/propertyService";

import { useAuth } from "@/hooks/auth";
import { getUserFavorites } from "@/service/favoriteService";
import { priorizarImoveisDaCidade } from "@/lib/utils"; // ✅ função de ordenação por cidade

const ImoveisPopulares = () => {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const { token, user } = useAuth(); // ✅ pega cidade

  useEffect(() => {
    async function carregarImoveis() {
      const todos = await buscarImoveis();

      // ✅ Prioriza os da cidade do usuário (se houver)
      const ordenados = user?.cidade
        ? priorizarImoveisDaCidade(todos, user.cidade)
        : todos;

      // ✅ Filtra por categoria "popular"
      const populares = ordenados.filter(
        (i) => i.categoria === "popular" && typeof i.id === "number"
      );

      setImoveis(populares);

      if (token) {
        try {
          const favoritos = await getUserFavorites(token);
          setFavoritedIds(favoritos); // array de propertyId
        } catch (err) {
          console.error("Erro ao buscar favoritos:", err);
        }
      }
    }

    carregarImoveis();
  }, [token, user]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const cardWidth = 285 + 16;
      const visibleCards = Math.floor(container.offsetWidth / cardWidth);
      setCardsPerPage(visibleCards);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(imoveis.length / cardsPerPage);

  const scrollToPage = (page: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = 285 + 16;
    const scrollLeft = page * cardWidth * cardsPerPage;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setCurrentPage(page);
  };

  return (
    <section className="w-full px-4 pt-0">
      <div className="w-full !max-w-[80%] !mx-auto">
        <div className="w-full flex justify-center mb-0 !mt-8">
          <h2 className="text-black text-xl font-bold text-center max-w-screen-lg">
            Apartamentos mais populares perto de você
          </h2>
        </div>

        <div className="w-full flex justify-center !mt-4">
          <div className="relative max-w-[1412px] w-full">
            {currentPage > 0 && (
              <button
                onClick={() => scrollToPage(currentPage - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronLeft />
              </button>
            )}

            <div
              ref={containerRef}
              className="flex gap-4 overflow-x-hidden scroll-smooth items-center w-full hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {imoveis.map((item) => (
                <CardProperties
                  key={item.id}
                  item={item}
                  isFavoritedInitially={favoritedIds.includes(item.id)}
                  onOpenContactModal={() => setShowContactModal(true)}
                  onOpenPhoneModal={() => setShowPhoneModal(true)}
                />
              ))}
            </div>

            {currentPage < totalPages - 1 && (
              <button
                onClick={() => scrollToPage(currentPage + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <MessageFormModal />
      </Dialog>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <PhoneContactModal />
      </Dialog>
    </section>
  );
};

export default ImoveisPopulares;
