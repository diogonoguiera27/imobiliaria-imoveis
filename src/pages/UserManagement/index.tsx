// src/pages/UserManagement/index.tsx
import { useEffect, useState } from "react";
import { getUsers, User, PaginatedUsers } from "@/service/userService";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarTrigger from "@/components/ui/sidebar";
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

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res: PaginatedUsers = await getUsers(page, limit);
        setUsers(res.data);
        setTotalPages(res.pagination.totalPages);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  return (
    <SidebarProvider>
      <div className="!flex !flex-col !w-screen !overflow-x-hidden">
        <SidebarTrigger />

        <main className="!flex-grow !mt-10">
          <div className="!w-full !max-w-[85%] !mx-auto !px-4 !mt-6">
            <h1 className="!text-3xl !font-bold !mb-8 !text-gray-800">
              Gerenciamento de Usuários
            </h1>

            {/* Tabela (desktop) */}
            <div className="!overflow-hidden !shadow-md !rounded-2xl !border !border-gray-200 !bg-white">
              <table className="!hidden md:!table !w-full !text-sm !text-left !text-gray-600">
                <thead className="!bg-gradient-to-r from-red-400 to-red-600 !text-white !uppercase">
                  <tr>
                    <th className="!px-6 !py-4 !rounded-tl-2xl">Nome</th>
                    <th className="!px-6 !py-4">Email</th>
                    <th className="!px-6 !py-4">Telefone</th>
                    <th className="!px-6 !py-4">Cidade</th>
                    <th className="!px-6 !py-4">Criado em</th>
                    <th className="!px-6 !py-4 !rounded-tr-2xl !text-center">
                      Qtd. Imóveis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, idx) => (
                        <tr key={idx}>
                          <td className="!px-6 !py-4">
                            <Skeleton className="!h-4 !w-32" />
                          </td>
                          <td className="!px-6 !py-4">
                            <Skeleton className="!h-4 !w-48" />
                          </td>
                          <td className="!px-6 !py-4">
                            <Skeleton className="!h-4 !w-24" />
                          </td>
                          <td className="!px-6 !py-4">
                            <Skeleton className="!h-4 !w-28" />
                          </td>
                          <td className="!px-6 !py-4">
                            <Skeleton className="!h-4 !w-20" />
                          </td>
                          <td className="!px-6 !py-4 !text-center">
                            <Skeleton className="!h-4 !w-10 !mx-auto" />
                          </td>
                        </tr>
                      ))
                    : users.length > 0
                    ? users.map((u) => (
                        <tr key={u.id} className="hover:!bg-red-50">
                          <td className="!px-6 !py-4 !font-medium">{u.nome}</td>
                          <td className="!px-6 !py-4">{u.email}</td>
                          <td className="!px-6 !py-4">{u.telefone || "-"}</td>
                          <td className="!px-6 !py-4">{u.cidade}</td>
                          <td className="!px-6 !py-4">
                            {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="!px-6 !py-4 !text-center !text-red-600">
                            {u.quantidadeImoveis}
                          </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td
                          colSpan={6}
                          className="!p-6 !text-center !text-gray-500"
                        >
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>

              {/* Cards (mobile) */}
              <div className="md:!hidden !flex !flex-col !gap-4 !p-4">
                {loading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="!p-4 !border !border-gray-200 !rounded-xl !shadow-sm !bg-white !flex !flex-col !gap-2"
                      >
                        <Skeleton className="!h-4 !w-40" />
                        <Skeleton className="!h-4 !w-56" />
                        <Skeleton className="!h-4 !w-32" />
                        <Skeleton className="!h-4 !w-28" />
                        <Skeleton className="!h-4 !w-24" />
                        <Skeleton className="!h-4 !w-16" />
                      </div>
                    ))
                  : users.length > 0
                  ? users.map((u) => (
                      <div
                        key={u.id}
                        className="!p-4 !border !border-gray-200 !rounded-xl !shadow-sm !bg-white"
                      >
                        <p>
                          <span className="!font-semibold">Nome:</span> {u.nome}
                        </p>
                        <p>
                          <span className="!font-semibold">Email:</span>{" "}
                          {u.email}
                        </p>
                        <p>
                          <span className="!font-semibold">Telefone:</span>{" "}
                          {u.telefone || "-"}
                        </p>
                        <p>
                          <span className="!font-semibold">Cidade:</span>{" "}
                          {u.cidade}
                        </p>
                        <p>
                          <span className="!font-semibold">Criado em:</span>{" "}
                          {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        <p>
                          <span className="!font-semibold">Qtd. Imóveis:</span>{" "}
                          <span className="!text-red-600">
                            {u.quantidadeImoveis}
                          </span>
                        </p>
                      </div>
                    ))
                  : (
                    <p className="!text-center !text-gray-500">
                      Nenhum usuário encontrado
                    </p>
                  )}
              </div>
            </div>

            {/* Paginação com shadcn */}
            <div className="!flex !justify-center !mt-6">
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
                      className={
                        page === totalPages ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
