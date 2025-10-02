// src/pages/UserManagement/index.tsx
import { useEffect, useState } from "react";
import { getUsers, User, PaginatedUsers } from "@/service/userService";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import { AxiosError } from "axios";
import { UserTable } from "@/components/UserTable";
import { UserPagination } from "@/components/UserPagination";

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

            {/* Exibe erro se houver */}
            {error && (
              <div className="!mb-4 !p-4 !text-red-700 !bg-red-100 !rounded-lg !border !border-red-300">
                {error}
              </div>
            )}

            {/* Tabela de usuários */}
            <UserTable users={users} loading={loading} />

            {/* Paginação */}
            <UserPagination
              page={page}
              totalPages={totalPages}
              totalUsers={totalUsers}
              onPageChange={setPage}
            />
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
