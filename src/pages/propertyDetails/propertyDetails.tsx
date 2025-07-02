import img1 from "@/assets/a.jpg";
import img2 from "@/assets/b.jpeg";
import img3 from "@/assets/c.jpg";

import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PopularProperties} from "@/components/Home";
import {
  ImageGallery,
  MainCarousel,
  PropertyInfoAndContact,
  SimilarProperties,
} from "@/components/PropertyDetails/index";

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
          <MainCarousel imagens={imagens} />
          <ImageGallery imagensInferiores={imagensInferiores} />
          <PropertyInfoAndContact />
          <SimilarProperties />
          <PopularProperties/>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
