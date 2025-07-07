import { useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { MessageFormModal, PhoneContactModal } from "@/components/Modals";

import Pagination from "@/components/Pagination";
import { Imovel } from "@/types";
import { imoveis as todosImoveis } from "@/data/imovel";
import  PropertyListSection  from "@/components/PropertiesForSale";




const ITEMS_PER_PAGE = 12;

export const ListaImoveisVenda = () => {
  const imoveisVenda: Imovel[] = todosImoveis.filter(imovel => imovel.categoria === "venda");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(imoveisVenda.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentImoveis = imoveisVenda.slice(startIndex, endIndex);

  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden ">
        <SidebarTrigger />

        <main className="flex-grow !pt-[60px]">
          <PropertyListSection
            imoveisVenda={currentImoveis}
            showContactModal={showContactModal}
            showPhoneModal={showPhoneModal}
            setShowContactModal={setShowContactModal}
            setShowPhoneModal={setShowPhoneModal}
            onOpenContactModal={() => setShowContactModal(true)}
            onOpenPhoneModal={() => setShowPhoneModal(true)}
          />

          <div className="!w-full !flex  !mt-10 !justify-between">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

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
