import { FC } from "react";
import { PropertyCard } from "./PropertyCard";
import { ContactModal, ContactPhoneModal } from "@/components/modals";
import { Dialog } from "@/components/ui/dialog";

export type Imovel = {
  id: number;
  imagem: string;
  titulo: string;
  endereco: string;
  metragem: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  preco: string;
  infoExtra: string;
};

type PropertyListSectionProps = {
  imoveisVenda: Imovel[];
  showContactModal: boolean;
  showPhoneModal: boolean;
  setShowContactModal: (open: boolean) => void;
  setShowPhoneModal: (open: boolean) => void;
  onOpenContactModal: () => void;
  onOpenPhoneModal: () => void;
};

export const PropertyListSection: FC<PropertyListSectionProps> = ({
  imoveisVenda,
  showContactModal,
  showPhoneModal,
  setShowContactModal,
  setShowPhoneModal,
  onOpenContactModal,
  onOpenPhoneModal,
}) => {
  return (
    <section className="w-full px-4 pt-0 !mt-0">
      <div className="w-full flex justify-center mb-0">
        <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2 !mb-4">
          Imóveis à venda próximos a você
        </h2>
      </div>

      <div className="w-full flex justify-center">
        <div className="max-w-[1300px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mx-auto">
          {imoveisVenda.map((item) => (
            <PropertyCard
              key={item.id}
              item={item}
              onOpenContactModal={onOpenContactModal}
              onOpenPhoneModal={onOpenPhoneModal}
            />
          ))}
        </div>
      </div>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <ContactModal />
      </Dialog>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <ContactPhoneModal />
      </Dialog>
    </section>
  );
};
