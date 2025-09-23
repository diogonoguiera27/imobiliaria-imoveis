import type { Imovel } from "@/types";
import { Button } from "@/components/ui/button";

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

export default function PropertiesList({
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
      {/* 🖥️ Tabela no Desktop apenas */}
      <div className="!hidden md:!block !overflow-x-auto">
        <table className="!w-full !border-collapse !bg-white !rounded-lg !shadow-sm !text-sm">
          <thead className="!bg-gray-100">
            <tr>
              <th className="!py-3 !px-4 !text-left">Endereço</th>
              <th className="!py-3 !px-4 !text-left">Cidade</th>
              <th className="!py-3 !px-4 !text-left">Tipo</th>
              <th className="!py-3 !px-4 !text-left">Negócio</th>
              <th className="!py-3 !px-4 !text-left">Preço</th>
              <th className="!py-3 !px-4 !text-center">Status</th>
              <th className="!py-3 !px-4 !text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:!bg-gray-50">
                <td className="!py-3 !px-4">
                  <div className="!font-medium">
                    {item.bairro || "Bairro não informado"}
                  </div>
                </td>
                <td className="!py-3 !px-4">{item.cidade}</td>
                <td className="!py-3 !px-4">{item.tipo}</td>
                <td className="!py-3 !px-4 capitalize">{item.tipoNegocio}</td>
                <td className="!py-3 !px-4">
                  {item.preco
                    ? `R$ ${Number(item.preco).toLocaleString("pt-BR")}`
                    : "-"}
                </td>
                <td className="!py-3 !px-4 !text-center">
                  <span
                    className={`!px-2 !py-1 !rounded-full !text-xs ${
                      item.ativo
                        ? "!bg-green-100 !text-green-700"
                        : "!bg-red-100 !text-red-700"
                    }`}
                  >
                    {item.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="!py-3 !px-4 !flex !justify-center !gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📑 Paginação (desktop) */}
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
