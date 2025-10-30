import Pagination from "@/components/Pagination";
import type { Imovel } from "@/types";
import CardPropertiesAdmin from "../CardPropertiesAdmin";

type Props = {
  loading: boolean;
  items: Imovel[];
  createdId?: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onToggleAtivo: (id: number, ativo: boolean) => void;
};

export default function PropertiesGridMyProperty({
  loading,
  items,
  createdId,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onToggleAtivo,
}: Props) {
  return (
    <>
      {/* ✅ GRID ELÁSTICO COM IMPORTÂNCIA */}
      <div  className="
    !grid
    !gap-6
    !w-full
    sm:!grid-cols-2
    lg:!grid-cols-3
    xl:!grid-cols-4
    
    !transition-all
    !duration-300
  ">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <CardPropertiesAdmin key={idx} loading />
            ))
          : items.map((it) => {
              const highlight = Boolean(createdId && it.id === createdId);
              return (
                <div
                  key={it.id}
                  className={highlight ? "!ring-2 !ring-green-400 !rounded-2xl" : ""}
                >
                  <CardPropertiesAdmin
                    item={it}
                    onView={() => onView(it.id)}
                    onEdit={() => onEdit(it.id)}
                    onToggleAtivo={(novo) => onToggleAtivo(it.id, novo)}
                  />
                </div>
              );
            })}
      </div>

      
      {!loading && totalPages > 1 && (
        <div className="!w-full !flex !justify-center !mt-10">
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
