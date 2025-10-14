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
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function ProfilePage() {
  const { user, token } = useAuth();

  const [favoritosCount, setFavoritosCount] = useState<number | null>(null);
  const [ultimoAcesso, setUltimoAcesso] = useState<string>("");
  const [membroDesde, setMembroDesde] = useState<string>("");
  const [loadingResumo, setLoadingResumo] = useState(true);
  const [erroResumo, setErroResumo] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    setFavoritosCount(null);
    setUltimoAcesso("");
    setMembroDesde("");
    setErroResumo(null);
    setLoadingResumo(true);
  }, [user, token]);

  useEffect(() => {
    if (!user || !token) return;

    const carregarResumo = async () => {
      try {
        const data = await getUserOverview(user.id, token);

        setFavoritosCount(data.favoritosCount);

        const membroDesdeFmt = format(
          new Date(data.user.createdAt),
          "MMM/yyyy",
          {
            locale: ptBR,
          }
        );
        const ultimoAcessoFmt = format(
          new Date(data.user.ultimoAcesso),
          "dd/MM/yyyy",
          {
            locale: ptBR,
          }
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

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Usuário não autenticado.
      </div>
    );
  }

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
      <div className="!flex !flex-col !min-h-screen !w-full !overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        <SidebarTrigger />

        <main className="!flex-grow !mt-18">
          {/* 🔹 Container centralizado com padrão global */}
          <div
            className="
              !w-full 
              md:!max-w-[80%] md:!mx-auto 
              !px-0
              !flex !flex-col md:!flex-row 
              !gap-8 
              !items-start
            "
          >
            {/* 🧭 Sidebar do perfil */}
            <div className="!w-full md:!w-[320px] !flex-shrink-0">
              <ProfileSidebar />
            </div>

            {/* 📋 Conteúdo principal */}
            <div className="!flex-1 !flex !flex-col !gap-6 !w-full">
              {/* 🔹 Resumo de atividades */}
              {erroResumo ? (
                <div className="!text-red-500 !text-sm">{erroResumo}</div>
              ) : (
                <UserActivitySummaryProfile
                  loading={loadingResumo}
                  favoritosCount={favoritosCount ?? 0}
                  ultimoAcesso={ultimoAcesso}
                  membroDesde={membroDesde}
                />
              )}

              
              <ProfileEditFormProfile user={editableUser} />
            </div>
          </div>
        </main>

        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>

        <div className="block md:hidden">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
