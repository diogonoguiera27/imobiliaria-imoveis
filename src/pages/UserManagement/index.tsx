// src/pages/UserManagement/index.tsx
import { useEffect, useState } from "react";
import { getUsers, User, PaginatedUsers } from "@/service/userService";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPhone } from "@/lib/phone";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AxiosError } from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const take = 10; // alinhado com backend

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res: PaginatedUsers = await getUsers(page, take);

        setUsers(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalUsers(res.pagination?.total || 0);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.error ||
              err.response?.data?.message ||
              "Erro ao carregar usuários."
          );
        } else {
          setError("Erro inesperado ao carregar usuários.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, take]);

  return (
    <SidebarProvider>
      <div className="!flex !flex-col !w-screen !overflow-x-hidden">
        <SidebarTrigger />

        <main className="!flex-grow !mt-10">
          <div className="!w-full !max-w-[85%] !mx-auto !px-4 !mt-6">
            <h1 className="!text-3xl !font-bold !mb-8 !text-gray-800">
              Gerenciamento de Usuários
            </h1>

            {error && (
              <div className="!mb-4 !p-4 !text-red-700 !bg-red-100 !rounded-lg !border !border-red-300">
                {error}
              </div>
            )}

            {/* Tabela responsiva */}
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

            {/* Paginação */}
            <div className="!flex !flex-col !items-center !mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={page === idx + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(idx + 1);
                        }}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="!text-center !text-sm !text-gray-500 !mt-3">
                Total de usuários:{" "}
                <span className="!font-medium">{totalUsers}</span>
              </p>
            </div>
          </div>
        </main>

        <div className="!mt-6">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;
