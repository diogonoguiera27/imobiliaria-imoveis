// src/components/PropertyDetails/SimilarProperties.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CardProperties } from "../PropertyCard";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import ContactPhoneModal from "../PhoneContactModal";
import { useContactContext } from "@/hooks/contact/useContact";
import type { Imovel } from "@/types";

/* Hook para detectar largura da tela */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

type SimilarPropertiesProps = {
  imoveis: Imovel[];
};

export default function SimilarProperties({ imoveis }: SimilarPropertiesProps) {
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();
  const isMobile = useIsMobile();

  /* ---- Carrossel Mobile ---- */
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : imoveis.length - 1));
  const next = () => setIndex((i) => (i < imoveis.length - 1 ? i + 1 : 0));

  if (imoveis.length === 0) return null;

  return (
    <section className="w-full flex justify-center !mt-12 !mb-12">
      <div className="w-full !max-w-[1280px] !mx-auto !px-4 relative">
        <div className="flex !justify-center">
          <h2 className="!text-2xl !font-semibold !mb-6 text-center">
            Imóveis Similares
          </h2>
        </div>

        {isMobile ? (
          /* 📱 Mobile: carrossel estilo MyProperties */
          <div className="!w-full !flex !flex-col !items-center">
            <CardProperties key={imoveis[index].id} item={imoveis[index]} />

            {/* setas */}
            <div className="!flex !items-center !justify-center !gap-6 !mt-3">
              <button
                onClick={prev}
                className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
              >
                <ChevronLeft className="!w-5 !h-5" />
              </button>
              <button
                onClick={next}
                className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
              >
                <ChevronRight className="!w-5 !h-5" />
              </button>
            </div>

            {/* bolinhas */}
            <div className="!flex !gap-2 !mt-3">
              {imoveis.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`!w-2 !h-2 !rounded-full !cursor-pointer ${
                    i === index ? "!bg-red-500" : "!bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* 💻 Desktop: mantém carrossel horizontal com setas laterais */
          <div className="relative">
            {/* seta esquerda */}
            {index > 0 && (
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronLeft />
              </button>
            )}

            <div
              className="flex gap-4 overflow-x-auto scroll-smooth items-center w-full hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {imoveis.map((item) => (
                <CardProperties key={item.id} item={item} />
              ))}
            </div>

            {/* seta direita */}
            {index < imoveis.length - 1 && (
              <button
                onClick={() =>
                  setIndex((i) => Math.min(imoveis.length - 1, i + 1))
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        )}

        {/* Modais de contato */}
        <Dialog open={showContactModal} onOpenChange={(o) => !o && closeModals()}>
          <MessageFormModal />
        </Dialog>
        <Dialog open={showPhoneModal} onOpenChange={(o) => !o && closeModals()}>
          <ContactPhoneModal />
        </Dialog>
      </div>
    </section>
  );
}
