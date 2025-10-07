import { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaRulerCombined, FaBed, FaCar, FaBath } from "react-icons/fa";
import { useEffect, useRef } from "react";

interface PropertyCardAdminProps {
  item?: Imovel;
  loading?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onToggleAtivo?: (novo: boolean) => void;
}

export default function CardPropertiesAdmin({
  item,
  loading = false,
  onView,
  onEdit,
  onToggleAtivo,
}: PropertyCardAdminProps) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
  const cardRef = useRef<HTMLDivElement>(null);

  // 🧠 Diagnóstico completo de largura
  useEffect(() => {
    function logWidth(context: string) {
      if (cardRef.current) {
        const largura = cardRef.current.offsetWidth;
        console.log(
          `🏠 [DEBUG - ${context}] Card largura: ${largura}px | Imóvel:`,
          item?.bairro || "(sem bairro)",
          "-",
          item?.cidade || "(sem cidade)"
        );
      } else {
        console.warn("⚠️ [DEBUG] cardRef não disponível no momento.");
      }
    }

    // Log inicial
    logWidth("montagem");

    // Log quando viewport muda (resize)
    const handleResize = () => logWidth("resize");
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [item]);

  if (loading) {
    return (
      <div
        ref={cardRef}
        className="card-admin-test !w-full sm:!w-[285px] !h-[470px] !flex-shrink-0 !flex !flex-col !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-200"
      >
        <Skeleton className="h-[180px] w-full" />
        <div className="!p-4 !flex !flex-col !justify-between !gap-3 !flex-1">
          <div className="!flex !flex-col !gap-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>

          <div className="!flex !flex-wrap !gap-x-3 !gap-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="!flex !flex-col !gap-2 !mt-2">
            <div className="!flex !justify-between !gap-2">
              <Skeleton className="h-9 w-full rounded" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
            <Skeleton className="h-9 w-full rounded mt-1" />
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = item?.imagem
    ? `${API_URL}${item.imagem}`
    : "https://via.placeholder.com/300x180.png?text=Sem+Imagem";
  const isActive = !!item?.ativo;

  return (
    <div
      ref={cardRef}
      className="card-admin-test !w-full sm:!w-[285px] !max-w-[380px] !h-[470px] !flex-shrink-0 !flex !flex-col !bg-white !rounded-xl !shadow-md !overflow-hidden !border !border-gray-200 hover:!scale-[1.01] !transition !cursor-default"
    >
      {/* Imagem */}
      <div className="!w-full !h-[180px] !overflow-hidden relative">
        <img
          src={imageUrl}
          alt={`${item?.tipo} em ${item?.bairro}, ${item?.cidade}`}
          className="!w-full !h-full !object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-1 text-[11px] font-semibold rounded ${
            isActive ? "bg-green-600 text-white" : "bg-gray-400 text-white"
          }`}
        >
          {isActive ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="!p-4 !flex !flex-col !justify-between !gap-3 !flex-1">
        <div className="!flex !flex-col !gap-1">
          <h3 className="!text-base !font-semibold !text-gray-900 !leading-snug !break-words">
            {item?.bairro}, {item?.cidade}
          </h3>
          <p className="!text-sm !text-gray-500 !break-words">{item?.endereco}</p>
          <p className="!text-xs !font-semibold !uppercase !text-red-600">
            {item?.tipoNegocio === "venda" ? "Venda" : "Aluga-se"}
          </p>
        </div>

        <div className="!flex !flex-wrap !gap-x-3 !gap-y-2 !text-gray-600 !text-sm">
          <div className="!flex !items-center !gap-2">
            <FaRulerCombined className="!text-[15px]" /> {item?.metragem} m²
          </div>
          <div className="!flex !items-center !gap-2">
            <FaBed className="!text-[15px]" /> {item?.quartos}
          </div>
          <div className="!flex !items-center !gap-2">
            <FaBath className="!text-[15px]" /> {item?.banheiros}
          </div>
          <div className="!flex !items-center !gap-2">
            <FaCar className="!text-[15px]" /> {item?.vagas}
          </div>
        </div>

        <div>
          <p className="!text-xs !text-gray-800 !font-bold !mb-1">{item?.tipo}</p>
          <p className="!text-base !font-bold !text-gray-900">
            R$ {item?.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="!flex !flex-col !gap-2 !mt-2">
          <div className="!flex !justify-between !gap-2">
            <Button
              onClick={onView}
              className="!flex-1 !rounded !bg-gray-200 !text-gray-800 !text-sm hover:!bg-gray-300"
            >
              Ver
            </Button>

            <Button
              onClick={onEdit}
              disabled={!isActive}
              title={!isActive ? "Ative o imóvel para editar" : undefined}
              className={`!flex-1 !rounded !text-sm !transition-colors ${
                isActive
                  ? "!bg-blue-600 !text-white hover:!bg-blue-700"
                  : "!bg-gray-300 !text-gray-500 cursor-not-allowed"
              }`}
            >
              Editar
            </Button>
          </div>

          {onToggleAtivo && (
            <Button
              onClick={() => onToggleAtivo(!isActive)}
              className={`!w-full !rounded !text-sm !mt-1 ${
                isActive
                  ? "!bg-amber-500 hover:!bg-amber-600 !text-white"
                  : "!bg-green-600 hover:!bg-green-700 !text-white"
              }`}
            >
              {isActive ? "Desativar" : "Ativar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
