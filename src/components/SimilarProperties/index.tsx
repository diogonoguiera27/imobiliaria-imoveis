import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog } from "../ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import ContactPhoneModal from "../PhoneContactModal";
import { useContactContext } from "@/hooks/contact/useContact";
import type { Imovel } from "@/types";
import PropertyCard from "../CardProperties";

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
  // ✅ Hooks SEMPRE no topo
  const { showContactModal, showPhoneModal, closeModals } = useContactContext();
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Atualiza número de cards visíveis conforme o tamanho da tela
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // ✅ Agora o condicional pode vir depois
  if (imoveis.length === 0) return null;

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : imoveis.length - 1));
  const next = () => setIndex((i) => (i < imoveis.length - 1 ? i + 1 : 0));

  // Mostrar setas apenas se houver mais imóveis que o limite visível
  const showArrows = imoveis.length > visibleCards;

  return (
    <section className="!w-full !flex !flex-col !justify-center !items-center !mt-12 !mb-12">
      <h2 className="!text-2xl !font-semibold !mb-8 text-center">
        Imóveis Similares
      </h2>

      {/* ===== MOBILE ===== */}
      {isMobile ? (
        <div className="!w-full !flex !flex-col !items-center">
          <PropertyCard key={imoveis[index].id} item={imoveis[index]} />

          {/* setas — só se houver mais de 1 imóvel */}
          {imoveis.length > 1 && (
            <div className="!flex !items-center !justify-center !gap-6 !mt-4">
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
          )}

          {/* bolinhas */}
          {imoveis.length > 1 && (
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
          )}
        </div>
      ) : (
        /* ===== DESKTOP ===== */
        <div className="!relative !w-full">
          {/* seta esquerda */}
          {showArrows && index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="!absolute !left-0 !top-1/2 !-translate-y-1/2 z-10 bg-white !p-2 !rounded-full !shadow-md !hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
          )}

          {/* cards */}
          <div
            className="
              !flex 
              !gap-4 
              !overflow-x-auto 
              !scroll-smooth 
              !items-center 
              !w-full 
              hide-scrollbar
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {imoveis.map((item) => (
              <div
                key={item.id}
                className="!flex-shrink-0 !w-[320px] md:!w-[340px] lg:!w-[360px]"
              >
                <PropertyCard item={item} />
              </div>
            ))}
          </div>

          {/* seta direita */}
          {showArrows && index < imoveis.length - visibleCards && (
            <button
              onClick={() =>
                setIndex((i) => Math.min(imoveis.length - 1, i + 1))
              }
              className="!absolute !right-0 !top-1/2 !-translate-y-1/2 z-10 !bg-white !p-2 !rounded-full !shadow-md !hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      )}

      {/* 🔹 Modais */}
      <Dialog open={showContactModal} onOpenChange={(o) => !o && closeModals()}>
        <MessageFormModal />
      </Dialog>
      <Dialog open={showPhoneModal} onOpenChange={(o) => !o && closeModals()}>
        <ContactPhoneModal />
      </Dialog>
    </section>
  );
}
