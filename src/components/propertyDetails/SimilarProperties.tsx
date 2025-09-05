// src/components/PropertyDetails/SimilarProperties.tsx

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CardProperties } from "../PropertyCard";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";

import { Imovel } from "@/types";
import { useContactContext } from "@/hooks/contact/ContactContext";
import ContactPhoneModal from "../PhoneContactModal";

type SimilarPropertiesProps = {
  imoveis: Imovel[];
};

function SimilarProperties({ imoveis }: SimilarPropertiesProps) {
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();

  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const cardsPorPagina = 3;
  const totalPages = Math.ceil(imoveis.length / cardsPorPagina);

  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollX = page * container.clientWidth;
    container.scrollTo({ left: scrollX, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (imoveis.length === 0) return null;

  return (
    <section className="w-full flex justify-center !mt-12 !mb-12">
      <div className="w-full !max-w-[1280px] !mx-auto !px-4 relative">
        {/* Título */}
        <div className="flex !justify-center">
          <h2 className="!text-2xl !font-semibold !mb-4 text-center">
            Imóveis Similares
          </h2>
        </div>

        {/* Botão voltar */}
        {currentPage > 0 && (
          <button
            onClick={() => scrollToPage(currentPage - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Cards */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth items-center w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {imoveis.map((item) => (
            <CardProperties key={item.id} item={item} />
          ))}
        </div>

        {/* Botão avançar */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => scrollToPage(currentPage + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight />
          </button>
        )}

        {/* ✅ Modais controlados pelo contexto */}
        <Dialog open={showContactModal} onOpenChange={(open) => !open && closeModals()}>
          <MessageFormModal />
        </Dialog>

        <Dialog open={showPhoneModal} onOpenChange={(open) => !open && closeModals()}>
          <ContactPhoneModal />
        </Dialog>
      </div>
    </section>
  );
}

export default SimilarProperties;
