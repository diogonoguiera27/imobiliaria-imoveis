import CardPropertiesAdmin from "@/components/PropertyCard/CardPropertiesAdmin";
import Pagination from "@/components/Pagination";
import type { Imovel } from "@/types";

type Props = {
  loading: boolean;
  items: Imovel[];
  createdId?: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleAtivo: (id: number, ativo: boolean) => void;
};

export default function PropertiesGrid({
  loading,
  items,
  createdId,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleAtivo,
}: Props) {
  return (
    <>
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-24">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="!h-64 !rounded-2xl !bg-neutral-100 animate-pulse"
              />
            ))
          : items.map((it) => {
              const highlight = Boolean(createdId && it.id === createdId);
              return (
                <div
                  key={it.id}
                  className={`${highlight ? "!ring-2 !ring-green-400 !rounded-2xl" : ""}`}
                >
                  <CardPropertiesAdmin
                    item={it}
                    onView={() => onView(it.id)}
                    onEdit={() => onEdit(it.id)}
                    onDelete={() => onDelete(it.id)}
                    onToggleAtivo={(novo) => onToggleAtivo(it.id, novo)}
                  />
                </div>
              );
            })}
      </div>

      {!loading && totalPages > 1 && (
        <div className="!w-full !flex !mt-10 !justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
