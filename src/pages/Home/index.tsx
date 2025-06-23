import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CarrosselDestaques } from "@/components/CarrosselDestaques/CarrosselDestaques";
import { ImoveisPopulares } from "@/components/ImoveisPopulares/ImoveisPopulares";
import { ImoveisPromocao } from "@/components/moveisPromocao/ImoveisPromocao";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // IMPORTAÇÃO CORRETA

export function Home() {
  const navigate = useNavigate(); // USO DO HOOK CORRETO

  return (
    <SidebarProvider>
      <AppSidebar />
      <Header />
      <main>
        <SidebarTrigger />
        <section className="!pt-20 !p-4 space-y-8">
          <CarrosselDestaques />
          <ImoveisPopulares />
          <ImoveisPromocao />

          {/* Botão centralizado com navegação */}
          <div className="w-full flex justify-center">
            <Button
              onClick={() => navigate("/imoveis-venda")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded shadow-md"
            >
              Ver mais destaques
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    </SidebarProvider>
  );
}
