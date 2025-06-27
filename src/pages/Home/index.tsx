import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BannerInicial } from "@/components/home/HeroBanner";
import { FiltroBusca } from "@/components/home/SearchFilter";
import { HighlightSection } from "@/components/home/HighlightSection";
import { Footer } from "@/components/Footer/Footer";

export function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <BannerInicial />
          <FiltroBusca />
          <HighlightSection />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
