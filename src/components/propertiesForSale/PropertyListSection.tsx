import { FC } from "react";
import { PropertyCard } from "@/components/PropertiesForSale";
import { MessageFormModal,PhoneContactModal} from "@/components/Modals";
import { Dialog } from "@/components/ui/dialog";
import type { Imovel } from "@/types";

type PropertyListSectionProps = {
  imoveisVenda: Imovel[];
  showContactModal: boolean;
  showPhoneModal: boolean;
  setShowContactModal: (open: boolean) => void;
  setShowPhoneModal: (open: boolean) => void;
  onOpenContactModal: () => void;
  onOpenPhoneModal: () => void;
};

 const PropertyListSection: FC<PropertyListSectionProps> = ({
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
        <MessageFormModal />
      </Dialog>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <PhoneContactModal/>
      </Dialog>
    </section>
  );
};

export default PropertyListSection;