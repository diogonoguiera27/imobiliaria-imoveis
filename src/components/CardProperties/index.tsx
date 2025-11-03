import { useState, useEffect } from "react";
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Imovel } from "@/types";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "@/service/favoriteService";
import { useAuth } from "@/hooks/auth";
import { useContactContext } from "@/hooks/contact/useContact";

export interface PropertyCardProps {
  item?: Imovel;
  variant?: "default" | "featured";
  size?: "default" | "mobile";
  isFavoritedInitially?: boolean;
  loading?: boolean;
  onOpenContactModal?: () => void;
  onOpenPhoneModal?: () => void;
}

const PropertyCard = ({
  item,
  variant = "default",
  size = "default",
  isFavoritedInitially = false,
  loading = false,
  onOpenContactModal,
  onOpenPhoneModal,
}: PropertyCardProps) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { openContactModal, openPhoneModal } = useContactContext();
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);

  // ✅ define se é destaque
  const isFeatured = variant === "featured";
  const isMobile = size === "mobile";
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  useEffect(() => {
    setIsFavorited(isFavoritedInitially);
  }, [isFavoritedInitially]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token || !item) return;

    try {
      const identifier =
        item.uuid && /^[0-9a-fA-F-]{36}$/.test(item.uuid)
          ? item.uuid
          : item.id;

      await toggleFavorite(identifier, isFavorited, token);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("❌ Erro ao favoritar imóvel:", err);
    }
  };

  const handleNavigateToDetails = () => {
    if (!item) return;
    navigate(`/imovel/${item.uuid}`);
  };

  // =====================
  // 🦴 Skeleton (Carregando)
  // =====================
  if (loading) {
    return (
      <div
        className={`!flex !flex-col !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-200 ${
          isMobile ? "w-full !min-h-[480px]" : "!w-[340px] !h-[480px]"
        }`}
      >
        <Skeleton className="!h-[220px] !w-full" />
        <div className="!p-4 !flex !flex-col !justify-between !flex-1">
          <Skeleton className="!h-5 !w-3/4" />
          <Skeleton className="!h-4 !w-2/3" />
          <Skeleton className="!h-3 !w-1/4" />
          <div className="!flex !flex-wrap !gap-3 !mt-3">
            <Skeleton className="!h-4 !w-16" />
            <Skeleton className="!h-4 !w-12" />
            <Skeleton className="!h-4 !w-12" />
            <Skeleton className="!h-4 !w-12" />
          </div>
          <div className="!mt-auto !flex !flex-col !gap-3">
            <Skeleton className="!h-4 !w-20" />
            <Skeleton className="!h-6 !w-24" />
            <div className="!flex !gap-2">
              <Skeleton className="!h-9 !w-full !rounded" />
              <Skeleton className="!h-9 !w-full !rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================
  // 💡 Card normal
  // =====================
  if (!item) return null;

  return (
    <div
      onClick={handleNavigateToDetails}
      className={`
        !flex !flex-col !relative
        ${isMobile ? "w-full !max-w-none !min-h-[480px]" : "!w-[340px] !h-[480px]"}
        !bg-white !rounded-xl !shadow-md !overflow-hidden
        !border ${isFeatured ? "!border-red-500" : "!border-gray-200"}
        hover:!shadow-lg transition-all duration-200 !cursor-pointer
      `}
    >
      {/* 🔖 selo destaque */}
      {isFeatured && (
        <div className="!absolute !top-2 !left-2 !bg-red-600 !text-white !text-xs !font-bold !px-2 !py-1 !rounded">
          Destaque
        </div>
      )}

      {/* 🏠 imagem */}
      <div className="!w-full !h-[220px] !overflow-hidden">
        <img
          src={`${API_URL}${item.imagem}`}
          alt={`${item.tipo} em ${item.bairro}, ${item.cidade}`}
          className="!w-full !h-full !object-cover !block"
        />
      </div>

      {/* 📝 conteúdo */}
      <div className="!p-4 !flex !flex-col !justify-between !flex-1">
        <div className="!flex !flex-col !gap-1 !text-left">
          <h3 className="!text-[15px] !font-semibold !text-gray-900 !line-clamp-1">
            {item.bairro}, {item.cidade}
          </h3>
          <p className="!text-[13px] !text-gray-500 !line-clamp-1">
            {item.endereco}
          </p>
          <p className="!text-[12px] !font-bold !uppercase !text-red-600 !mt-1">
            {item.tipoNegocio === "venda" ? "VENDA" : "ALUGA-SE"}
          </p>
          {item.user?.nome && (
            <p className="!text-[12px] !text-gray-700 !font-medium !mt-1">
              Proprietário: {item.user.nome}
            </p>
          )}
        </div>

        {/* 🔹 infos */}
        <div className="!flex !flex-wrap !gap-x-3 !gap-y-1 !text-gray-600 !text-[13px] !mt-2">
          <div className="!flex !items-center !gap-1">
            <FaRulerCombined className="!text-[14px]" /> {item.metragem} m²
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBed className="!text-[14px]" /> {item.quartos}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBath className="!text-[14px]" /> {item.banheiros}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaCar className="!text-[14px]" /> {item.vagas}
          </div>
        </div>

        {/* 🔹 preço + favorito */}
        <div className="!flex !justify-between !items-center !mt-3">
          <div>
            <p className="!text-[12px] !text-gray-800 !font-semibold !mb-0.5">
              {item.tipo}
            </p>
            <p className="!text-[15px] !font-bold !text-gray-900">
              R${" "}
              {item.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="!text-red-500 hover:!text-red-600 !cursor-pointer"
          >
            <Heart
              strokeWidth={1.5}
              className={isFavorited ? "fill-red-500" : ""}
            />
          </button>
        </div>

        {/* 🔹 botões */}
        <div className="!flex !justify-between !gap-2 !mt-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openContactModal(item);
              onOpenContactModal?.();
            }}
            className="!flex-1 !bg-red-500 !text-white !text-[13px] !rounded hover:!bg-red-600 transition-colors duration-200"
          >
            Mensagem
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openPhoneModal(item);
              onOpenPhoneModal?.();
            }}
            className="!flex-1 !border !border-red-500 !text-red-500 !text-[13px] !rounded hover:!bg-red-50"
          >
            Telefone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
