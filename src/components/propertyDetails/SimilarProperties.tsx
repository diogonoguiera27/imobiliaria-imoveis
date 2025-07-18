import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { imoveis } from "@/data/imovel";
import { ImovelComCategoria } from "@/data/imovel";
import { CardProperties } from "../PropertyCard";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";

type SimilarPropertiesProps = {
  imovelAtual: ImovelComCategoria;
};

function SimilarProperties({ imovelAtual }: SimilarPropertiesProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const similares = imoveis.filter(
    (imovel) =>
      imovel.id !== imovelAtual.id &&
      imovel.categoria === imovelAtual.categoria &&
      imovel.cidade.toLowerCase() === imovelAtual.cidade.toLowerCase() &&
      imovel.tipo === imovelAtual.tipo
  );

  const cardsPorPagina = 3;
  const totalPages = Math.ceil(similares.length / cardsPorPagina);

  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollX = page * container.clientWidth;
    container.scrollTo({ left: scrollX, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (similares.length === 0) return null;

  return (
    <section className="w-full flex justify-center !mt-12 !mb-12">
      <div className="w-full !max-w-[1280px] !mx-auto !px-4 relative">
        <div className="flex !justify-center">
          <h2 className="!text-2xl !font-semibold !mb-4 text-center">
            Imóveis Similares
          </h2>
        </div>

        {currentPage > 0 && (
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            className="absolute left-0 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft />
          </button>
        )}

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth items-center w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {similares.map((item) => (
            <CardProperties
              key={item.id}
              item={item}
              onOpenContactModal={() => setShowContactModal(true)}
              onOpenPhoneModal={() => setShowPhoneModal(true)}
            />
          ))}
        </div>

        {currentPage < totalPages - 1 && (
          <button
            onClick={() => scrollToPage(currentPage + 1)}
            className="absolute right-0 top-[50%] -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight />
          </button>
        )}

        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <MessageFormModal />
        </Dialog>

        <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
          <PhoneContactModal />
        </Dialog>
      </div>
    </section>
  );
}

export default SimilarProperties;
