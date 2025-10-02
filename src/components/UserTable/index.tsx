// src/components/UserTable/index.tsx
import { User } from "@/service/userService";
import { formatPhone } from "@/lib/phone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableProps {
  users: User[];
  loading: boolean;
}

export function UserTable({ users, loading }: UserTableProps) {
  return (
    <div className="!overflow-hidden !shadow-md !rounded-2xl !border !border-gray-200 !bg-white">
      <div className="!overflow-x-auto">
        <Table className="!w-full !min-w-[760px] !text-sm !text-left !text-gray-600">
          <TableHeader className="!bg-gradient-to-r from-red-400 to-red-600 !text-white !uppercase">
            <TableRow>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !rounded-tl-2xl !text-gray-100">
                Nome
              </TableHead>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !text-gray-100">
                Email
              </TableHead>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !text-gray-100 whitespace-nowrap">
                Telefone
              </TableHead>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !text-gray-100 whitespace-nowrap">
                Cidade
              </TableHead>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !text-gray-100 whitespace-nowrap">
                Criado em
              </TableHead>
              <TableHead className="!px-3 !py-3 md:!px-6 md:!py-4 !rounded-tr-2xl !text-center !text-gray-100 whitespace-nowrap">
                Qtd. Imóveis
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4">
                    <Skeleton className="!h-4 !w-32" />
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4">
                    <Skeleton className="!h-4 !w-48" />
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4">
                    <Skeleton className="!h-4 !w-24" />
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4">
                    <Skeleton className="!h-4 !w-28" />
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4">
                    <Skeleton className="!h-4 !w-20" />
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 !text-center">
                    <Skeleton className="!h-4 !w-10 !mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.id} className="hover:!bg-red-50">
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 !font-medium">
                    {u.nome}
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 break-words">
                    {u.email}
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 whitespace-nowrap">
                    {formatPhone(u.telefone)}
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 whitespace-nowrap">
                    {u.cidade}
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="!px-3 !py-3 md:!px-6 md:!py-4 !text-center !text-red-600 whitespace-nowrap">
                    {u.quantidadeImoveis}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="!p-6 !text-center !text-gray-500"
                >
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
