import { FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Imovel } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface PropertyHighlightCardProps {
  imovel: Imovel;
}

const MainCarouselPropertyCard = ({ imovel }: PropertyHighlightCardProps) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  const goToDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    navigate(`/imovel/${imovel.id}`);
  };

  return (
    <div
      className="!w-[460px] !flex-shrink-0 !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-700 hover:!scale-[1.01] !transition"
      role="article"
      aria-label={`Imóvel em ${imovel.bairro}, ${imovel.cidade}`}
    >
      
      <img
        src={`${API_URL}${imovel.imagem}`}
        alt={`${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}`}
        className="!w-full !h-[200px] !object-cover !block"
      />

      
      <div className="!bg-gray-100 !border-t !border-gray-800 !px-4 !pt-4 !pb-3">
        
        <div className="!flex !flex-col !gap-2 !text-left">
          <p className="!text-xs !text-black !font-semibold !uppercase">
            {imovel.tipo}
          </p>

          <h3 className="!text-base !font-bold !text-gray-800 !leading-snug">
            {imovel.bairro}, {imovel.cidade}
          </h3>

          <p className="!text-sm !text-gray-500">{imovel.endereco}</p>

          <p className="!text-xs !font-semibold !uppercase !text-red-600">
            {imovel.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
          </p>

          {imovel.user?.nome && (
            <p className="!text-xs !text-gray-700 !font-bold">
              Proprietário:{" "}
              <span className="!font-medium">{imovel.user.nome}</span>
            </p>
          )}
        </div>

        
        <div className="!flex !flex-wrap !gap-x-3 !gap-y-2 !text-gray-700 !text-sm !mt-3 !mb-3">
          <div className="!flex !items-center !gap-1">
            <FaRulerCombined className="!text-[15px]" />
            {imovel.metragem} m²
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBed className="!text-[15px]" />
            {imovel.quartos}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaCar className="!text-[15px]" />
            {imovel.vagas}
          </div>

          <div className="!ml-auto !flex !items-center">
            <p className="!text-base !font-bold !text-green-600">
              R{"$ "}
              {imovel.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        
        <div className="!w-full">
          <Button
            type="button"
            onClick={goToDetails}
            className="!w-full !h-10 !text-sm !font-semibold !text-white !bg-red-500 !rounded-md hover:!bg-red-700 !transition-colors !duration-200"
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
