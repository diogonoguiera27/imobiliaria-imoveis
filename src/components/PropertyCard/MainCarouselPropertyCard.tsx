import { FaBed, FaCar, FaRulerCombined } from "react-icons/fa";
import { Imovel } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface PropertyHighlightCardProps {
  imovel: Imovel;
}

const MainCarouselPropertyCard = ({ imovel }: PropertyHighlightCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      key={imovel.id}
      className="w-[460px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-700 hover:scale-[1.01] transition"
    >
      <img
        src={imovel.imagem}
        alt={imovel.bairro}
        className="w-full !h-[200px] object-cover"
      />
      <div className="h-[220px] !p-4 !bg-gray-100 !border !border-gray-800 flex flex-col gap-4 !rounded-b-xl">
        <div className="flex flex-col gap-2 text-left">
          <p className="text-xs text-black font-semibold uppercase">
            {imovel.tipo}
          </p>
          <h3 className="text-base font-bold text-gray-800 leading-snug">
            {imovel.bairro}, {imovel.cidade}
          </h3>
          <p className="text-sm text-gray-500">{imovel.endereco}</p>
          <p className="text-xs font-semibold uppercase text-red-600">
            {imovel.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-700 text-sm mt-1">
          <div className="flex items-center gap-1">
            <FaRulerCombined className="text-[15px]" />
            {imovel.metragem} m²
          </div>
          <div className="flex items-center gap-1">
            <FaBed className="text-[15px]" />
            {imovel.quartos}
          </div>
          <div className="flex items-center gap-1">
            <FaCar className="text-[15px]" />
            {imovel.vagas}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <p className="text-base font-bold text-green-600 mt-1">
              R${" "}
              {imovel.preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col !gap-1 !px-4 !pb-3">
          <Button
            onClick={() => navigate("/imovel/:id")}
            className="!text-sm !font-semibold !text-white !bg-red-500 !px-4 !py-1 !rounded hover:!bg-red-700 transition-colors duration-200 "
          >
            Ver mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainCarouselPropertyCard;
