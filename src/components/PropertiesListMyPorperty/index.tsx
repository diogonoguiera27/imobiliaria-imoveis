import type { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {
  loading: boolean;
  items: Imovel[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  
  onToggleAtivo: (id: number, ativo: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PropertiesListMyPorperty({
  loading,
  items,
  onView,
  onEdit,
  
  onToggleAtivo,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (loading) {
    return <div className="!py-6 !text-center">Carregando...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="!py-6 !text-center !text-neutral-600">
        Nenhum imóvel encontrado.
      </div>
    );
  }

  return (
    <div className="!w-full">
      
      <div className="!overflow-hidden !shadow-md !rounded-2xl !border !border-gray-200 !bg-white">
        <Table className="!min-w-full !border-collapse !bg-white !rounded-lg !shadow-sm !text-sm">
          <TableHeader className="!bg-gradient-to-r from-red-400 to-red-600 !text-white !uppercase">
            <TableRow>
              <TableHead className="!py-3 !px-4 !text-left !text-gray-100">
                Endereço
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-left !text-gray-100">
                Cidade
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-left !text-gray-100">
                Tipo
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-left !text-gray-100">
                Negócio
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-left !text-gray-100">
                Preço
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-center !text-gray-100">
                Status
              </TableHead>
              <TableHead className="!py-3 !px-4 !text-center !text-gray-100">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isActive = !!item.ativo;

              return (
                <TableRow key={item.id} className="hover:!bg-gray-50">
                  <TableCell className="!py-3 !px-4">
                    <div className="!font-medium">
                      {item.bairro || "Bairro não informado"}
                    </div>
                  </TableCell>
                  <TableCell className="!py-3 !px-4">{item.cidade}</TableCell>
                  <TableCell className="!py-3 !px-4">{item.tipo}</TableCell>
                  <TableCell className="!py-3 !px-4 capitalize">
                    {item.tipoNegocio}
                  </TableCell>
                  <TableCell className="!py-3 !px-4">
                    {item.preco
                      ? `R$ ${Number(item.preco).toLocaleString("pt-BR")}`
                      : "-"}
                  </TableCell>
                  <TableCell className="!py-3 !px-4 !text-center">
                    <span
                      className={`!px-2 !py-1 !rounded-full !text-xs ${
                        isActive
                          ? "!bg-green-100 !text-green-700"
                          : "!bg-red-100 !text-red-700"
                      }`}
                    >
                      {isActive ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="!py-3 !px-4 !flex !justify-center !gap-2">
                    {/* Ver */}
                    <Button
                      size="sm"
                      onClick={() => onView(item.id)}
                      className="!w-[80px] !py-2 !bg-gradient-to-r !from-sky-500 !to-blue-600 !text-white !font-semibold !rounded-full !transition-transform hover:!scale-105 hover:!shadow-lg"
                    >
                      Ver
                    </Button>

                    
                    <Button
                      size="sm"
                      onClick={() => isActive && onEdit(item.id)}
                      disabled={!isActive}
                      title={!isActive ? "Ative o imóvel para editar" : undefined}
                      className={`!w-[80px] !py-2 !font-semibold !rounded-full !transition-transform ${
                        isActive
                          ? "!bg-gradient-to-r !from-amber-400 !to-orange-500 !text-white hover:!scale-105 hover:!shadow-lg"
                          : "!bg-gray-300 !text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Editar
                    </Button>

                    
                    <Button
                      size="sm"
                      onClick={() => onToggleAtivo(item.id, !isActive)}
                      className={`!w-[100px] !py-2 !text-white !font-semibold !rounded-full !transition-transform hover:!scale-105 hover:!shadow-lg ${
                        isActive
                          ? "!bg-gradient-to-r !from-gray-400 !to-gray-600"
                          : "!bg-gradient-to-r !from-green-500 !to-emerald-600"
                      }`}
                    >
                      {isActive ? "Desativar" : "Ativar"}
                    </Button>

                    
                    
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 📑 Paginação */}
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
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
