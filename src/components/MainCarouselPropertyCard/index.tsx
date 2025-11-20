import { FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Imovel } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/service/favoriteService";
import { useAuth } from "@/hooks/auth";
import { useState, useEffect } from "react";

interface PropertyHighlightCardProps {
  imovel?: Imovel;
  loading?: boolean;
  isFavoritedInitially?: boolean;
}

const MainCarouselPropertyCard = ({
  imovel,
  loading = false,
  isFavoritedInitially = false,
}: PropertyHighlightCardProps) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  // ❤️ Estado REAL sincronizado com backend
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);

  // 🔄 Atualiza quando o backend enviar novo valor
  useEffect(() => {
    setIsFavorited(isFavoritedInitially);
  }, [isFavoritedInitially]);

  const goToDetails = () => {
    if (!imovel) return;
    navigate(`/imovel/${imovel.uuid}`);
  };

  // ❤️ Função de favoritar idêntica ao PropertyCard
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token || !imovel) return;

    try {
      const identifier =
        imovel.uuid && /^[0-9a-fA-F-]{36}$/.test(imovel.uuid)
          ? imovel.uuid
          : imovel.id;

      await toggleFavorite(identifier, isFavorited, token);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("❌ Erro ao favoritar imóvel:", err);
    }
  };

  // ============================
  // SKELETON
  // ============================
  if (loading) {
    return (
      <div className="!w-full sm:!w-[380px] md:!w-[400px] lg:!w-[460px]
                      !flex-shrink-0 !bg-white !rounded-xl !shadow-md 
                      !overflow-hidden !border !border-gray-700 !p-4">
        <Skeleton className="!w-full !h-[100px] sm:!h-[200px] !mb-3" />
        <div className="!flex !flex-col !gap-2">
          <Skeleton className="!h-3 !w-1/3" />
          <Skeleton className="!h-4 !w-3/4" />
          <Skeleton className="!h-3 !w-2/3" />
        </div>
      </div>
    );
  }

  if (!imovel) return null;

  return (
    <div
      className="
        !relative
        !w-full sm:!w-[380px] md:!w-[400px] lg:!w-[460px]
        !flex-shrink-0 !bg-white !rounded-xl !shadow-md 
        !overflow-hidden !border !border-gray-700 
        hover:!scale-[1.01] !transition !cursor-pointer
      "
      onClick={goToDetails}
    >
      {/* 🖼️ Imagem */}
      <img
        src={`${API_URL}${imovel.imagem}`}
        alt={`${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}`}
        className="!w-full !h-[100px] sm:!h-[200px] !object-cover !block"
      />

      {/* 📋 Conteúdo */}
      <div className="!bg-gray-100 !border-t !border-gray-800 !px-4 !pt-3 !pb-3">
        
        {/* 🔥 Nome + ❤️ Coração IGUAL ao PropertyCard */}
        <div className="!flex !justify-between !items-center">
          <h3 className="!text-sm sm:!text-base !font-bold !text-gray-800 !leading-snug line-clamp-1">
            {imovel.bairro}, {imovel.cidade}
          </h3>

          <button
            onClick={handleToggleFavorite}
            className="!text-red-500 hover:!text-red-600 !cursor-pointer"
          >
            <Heart
              size={22}
              strokeWidth={1.5}
              className={isFavorited ? "fill-red-500" : ""}
            />
          </button>
        </div>

        <p className="!text-[11px] sm:!text-sm !text-gray-500 line-clamp-1">
          {imovel.endereco}
        </p>

        <p className="!text-[11px] sm:!text-xs !font-semibold !uppercase !text-red-600">
          {imovel.tipoNegocio === "venda" ? "VENDA" : "ALUGA-SE"}
        </p>

        {imovel.user?.nome && (
          <p className="!text-[11px] sm:!text-xs !text-gray-700 !font-bold line-clamp-1">
            Proprietário: {imovel.user.nome}
          </p>
        )}

        {/* ⚙️ Informações */}
        <div className="!flex !flex-wrap !gap-x-3 !gap-y-1 !text-gray-700 !text-[11px] sm:!text-sm !mt-3">
          <div className="!flex !items-center !gap-1">
            <FaRulerCombined className="!text-[12px] sm:!text-[15px]" />
            {imovel.metragem} m²
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBed className="!text-[12px] sm:!text-[15px]" />
            {imovel.quartos}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaCar className="!text-[12px] sm:!text-[15px]" />
            {imovel.vagas}
          </div>

          <div className="!ml-auto !flex !items-center">
            <p className="!text-sm sm:!text-base !font-bold !text-green-600">
              R$
              {imovel.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* 🔘 Botão desktop */}
        <div className="!hidden sm:!block !mt-3">
          <Button
            onClick={goToDetails}
            className="!w-full !h-10 !text-sm !font-semibold !text-white !bg-red-500 
                       !rounded-md hover:!bg-red-700 !transition-colors !duration-200"
          >
            Ver mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCarouselPropertyCard;
