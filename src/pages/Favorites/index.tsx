import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import FavoriteProperties from "@/components/Favorites";
import { FooterDesktop } from "@/components/FooterDesktop";

export default function FavoritosPage() {
  return (
    <SidebarProvider>
      <div className="!flex !flex-col !min-h-screen !w-full !overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 !text-gray-900">
        <SidebarTrigger />

        {/* ===== Conteúdo principal ===== */}
        <main
          className="
            !flex-grow 
            !mt-24 sm:!mt-28 md:!mt-32 
            !flex 
            !justify-center 
            !pb-16
          "
        >
          {/* 🔹 Container centralizado — sem padding lateral */}
          <div
            className="
              !w-full 
              md:!max-w-[80%] md:!mx-auto 
              !flex 
              !flex-col 
              !gap-8
            "
          >
            <h1 className="!text-2xl !font-semibold !text-gray-800 !mb-4 text-center md:text-left">
               Meus Imóveis Favoritos
            </h1>

            {/* Lista de imóveis favoritados */}
            <FavoriteProperties />
          </div>
        </main>

        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>
      </div>
    </SidebarProvider>
  );
}
