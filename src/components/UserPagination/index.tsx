// src/components/UserPagination/index.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserPaginationProps {
  page: number;
  totalPages: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
}

export function UserPagination({
  page,
  totalPages,
  totalUsers,
  onPageChange,
}: UserPaginationProps) {
  return (
    <div className="!flex !flex-col !items-center !mt-6">
      <Pagination>
        <PaginationContent>
          {/* Botão anterior */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) onPageChange(page - 1);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Links das páginas */}
          {Array.from({ length: totalPages }).map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                href="#"
                isActive={page === idx + 1}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(idx + 1);
                }}
              >
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Botão próximo */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) onPageChange(page + 1);
              }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Total de registros */}
      <p className="!text-center !text-sm !text-gray-500 !mt-3">
        Total de usuários: <span className="!font-medium">{totalUsers}</span>
      </p>
    </div>
  );
}
