
import img1 from "@/assets/a.jpg";
import img2 from "@/assets/b.jpeg";
import img3 from "@/assets/c.jpg";

import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { imoveis } from "@/data/imovel";

import {
  ImageGallery,
  MainCarousel,
  PropertyInfoAndContact,
  SimilarProperties,
} from "@/components/PropertyDetails/";



export function ImovelDetalhes() {
  const imagens = [
    { src: img1, alt: "Fachada" },
    { src: img3, alt: "Sala" },
  ];

  const imagensInferiores = [
    { src: img1, alt: "Cozinha 1" },
    { src: img2, alt: "Cozinha 2" },
    { src: img3, alt: "Quarto 1" },
    { src: img3, alt: "Quarto 2" },
  ];

  const imovelAtual = imoveis.find((imovel) => imovel.id === 1)!;
  
  return (
    <SidebarProvider>
      <div className="flex !flex-col !w-screen !overflow-x-hidden">
        <SidebarTrigger />
        <main className="flex-grow">
          <div className="w-full !max-w-[80%] !mx-auto px-4 !mt-6">
            <MainCarousel imagens={imagens} />
            <ImageGallery imagensInferiores={imagensInferiores} />
            <PropertyInfoAndContact />
            <SimilarProperties imovelAtual={imovelAtual} />
          </div>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
