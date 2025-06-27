import { useState } from "react";
import { Footer } from "@/components/Footer/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { ContactModal, ContactPhoneModal } from "@/components/modals";
import { PropertyListSection } from "@/components/propertiesForSale";

const imoveisVenda = [
  {
    id: 1,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
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
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
