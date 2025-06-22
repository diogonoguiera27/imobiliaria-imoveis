import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <section className="!pt-20 !p-4">
          <h1>Home</h1>
        </section>
      </main>
    </SidebarProvider>
  );
}
