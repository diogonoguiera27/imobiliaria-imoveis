// src/components/imoveisVenda/PropertyCard.tsx
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  item: {
    id: number;
    imagem: string;
    titulo: string;
    endereco: string;
    metragem: number;
    quartos: number;
    banheiros: number;
    vagas: number;
    preco: string;
    infoExtra?: string;
  };
  onOpenContactModal: () => void;
  onOpenPhoneModal: () => void;
}

export const PropertyCard = ({ item, onOpenContactModal, onOpenPhoneModal }: PropertyCardProps) => {
  return (
    <div
      key={item.id}
      onClick={() => (window.location.href = `/imovel/${item.id}`)}
      className="w-[285px] !h-[431px] !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-700 hover:scale-[1.01] transition cursor-pointer flex flex-col"
    >
      <div className="w-full !h-[180px] !overflow-hidden">
        <img
          src={item.imagem}
          alt={item.titulo}
          className="w-full h-full !object-cover !block"
        />
      </div>

      <div className="!p-4 !bg-gray-100 !border-t !border-gray-800 flex flex-col justify-between gap-4 !rounded-b-xl flex-1">
        <div className="flex flex-col gap-2 text-left">
          <h3 className="!text-base !font-semibold !text-gray-900 !leading-snug break-words">
            {item.titulo}
          </h3>
          <p className="!text-sm !text-gray-500 break-words">{item.endereco}</p>
        </div>

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

        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="!text-base !font-bold !text-gray-900">{item.preco}</p>
            {item.infoExtra && (
              <p className="!text-xs !text-gray-500">{item.infoExtra}</p>
            )}
          </div>
          <button className="!text-red-500 hover:!text-red-600">
            <Heart strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpenContactModal();
            }}
            className="flex-1 !bg-red-500 text-white !text-sm !rounded hover:!bg-red-700 transition-colors duration-200"
          >
            Mensagem
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPhoneModal();
            }}
            className="flex-1 !bg-transparent !text-red-600 text-sm rounded hover:bg-red-700"
          >
            Telefone
          </Button>
        </div>
      </div>
    </div>
  );
};
