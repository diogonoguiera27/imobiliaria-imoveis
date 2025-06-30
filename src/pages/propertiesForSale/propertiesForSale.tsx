import { useState } from "react";
import { Footer } from "@/components/Footer/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { ContactModal, ContactPhoneModal } from "@/components/modals";
import { PropertyListSection } from "@/components/propertiesForSale";
import Pagination from "@/components/Pagination/Pagination";

const imoveisVenda = [
  {
    id: 1,
    imagem:
      "https://images.unsplash.com/photo-1748063578185-3d68121b11ff?q=80&w=1946&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "",
  },
  {
    id: 2,
    imagem:
      "https://images.unsplash.com/photo-1711114378455-b1f479d94a19?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Vila Darcy Penteado, São Roque",
    endereco: "Estrada Darcy Penteado",
    metragem: 600,
    quartos: 4,
    banheiros: 7,
    vagas: 4,
    preco: "Aluguel de R$ 15.000/mês",
    infoExtra: "Cond. R$ 3.000",
  },
  {
    id: 3,
    imagem:
      "https://images.unsplash.com/photo-1744405901062-d881973bc195?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Guarajuba (Monte Gordo), Camaçari",
    endereco: "Rua Arraia",
    metragem: 450,
    quartos: 7,
    banheiros: 5,
    vagas: 2,
    preco: "R$ 3.000.000",
    infoExtra: "Cond. R$ 950 · IPTU R$ 3.000",
  },
  {
    id: 4,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 5,
    imagem:
      "https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 6,
    imagem:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 7,
    imagem:
      "https://images.unsplash.com/photo-1602075432748-82d264e2b463?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 8,
    imagem:
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 9,
    imagem:
      "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=1181&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 10,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
];

export const ListaImoveisVenda = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden ">
        <SidebarTrigger />

        <main className="flex-grow !pt-[60px]">
          <PropertyListSection
            imoveisVenda={imoveisVenda}
            showContactModal={showContactModal}
            showPhoneModal={showPhoneModal}
            setShowContactModal={setShowContactModal}
            setShowPhoneModal={setShowPhoneModal}
            onOpenContactModal={() => setShowContactModal(true)}
            onOpenPhoneModal={() => setShowPhoneModal(true)}
          />

          <div className="!w-full !flex  !mt-10 !justify-between">
            <Pagination />
          </div>

          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <ContactModal />
          </Dialog>
          <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
            <ContactPhoneModal />
          </Dialog>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
};
