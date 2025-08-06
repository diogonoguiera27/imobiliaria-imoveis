import {
  ProfileSidebar,
  ProfileEditForm,
  UserActivitySummary,
  
} from "@/components/Profile";
import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { getUserOverview } from "@/service/authService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Usuário não autenticado.
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        <SidebarTrigger />

        <main className="flex-grow flex justify-center px-4 !pt-20 pb-10">
          <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-[320px] flex-shrink-0">
              <ProfileSidebar />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              {/* 🔍 Resumo de Atividades */}
              {loadingResumo ? (
                <div className="text-gray-500 text-sm">
                  Carregando resumo de atividades...
                </div>
              ) : erroResumo ? (
                <div className="text-red-500 text-sm">{erroResumo}</div>
              ) : (
                <UserActivitySummary
                  favoritosCount={favoritosCount ?? 0}
                  ultimoAcesso={ultimoAcesso}
                  membroDesde={membroDesde}
                />
              )}

              <ProfileEditForm
                user={{
                  id: user.id,
                  nome: user.nome,
                  telefone: user.telefone ?? "",
                  email: user.email,
                  cidade: user.cidade,
                  avatarUrl: user.avatarUrl,
                }}
              />

              
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
