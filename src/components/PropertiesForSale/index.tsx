import { FC, useEffect, useState } from "react";
import { CardProperties } from "@/components/PropertyCard";
import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { Dialog } from "@/components/ui/dialog";
import type { Imovel } from "@/types";

import { getUserFavorites } from "@/service/favoriteService";
import { useAuth } from "@/hooks/auth";

type PropertyListSectionProps = {
  imoveisVenda: Imovel[];
  loading?: boolean;
  showContactModal: boolean;
  showPhoneModal: boolean;
  setShowContactModal: (open: boolean) => void;
  setShowPhoneModal: (open: boolean) => void;
  onOpenContactModal: () => void;
  onOpenPhoneModal: () => void;
};

// ✅ Mesmo tipo que o backend retorna em /favorites
type FavoriteIdentifier = {
  propertyId: number;
  propertyUuid?: string | null;
};

const PropertyListSection: FC<PropertyListSectionProps> = ({
  imoveisVenda,
  loading = false,
  showContactModal,
  showPhoneModal,
  setShowContactModal,
  setShowPhoneModal,
  onOpenContactModal,
  onOpenPhoneModal,
}) => {
  const { token } = useAuth();
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]); // apenas IDs numéricos

  useEffect(() => {
    async function carregarFavoritos() {
      if (!token) return;
      try {
        const favoritos: FavoriteIdentifier[] = await getUserFavorites(token);

        // ✅ Extrai apenas os IDs numéricos para comparação no includes
        const ids = favoritos
          .map((f) => f.propertyId)
          .filter((id): id is number => typeof id === "number");

        setFavoritedIds(ids);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    }

    carregarFavoritos();
  }, [token]);

  return (
    <section className="w-full px-4 pt-0 !mt-0">
      <div className="w-full flex justify-center mb-0">
        <h2 className="!text-black !text-xl !font-bold !text-center !max-w-screen-lg !mt-2 !mb-4">
          Imóveis à venda próximos a você
        </h2>
      </div>

      <div className="w-full flex justify-center">
        <div
          className="
            max-w-[1300px] w-full
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            gap-6 justify-items-center mx-auto
          "
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CardProperties key={`skeleton-${i}`} loading />
              ))
            : imoveisVenda.map((item) => (
                <CardProperties
                  key={item.id}
                  item={item}
                  // ✅ Verifica se o ID interno do imóvel está na lista
                  isFavoritedInitially={favoritedIds.includes(item.id)}
                  onOpenContactModal={onOpenContactModal}
                  onOpenPhoneModal={onOpenPhoneModal}
                />
              ))}
        </div>
      </div>

      {/* Modais de contato */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <MessageFormModal />
      </Dialog>

      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <PhoneContactModal />
      </Dialog>
    </section>
  );
};

export default PropertyListSection;
