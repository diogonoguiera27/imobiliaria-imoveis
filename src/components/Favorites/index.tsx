import { useEffect, useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { buscarFavoritosPaginados } from "@/service/favoriteService";
import { Imovel } from "@/types";
import { useAuth } from "@/hooks/auth";
import { Skeleton } from "@/components/ui/skeleton";

// 🔹 componentes individuais do shadcn
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function FavoriteProperties() {
  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  const carregarFavoritos = useCallback(
    async (page: number) => {
      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await buscarFavoritosPaginados(token, {
          page,
          take: ITEMS_PER_PAGE,
        });
        setItems(response.data);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.page);
      } catch (err) {
        console.error("❌ Erro ao buscar imóveis favoritos:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [token] // ✅ dependência correta
  );

  useEffect(() => {
    carregarFavoritos(1);
  }, [carregarFavoritos]);

  return (
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <Heart className="!text-red-500" /> Imóveis Favoritos
      </h3>

      {loading ? (
        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="!bg-white !rounded-lg !overflow-hidden !shadow-sm !border !border-red-100"
            >
              <Skeleton className="!w-full !h-40" />
              <div className="!p-4 !space-y-2">
                <Skeleton className="!h-4 !w-3/4" />
                <Skeleton className="!h-3 !w-full" />
                <Skeleton className="!h-3 !w-2/3" />
                <Skeleton className="!h-3 !w-1/2" />
                <Skeleton className="!h-4 !w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <Heart size={48} className="mb-4 text-red-300" />
          <p className="text-lg font-medium">
            Você ainda não adicionou imóveis aos favoritos.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Explore os imóveis disponíveis e clique no{" "}
            <Heart className="inline text-red-400" size={16} /> para salvar seus
            preferidos!
          </p>
        </div>
      ) : (
        <>
          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
            {items.map((imovel) => (
              <div
                key={imovel.id}
                className="!bg-white !rounded-lg !overflow-hidden !shadow-sm !border !border-red-100 hover:!shadow-md !transition !duration-200"
              >
                <img
                  src={`${API_URL}${imovel.imagem}`}
                  alt={`${imovel.tipo} em ${imovel.bairro}`}
                  className="!w-full !h-40 !object-cover"
                />
                <div className="!p-4 !text-gray-800">
                  <h4 className="!font-semibold !text-base !mb-1">
                    {imovel.tipo} para {imovel.tipoNegocio?.toLowerCase()}
                  </h4>
                  <p className="!text-sm !text-gray-600">
                    {imovel.endereco}, {imovel.bairro}
                  </p>
                  <p className="!text-sm !text-gray-500">{imovel.cidade}</p>
                  {imovel.user?.nome && (
                    <p className="!text-xs !text-gray-700 !font-bold">
                      Proprietário:{" "}
                      <span className="font-medium">{imovel.user.nome}</span>
                    </p>
                  )}
                  <p className="!text-sm !text-green-600 !font-bold !mt-2">
                    R$ {imovel.preco.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="!flex !justify-center !mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        carregarFavoritos(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <button
                          onClick={() => carregarFavoritos(page)}
                          className={`!px-3 !py-1 !rounded !cursor-pointer ${
                            page === currentPage
                              ? "!bg-red-600 !text-white"
                              : "!bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        carregarFavoritos(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
