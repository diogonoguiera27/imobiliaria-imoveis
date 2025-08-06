import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import FavoriteProperties from "@/components/Favorites";

export default function FavoritosPage() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        
        <SidebarTrigger />

        
        <main className="flex-grow !pt-18 !px-4">
          <div className="!max-w-6xl !mx-auto !p-6">
            <FavoriteProperties />
          </div>
        </main>

        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
