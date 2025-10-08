import { FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Imovel } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface PropertyHighlightCardProps {
  imovel?: Imovel;        // 🔑 opcional agora
  loading?: boolean;      // ✅ nova prop para skeleton
}

const MainCarouselPropertyCard = ({
  imovel,
  loading = false,
}: PropertyHighlightCardProps) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  const goToDetails = () => {
    if (!imovel) return;
    navigate(`/imovel/${imovel.uuid}`);
  };

  // 🔹 Estado Skeleton
  if (loading) {
    return (
      <div
        className="!w-full sm:!w-[380px] md:!w-[400px] lg:!w-[460px]
                   !flex-shrink-0 !bg-white !rounded-xl !shadow-md 
                   !overflow-hidden !border !border-gray-700 !p-4"
      >
        <Skeleton className="!w-full !h-[100px] sm:!h-[200px] !mb-3" />
        <div className="!flex !flex-col !gap-2">
          <Skeleton className="!h-3 !w-1/3" />
          <Skeleton className="!h-4 !w-3/4" />
          <Skeleton className="!h-3 !w-2/3" />
          <Skeleton className="!h-3 !w-1/4" />
          <Skeleton className="!h-3 !w-1/2" />
        </div>
        <div className="!flex !gap-3 !mt-3">
          <Skeleton className="!h-4 !w-16" />
          <Skeleton className="!h-4 !w-12" />
          <Skeleton className="!h-4 !w-12" />
          <Skeleton className="!h-5 !w-20 !ml-auto" />
        </div>
        <div className="!hidden sm:!block !mt-4">
          <Skeleton className="!h-10 !w-full !rounded-md" />
        </div>
      </div>
    );
  }

  if (!imovel) return null;

  return (
    <div
      className="!w-full sm:!w-[380px] md:!w-[400px] lg:!w-[460px]
                 !flex-shrink-0 !bg-white !rounded-xl !shadow-md 
                 !overflow-hidden !border !border-gray-700 
                 hover:!scale-[1.01] !transition !cursor-pointer"
      role="article"
      aria-label={`Imóvel em ${imovel.bairro}, ${imovel.cidade}`}
      onClick={goToDetails}
    >
      {/* 🖼️ Imagem */}
      <img
        src={`${API_URL}${imovel.imagem}`}
        alt={`${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}`}
        className="!w-full !h-[100px] sm:!h-[200px] !object-cover !block"
      />

      {/* 📋 Conteúdo */}
      <div className="!bg-gray-100 !border-t !border-gray-800 !px-4 !pt-3 !pb-3 !h-[140px] sm:!h-auto">
        <div className="!flex !flex-col !gap-1 sm:!gap-2 !text-left">
          <p className="!text-[11px] sm:!text-xs !text-black !font-semibold !uppercase">
            {imovel.tipo}
          </p>

          <h3 className="!text-sm sm:!text-base !font-bold !text-gray-800 !leading-snug line-clamp-1">
            {imovel.bairro}, {imovel.cidade}
          </h3>

          <p className="!text-[11px] sm:!text-sm !text-gray-500 line-clamp-1">
            {imovel.endereco}
          </p>

          <p className="!text-[11px] sm:!text-xs !font-semibold !uppercase !text-red-600">
            {imovel.tipoNegocio === "venda" ? "VENDA" : "ALUGA-SE"}
          </p>

          {imovel.user?.nome && (
            <p className="!text-[11px] sm:!text-xs !text-gray-700 !font-bold line-clamp-1">
              Proprietário:{" "}
              <span className="!font-medium">{imovel.user.nome}</span>
            </p>
          )}
        </div>

        {/* ⚙️ Informações adicionais */}
        <div className="!flex !flex-wrap !gap-x-3 !gap-y-1 !text-gray-700 !text-[11px] sm:!text-sm !mt-2 sm:!mt-3">
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
              R${" "}
              {imovel.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* 🔘 Botão visível apenas no desktop */}
        <div
          className="!w-full !hidden sm:!block !mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            onClick={goToDetails}
            className="!w-full !h-10 !text-sm !font-semibold !text-white !bg-red-500 
                       !rounded-md hover:!bg-red-700 !transition-colors !duration-200"
            aria-label={`Ver mais detalhes do imóvel em ${imovel.bairro}, ${imovel.cidade}`}
          >
            Ver mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCarouselPropertyCard;
