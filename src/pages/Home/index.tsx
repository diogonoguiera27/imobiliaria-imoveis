import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeroBanner,SearchFilter,HighlightSection} from "@/components/Home/";
import { Footer } from "@/components/Footer";

export function Home() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <HeroBanner />
          <SearchFilter />
          <HighlightSection />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
