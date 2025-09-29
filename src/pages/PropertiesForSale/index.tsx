// src/pages/ListaImoveisVenda.tsx
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";

import Pagination from "@/components/Pagination";
import { Imovel } from "@/types";

import PropertyListSection from "@/components/PropertiesForSale";
import { buscarImoveis, PaginatedProperties } from "@/service/propertyService";

const ITEMS_PER_PAGE = 8;

export const ListaImoveisVenda = () => {
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

        // 👉 agora pega todos, sem filtro de tipoNegocio ou categoria
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
      <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
        <SidebarTrigger />

        <main className="flex-grow !pt-[60px]">
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

          {/* Paginação (esconde enquanto carrega) */}
          {!loading && totalPages > 1 && (
            <div className="w-full flex mt-10 justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Modais */}
          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <MessageFormModal />
          </Dialog>
          <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
            <PhoneContactModal />
          </Dialog>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default ListaImoveisVenda;
