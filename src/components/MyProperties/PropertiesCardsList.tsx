

import type { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  loading: boolean;
  items: Imovel[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleAtivo: (id: number, ativo: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};


function ListSkeleton() {
  return (
    <div className="!p-4 !rounded-lg !shadow-sm !bg-white !border !border-gray-200">
      <div className="!flex !flex-col !gap-2">
        <Skeleton className="!h-4 !w-3/4" />
        <Skeleton className="!h-4 !w-1/2" />
        <Skeleton className="!h-4 !w-2/3" />
        <Skeleton className="!h-4 !w-1/3" />
        <Skeleton className="!h-4 !w-1/4" />
        <Skeleton className="!h-6 !w-20" />
      </div>
      <div className="!flex !gap-2 !mt-3">
        <Skeleton className="!h-8 !w-16 !rounded" />
        <Skeleton className="!h-8 !w-16 !rounded" />
        <Skeleton className="!h-8 !w-20 !rounded" />
        <Skeleton className="!h-8 !w-16 !rounded" />
      </div>
    </div>
  );
}

export default function PropertiesCardsList({
  loading,
  items,
  onView,
  onEdit,
  onDelete,
  onToggleAtivo,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div className="!w-[285px] sm:!w-full !mx-auto !flex !flex-col !gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="!py-6 !text-center !text-neutral-600">
        Nenhum imóvel encontrado.
      </div>
    );
  }

  return (
    <div className="!w-[285px] sm:!w-full !mx-auto !flex !flex-col !gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="!p-4 !rounded-lg !shadow-sm !bg-white !border !border-gray-200"
        >
          <p>
            <span className="!font-semibold">Endereço:</span>{" "}
            {item.bairro || "Bairro não informado"}
          </p>
          <p>
            <span className="!font-semibold">Cidade:</span> {item.cidade}
          </p>
          <p>
            <span className="!font-semibold">Tipo:</span> {item.tipo}
          </p>
          <p>
            <span className="!font-semibold">Negócio:</span> {item.tipoNegocio}
          </p>
          <p>
            <span className="!font-semibold">Preço:</span>{" "}
            {item.preco
              ? `R$ ${Number(item.preco).toLocaleString("pt-BR")}`
              : "-"}
          </p>
          <p>
            <span className="!font-semibold">Status:</span>{" "}
            <span
              className={`!px-2 !py-1 !rounded-full !text-xs ${
                item.ativo
                  ? "!bg-green-100 !text-green-700"
                  : "!bg-red-100 !text-red-700"
              }`}
            >
              {item.ativo ? "Ativo" : "Inativo"}
            </span>
          </p>

          
          <div className="!flex !justify-start !flex-wrap !gap-2 !mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(item.id)}
            >
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item.id)}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleAtivo(item.id, !item.ativo)}
            >
              {item.ativo ? "Desativar" : "Ativar"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              Excluir
            </Button>
          </div>
        </div>
      ))}

      
      {totalPages > 1 && (
        <div className="!flex !justify-center !items-center !gap-2 !mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="!text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
