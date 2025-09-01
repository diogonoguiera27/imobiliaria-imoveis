import { useState, useEffect } from "react";
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Imovel } from "@/types";

import { toggleFavorite } from "@/service/favoriteService";
import { useAuth } from "@/hooks/auth";

interface PropertyCardProps {
  item: Imovel;
  onOpenContactModal: () => void;
  onOpenPhoneModal: () => void;
  variant?: "default" | "featured";
  isFavoritedInitially?: boolean;
}

const PropertyCard = ({
  item,
  onOpenContactModal,
  onOpenPhoneModal,
  variant = "default",
  isFavoritedInitially = false,
}: PropertyCardProps) => {
  const isFeatured = variant === "featured";
  const { token } = useAuth();

  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  // 🔁 Sincroniza favorito com o prop quando mudar
  useEffect(() => {
    setIsFavorited(isFavoritedInitially);
  }, [isFavoritedInitially]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      console.warn("⚠️ Usuário não autenticado — não é possível favoritar.");
      return;
    }

    try {
      await toggleFavorite(item.id, isFavorited, token);
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("Erro ao favoritar imóvel:", err);
    }
  };

  return (
    <div
      onClick={() => (window.location.href = `/imovel/${item.id}`)}
      className={`${
        isFeatured ? "w-[460px]" : "w-[285px]"
      } !h-[460px] flex-shrink-0 flex flex-col !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-700 hover:scale-[1.01] transition cursor-pointer`}
    >
      {/* Imagem */}
      <div className="w-full !h-[180px] !overflow-hidden">
        <img
          src={`${API_URL}${item.imagem}`}
          alt={`${item.tipo} em ${item.bairro}, ${item.cidade}`}
          className="w-full h-full !object-cover !block"
        />
      </div>

      {/* Conteúdo */}
      <div className="!p-4 !bg-gray-100 !border-t !border-gray-800 flex flex-col justify-between gap-4 !rounded-b-xl flex-1">
        {/* Endereço e categoria */}
        <div className="flex flex-col gap-2 text-left">
          <h3 className="!text-base !font-semibold !text-gray-900 !leading-snug break-words">
            {item.bairro}, {item.cidade}
          </h3>
          <p className="!text-sm !text-gray-500 break-words">{item.endereco}</p>
          <p className="!text-xs !font-semibold !uppercase !text-red-600">
            {item.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
          </p>

          {/* Proprietário */}
          {item.user?.nome && (
            <p className="!text-xs !text-gray-700 !font-bold">
              Proprietário: <span className="font-medium">{item.user.nome}</span>
            </p>
          )}
        </div>

        {/* Características */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 !text-gray-600 !text-sm">
          <div className="flex items-center gap-2">
            <FaRulerCombined className="text-[15px]" />
            {item.metragem} m²
          </div>
          <div className="flex items-center gap-2">
            <FaBed className="text-[15px]" />
            {item.quartos}
          </div>
          <div className="flex items-center gap-2">
            <FaBath className="text-[15px]" />
            {item.banheiros}
          </div>
          <div className="flex items-center gap-2">
            <FaCar className="text-[15px]" />
            {item.vagas}
          </div>
        </div>

        {/* Preço e favorito */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="!text-xs !text-gray-800 !font-bold mb-1">{item.tipo}</p>
            <p className="!text-base !font-bold !text-gray-900">
              R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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

        {/* Botões */}
        <div className="flex justify-between gap-2 mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpenContactModal();
            }}
            className="flex-1 !bg-red-500 !text-white !text-sm !rounded hover:!bg-red-700 transition-colors duration-200"
          >
            Mensagem
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhoneModal();
            }}
            className="flex-1 !bg-transparent !text-red-600 !text-sm !rounded hover:!bg-white"
          >
            Telefone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
