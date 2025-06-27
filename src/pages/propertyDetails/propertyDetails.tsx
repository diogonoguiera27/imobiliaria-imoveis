import img1 from "@/assets/a.jpg";
import img2 from "@/assets/b.jpeg";
import img3 from "@/assets/c.jpg";

import { Footer } from "@/components/Footer/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ImoveisPopulares } from "@/components/home/PopularProperties";
import { CarrosselPrincipal } from "@/components/propertyDetails/MainCarousel";
import { GaleriaInferior } from "@/components/propertyDetails/ImageGallery";
import { DescricaoEContato } from "@/components/propertyDetails/PropertyInfoAndContact";
import { ImoveisSimilares } from "@/components/propertyDetails/SimilarProperties";

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <SidebarTrigger />
        <main className="flex-grow">
          <CarrosselPrincipal imagens={imagens} />
          <GaleriaInferior imagensInferiores={imagensInferiores} />
          <DescricaoEContato />
          <ImoveisSimilares />
          <ImoveisPopulares />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
