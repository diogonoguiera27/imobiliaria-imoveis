
import { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";

interface PropertyCardAdminProps {
  item: Imovel;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAtivo?: (novo: boolean) => void; 
}

export default function CardPropertiesAdmin({
  item,
  onView,
  onEdit,
  onDelete,
  onToggleAtivo,
}: PropertyCardAdminProps) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  const imageUrl = item.imagem
    ? `${API_URL}${item.imagem}`
    : "https://via.placeholder.com/300x180.png?text=Sem+Imagem";

  return (
    <div className="!w-[285px] !h-[470px] !flex-shrink-0 !flex !flex-col !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-200 hover:!scale-[1.01] !transition !cursor-default">
      {/* Imagem */}
      <div className="!w-full !h-[180px] !overflow-hidden relative">
        <img
          src={imageUrl}
          alt={`${item.tipo} em ${item.bairro}, ${item.cidade}`}
          className="!w-full !h-full !object-cover !block"
        />
        
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-[11px] font-semibold rounded ${
            item.ativo ? "bg-green-600 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {item.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      
      <div className="!p-4 !flex !flex-col !justify-between !gap-3 !flex-1">
        
        <div className="!flex !flex-col !gap-1 !text-left">
          <h3 className="!text-base !font-semibold !text-gray-900 !leading-snug !break-words">
            {item.bairro}, {item.cidade}
          </h3>
          <p className="!text-sm !text-gray-500 !break-words">{item.endereco}</p>
          <p className="!text-xs !font-semibold !uppercase !text-red-600">
            {item.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
          </p>
        </div>

        
        <div className="!flex !flex-wrap !gap-x-3 !gap-y-2 !text-gray-600 !text-sm">
          <div className="!flex !items-center !gap-2">
            <FaRulerCombined className="!text-[15px]" />
            {item.metragem} m²
          </div>
          <div className="!flex !items-center !gap-2">
            <FaBed className="!text-[15px]" />
            {item.quartos}
          </div>
          <div className="!flex !items-center !gap-2">
            <FaBath className="!text-[15px]" />
            {item.banheiros}
          </div>
          <div className="!flex !items-center !gap-2">
            <FaCar className="!text-[15px]" />
            {item.vagas}
          </div>
        </div>

       
        <div>
          <p className="!text-xs !text-gray-800 !font-bold !mb-1">{item.tipo}</p>
          <p className="!text-base !font-bold !text-gray-900">
            R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        
        <div className="!flex !flex-col !gap-2 !mt-2">
          <div className="!flex !justify-between !gap-2">
            <Button
              onClick={onView}
              className="!flex-1 !rounded !bg-gray-200 !text-gray-800 !text-sm hover:!bg-gray-300 !transition-colors"
            >
              Ver
            </Button>
            <Button
              onClick={onEdit}
              className="!flex-1 !rounded !bg-blue-600 !text-white !text-sm hover:!bg-blue-700 !transition-colors"
            >
              Editar
            </Button>
            <Button
              onClick={onDelete}
              className="!flex-1 !rounded !bg-red-600 !text-white !text-sm hover:!bg-red-700 !transition-colors"
            >
              Excluir
            </Button>
          </div>

          {onToggleAtivo && (
            <Button
              onClick={() => onToggleAtivo(!item.ativo)}
              className={`!w-full !rounded !text-sm !mt-1 ${
                item.ativo
                  ? "!bg-amber-500 hover:!bg-amber-600 !text-white"
                  : "!bg-green-600 hover:!bg-green-700 !text-white"
              }`}
            >
              {item.ativo ? "Desativar" : "Ativar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
