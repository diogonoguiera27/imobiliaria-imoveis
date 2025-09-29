import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import { getUserOverview } from "@/service/authService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/auth";
import ProfileSidebar from "@/components/ProfileSidebar";
import UserActivitySummaryProfile from "@/components/UserActivitySummaryProfile";
import ProfileEditFormProfile from "@/components/ProfileEditFormProfile";
import type { User } from "@/service/userService";

export default function ProfilePage() {
  const { user, token } = useAuth();

  const [favoritosCount, setFavoritosCount] = useState<number | null>(null);
  const [ultimoAcesso, setUltimoAcesso] = useState<string>("");
  const [membroDesde, setMembroDesde] = useState<string>("");
  const [loadingResumo, setLoadingResumo] = useState(true);
  const [erroResumo, setErroResumo] = useState<string | null>(null);

  // ✅ reset de estado quando usuário/tokens mudam
  useEffect(() => {
    if (!user || !token) return;
    setFavoritosCount(null);
    setUltimoAcesso("");
    setMembroDesde("");
    setErroResumo(null);
    setLoadingResumo(true);
  }, [user, token]);

  // ✅ busca do overview do usuário
  useEffect(() => {
    if (!user || !token) return;

    const carregarResumo = async () => {
      try {
        const data = await getUserOverview(user.id, token);

        setFavoritosCount(data.favoritosCount);

        const membroDesdeFmt = format(
          new Date(data.user.createdAt),
          "MMM/yyyy",
          { locale: ptBR }
        );
        const ultimoAcessoFmt = format(
          new Date(data.user.ultimoAcesso),
          "dd/MM/yyyy",
          { locale: ptBR }
        );

        setMembroDesde(membroDesdeFmt);
        setUltimoAcesso(ultimoAcessoFmt);
      } catch (error) {
        console.error("Erro ao carregar overview:", error);
        setErroResumo("Erro ao carregar resumo de atividades.");
      } finally {
        setLoadingResumo(false);
      }
    };

    carregarResumo();
  }, [user, token]);

  // ✅ caso não autenticado
  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Usuário não autenticado.
      </div>
    );
  }

  // 🔹 monta objeto apenas com campos editáveis
  const editableUser: Pick<
    User,
    "id" | "nome" | "telefone" | "email" | "cidade" | "avatarUrl"
  > = {
    id: user.id,
    nome: user.nome,
    telefone: user.telefone ?? "",
    email: user.email,
    cidade: user.cidade,
    avatarUrl: user.avatarUrl,
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        <SidebarTrigger />

        <main className="flex-grow flex justify-center !px-4 !pt-20 pb-10">
          <div
            className="
              w-full max-w-6xl flex flex-col md:flex-row gap-8
              md:items-start items-center
            "
          >
            {/* Sidebar de navegação do perfil */}
            <div className="w-full md:w-[320px] flex-shrink-0">
              <ProfileSidebar />
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col gap-6 w-full">
              {/* 🔹 Resumo de atividades com Skeleton */}
              {erroResumo ? (
                <div className="text-red-500 text-sm">{erroResumo}</div>
              ) : (
                <UserActivitySummaryProfile
                  loading={loadingResumo}
                  favoritosCount={favoritosCount ?? 0}
                  ultimoAcesso={ultimoAcesso}
                  membroDesde={membroDesde}
                />
              )}

              {/* 🔹 Formulário de edição do perfil */}
              <ProfileEditFormProfile user={editableUser} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
