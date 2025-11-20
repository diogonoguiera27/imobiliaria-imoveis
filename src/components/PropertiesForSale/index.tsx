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

// ================================
// 🔥 Tipagem correta para normalizeUUID
// ================================
const normalizeUUID = (val: string | null | undefined): string | null => {
  if (!val || typeof val !== "string") return null;

  const cleaned = val.trim().toLowerCase();

  return cleaned.length === 36 ? cleaned : null;
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

  const [favoriteKeys, setFavoriteKeys] = useState<(number | string)[]>([]);

  // ===========================================
  // 🔥 CARREGA FAVORITOS DO BACKEND
  // ===========================================
  useEffect(() => {
    async function carregarFavoritos() {
      if (!token) return;

      try {
        const favoritos = await getUserFavorites(token);

        const keys = favoritos
          .flatMap((fav) => [
            fav.propertyId,
            fav.propertyUuid ? normalizeUUID(fav.propertyUuid) : null,
          ])
          .filter((v): v is number | string => v !== null);

        setFavoriteKeys(keys);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
      }
    }

    carregarFavoritos();
  }, [token]);

  return (
    <section className="!w-full !pt-4 !pb-10">
      <div className="!w-full !flex !justify-center">
        <h2 className="!text-black !text-xl !font-bold !text-center !mt-2 !mb-6">
          Todos os imóveis disponíveis
        </h2>
      </div>

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
          : imoveisVenda.map((item) => {
              const cleanUuid = normalizeUUID(item.uuid);

              const isFav =
                favoriteKeys.includes(item.id) ||
                (cleanUuid && favoriteKeys.includes(cleanUuid));

              return (
                <PropertyCardGridWrapper
                  key={item.id}
                  item={item}
                  isFavoritedInitially={!!isFav}
                  onOpenContactModal={onOpenContactModal}
                  onOpenPhoneModal={onOpenPhoneModal}
                />
              );
            })}
      </div>

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
