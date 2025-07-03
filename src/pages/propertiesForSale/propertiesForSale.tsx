import { useState } from "react";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { MessageFormModal, PhoneContactModal } from "@/components/Modals";
import { PropertyListSection } from "@/components/PropertiesForSale";
import Pagination from "@/components/Pagination";
import { Imovel } from "@/types/imovel";

const imoveisVenda: Imovel[] = [
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
    preco: "15000,00",
    infoExtra: "",
    tipoNegocio: "aluguel" ,
    tipo: "Apartamento",
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
    preco: "15000,00",
    infoExtra: "Cond. R$ 3.000",
    tipoNegocio: "venda", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "3000,60",
    infoExtra: "Cond. R$ 950 · IPTU R$ 3.000",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "15000,00",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "15000,00",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel" ,// <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "15000,00",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "15000,00",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "3000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "3000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
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
    preco: "3000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 11,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "3000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 12,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel" ,// <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 13,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 14,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco:"2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 15,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel",// <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 16,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "1000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 17,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 18,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 19,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 20,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 21,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 22,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 23,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel" ,// <-- adicionado aqui
    tipo: "Apartamento",
  },
  {
    id: 24,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
   {
    id: 25,
    imagem:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "2000,60",
    infoExtra: "Cond. R$ 250",
    tipoNegocio: "aluguel", // <-- adicionado aqui
    tipo: "Apartamento",
  },
];

const ITEMS_PER_PAGE = 12;

export const ListaImoveisVenda = () => {
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
