import { FC, useEffect, useState } from "react";

import MessageFormModal from "@/components/MessageFormModal";
import PhoneContactModal from "@/components/PhoneContactModal";
import { Dialog } from "@/components/ui/dialog";
import type { Imovel } from "@/types";

import { getUserFavorites } from "@/service/favoriteService";
import { useAuth } from "@/hooks/auth";

import PropertyCardGridWrapper from "../PropertyCardGridWrapper";

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
  const [favoritedIds, setFavoritedIds] = useState<number[]>([]);

  useEffect(() => {
    async function carregarFavoritos() {
      if (!token) return;
      try {
        const favoritos: FavoriteIdentifier[] = await getUserFavorites(token);
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
    <section className="!w-full !pt-4 !pb-10">
      {/* 🔹 Cabeçalho da seção (centralizado mas sem largura fixa) */}
      <div className="!w-full !flex !justify-center">
        <h2 className="!text-black !text-xl !font-bold !text-center !mt-2 !mb-6">
          Todos os imóveis disponíveis
        </h2>
      </div>

      {/* 🔹 Grid de imóveis - ocupa 100% do container pai */}
      <div
        className="
          !w-full
          !grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4
          !gap-6 !justify-items-center
        "
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardGridWrapper key={`skeleton-${i}`} loading />
            ))
          : imoveisVenda.map((item) => (
              <PropertyCardGridWrapper
                key={item.id}
                item={item}
                isFavoritedInitially={favoritedIds.includes(item.id)}
                onOpenContactModal={onOpenContactModal}
                onOpenPhoneModal={onOpenPhoneModal}
              />
            ))}
      </div>

      {/* 🔹 Modais de contato */}
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
