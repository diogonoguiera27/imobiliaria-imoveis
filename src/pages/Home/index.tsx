import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CarrosselDestaques } from "@/components/CarrosselDestaques/CarrosselDestaques";
import { ImoveisPopulares } from "@/components/ImoveisPopulares/ImoveisPopulares";
import { ImoveisPromocao } from "@/components/moveisPromocao/ImoveisPromocao";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // IMPORTAÇÃO CORRETA
import { BannerInicial } from "@/components/BannerInicial/BannerInicial";
import { FiltroBusca } from "@/components/FiltroBusca/FiltroBusca";

export function Home() {
  const navigate = useNavigate(); // USO DO HOOK CORRETO
  

  return (
    <SidebarProvider>
      <AppSidebar  />
      <main>
        <SidebarTrigger />

        <BannerInicial />
        <FiltroBusca/>
        <section className="!p-4 ">
          <CarrosselDestaques />
          <ImoveisPopulares />
          <ImoveisPromocao />

          {/* Botão centralizado com navegação */}
          <div className="w-full !flex !justify-center !mt-12">
            <Button
              onClick={() => navigate("/imoveis-venda")}
              className="!bg-red-500 !text-white !font-semibold !px-6 !py-3 !rounded !shadow-md hover:!bg-red-700 transition-colors duration-200"
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
