"use client";

import {
  FavoriteProperties,
  ProfileEditForm,
  ProfileProgressCard,
  ProfileSidebar,
  ScheduledVisits,
  SearchPreferences,
} from "@/components/Profile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/auth";

export default function ProfilePage() {
  const { user } = useAuth();

  // Se não estiver logado
  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Usuário não autenticado.
      </div>
    );
  }

  // Dados mockados
  const favoritos = [
    {
      id: 1,
      titulo: "Apartamento moderno no centro",
      cidade: "São Paulo",
      preco: "R$ 350.000",
      imagem: "https://source.unsplash.com/400x300/?apartment",
    },
    {
      id: 2,
      titulo: "Casa com quintal espaçoso",
      cidade: "Campinas",
      preco: "R$ 480.000",
      imagem: "https://source.unsplash.com/400x300/?house",
    },
  ];

  const visitas = [
    {
      id: 1,
      data: "21/07/2025",
      hora: "10:00",
      endereco: "Rua das Flores, 123 - São Paulo",
      status: "Confirmada",
    },
    {
      id: 2,
      data: "25/07/2025",
      hora: "14:30",
      endereco: "Av. Brasil, 456 - Campinas",
      status: "Pendente",
    },
  ];

  const searchPreferences = {
    type: "Casa ou Apartamento",
    cities: ["São Paulo", "Campinas"],
    priceRange: "R$ 200 mil — R$ 500 mil",
    purpose: "Compra",
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        {/* Header */}
        <SidebarTrigger />

        {/* Main centralizado */}
        <main className="flex-grow flex justify-center px-4 !pt-20 !mb-10 ">
          <div className="w-[80%] flex flex-col md:flex-row gap-8 mb-10">
            {/* Sidebar */}
            <div className="w-full md:w-[320px] flex flex-col gap-6">
              <ProfileSidebar
              />
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col gap-6">
              <ProfileProgressCard />
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
              <FavoriteProperties favoritos={favoritos} />
              <ScheduledVisits visits={visitas} />
              <SearchPreferences
                type={searchPreferences.type}
                cities={searchPreferences.cities}
                priceRange={searchPreferences.priceRange}
                purpose={searchPreferences.purpose}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
