import { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";

interface CardPropertiesAdminMobileProps {
  item?: Imovel;
  loading?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onToggleAtivo?: (novo: boolean) => void;
}

export default function CardPropertiesAdminMobile({
  item,
  loading = false,
  onView,
  onEdit,
  onToggleAtivo,
}: CardPropertiesAdminMobileProps) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  // ✅ Skeleton responsivo controlado pelo pai (sem largura fixa)
  if (loading) {
    return (
      <div className="!w-full !mx-auto !rounded-2xl !bg-white !shadow-md !border !border-gray-200">
        <Skeleton className="!w-full !h-[180px]" />
        <div className="!p-4">
          <Skeleton className="!h-4 !w-3/4" />
          <Skeleton className="!h-3 !w-1/2 !mt-2" />
          <Skeleton className="!h-3 !w-1/4 !mt-3" />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const imageUrl = item.imagem
    ? `${API_URL}${item.imagem}`
    : "https://via.placeholder.com/300x150.png?text=Sem+Imagem";

  const isActive = !!item.ativo;

  return (
    <div
      className="
    !w-full 
    !max-w-none 
    !rounded-2xl 
    !bg-white 
    !shadow-lg 
    !overflow-hidden 
    !border 
    !border-gray-200 
    hover:!scale-[1.01] 
    !transition-all 
    !duration-200
  "
    >
      {/* 🖼 Imagem */}
      <div className="relative !h-[180px]">
        <img
          src={imageUrl}
          alt={`${item?.tipo} em ${item?.bairro}, ${item?.cidade}`}
          className="!w-full !h-full !object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold rounded ${
            isActive ? "bg-green-600 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* 🧾 Conteúdo */}
      <div className="!p-4">
        {/* 🏡 Título e endereço */}
        <h3 className="!text-[15px] !font-semibold !text-gray-900 !leading-tight">
          {item?.bairro}, {item?.cidade}
        </h3>
        <p className="!text-xs !text-gray-600">{item?.endereco}</p>

        {/* 🔴 Tipo de negócio */}
        <p className="!text-[11px] !font-bold !uppercase !text-red-600 !mt-1">
          {item?.tipoNegocio === "venda" ? "VENDA" : "ALUGA-SE"}
        </p>

        {/* 📊 Características */}
        <div className="!flex !flex-wrap !items-center !gap-3 !mt-2 !text-[13px] !text-gray-700">
          <div className="!flex !items-center !gap-1">
            <FaRulerCombined className="text-gray-500" /> {item?.metragem ?? 0}{" "}
            m²
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBed className="text-gray-500" /> {item?.quartos ?? 0}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaBath className="text-gray-500" /> {item?.banheiros ?? 0}
          </div>
          <div className="!flex !items-center !gap-1">
            <FaCar className="text-gray-500" /> {item?.vagas ?? 0}
          </div>
        </div>

        {/* 💰 Tipo + Preço */}
        <div className="!mt-3">
          <p className="!text-xs !font-semibold !text-gray-800">
            {item?.tipo || "Tipo não informado"}
          </p>
          <p className="!text-[15px] !font-bold !text-gray-900">
            R${" "}
            {item?.preco?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* 🔘 Botões alinhados */}
        <div className="!mt-3 !flex !flex-col !gap-2">
          <Button
            onClick={onView}
            className="!w-full !rounded-md !bg-gray-200 hover:!bg-gray-300 !text-gray-800 !text-sm !font-medium"
          >
            Ver
          </Button>

          <Button
            onClick={onEdit}
            disabled={!isActive}
            className={`!w-full !rounded-md !text-sm !font-medium ${
              isActive
                ? "!bg-blue-600 hover:!bg-blue-700 !text-white"
                : "!bg-gray-300 !text-gray-500 cursor-not-allowed"
            }`}
          >
            Editar
          </Button>

          {onToggleAtivo && (
            <Button
              onClick={() => onToggleAtivo(!isActive)}
              className={`!w-full !rounded-md !text-sm !font-medium ${
                isActive
                  ? "!bg-orange-500 hover:!bg-orange-600"
                  : "!bg-green-600 hover:!bg-green-700"
              } !text-white`}
            >
              {isActive ? "Desativar" : "Ativar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
