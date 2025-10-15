import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import Pagination from "@/components/Pagination";
import { Imovel } from "@/types";
import PropertyListSection from "@/components/PropertiesForSale";
import { buscarImoveis, PaginatedProperties } from "@/service/propertyService";
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

const ITEMS_PER_PAGE = 8;

export default function ListaImoveisVenda() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarImoveis({
          page: currentPage,
          take: ITEMS_PER_PAGE,
        });
        setImoveis(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        console.error("Erro ao buscar imóveis:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarImoveis();
  }, [currentPage]);

  return (
    <SidebarProvider>
      <div className="!w-full !flex !flex-col !min-h-screen">
        <main className="!flex-1">
          <SidebarTrigger />
          <section className="!pt-[72px] !w-full">
            <div className="!w-[80%] !mx-auto">
              {/* 🔹 Lista de Imóveis */}
              <PropertyListSection
                imoveisVenda={imoveis}
                loading={loading}
                showContactModal={showContactModal}
                showPhoneModal={showPhoneModal}
                setShowContactModal={setShowContactModal}
                setShowPhoneModal={setShowPhoneModal}
                onOpenContactModal={() => setShowContactModal(true)}
                onOpenPhoneModal={() => setShowPhoneModal(true)}
              />

              {/* 🔹 Paginação */}
              {!loading && totalPages > 1 && (
                <div className="!w-full !flex !mt-10 !justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </section>
        </main>

        {/* 🔹 Modais */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <MessageFormModal />
        </Dialog>
        <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
          <PhoneContactModal />
        </Dialog>

        {/* 🔹 Footer Responsivo */}
        <div className="!mt-6 !w-full !mx-auto">
          <div className="hidden md:block">
            <FooterDesktop variant="list" />
          </div>

          {/* 📱 Mobile */}
          <div className="block md:hidden !mt-8">
            <MobileBottomBar />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
