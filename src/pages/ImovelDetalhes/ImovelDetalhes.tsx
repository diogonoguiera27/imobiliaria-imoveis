import img1 from "@/assets/a.jpg";
import img2 from "@/assets/b.jpeg";
import img3 from "@/assets/c.jpg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImoveisPopulares } from "@/components/ImoveisPopulares/ImoveisPopulares";
import { DescricaoImovel } from "@/components/DescricaoImovel/DescricaoImovel";
import { ContatoCard } from "@/components/ContatoCard/ContatoCard";


export function ImovelDetalhes() {
  const imagens = [
    {
      src: img1,
      alt: "Fachada",
    },
    {
      src: img3,
      alt: "Sala",
    },
  ];
  const imagensInferiores = [
    {
      src: img1,
      alt: "Cozinha 1",
    },
    {
      src: img2,
      alt: "Cozinha 2",
    },
    {
      src: img3,
      alt: "Quarto",
    },
  ];

  return (
    <>
      <section className="w-screen overflow-hidden ">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="flex gap-x-2">
            {imagens.map((img, index) => (
              <CarouselItem key={index} className="basis-full md:basis-1/2 p-0">
                <Card className="rounded-none shadow-none border-none">
                  <CardContent className="p-0">
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "350px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2" />
          <CarouselNext className="-right-2" />
        </Carousel>
        <div className="h-2 md:h-2" />
      </section>

      {/* Galeria inferior com espaçamento superior maior */}
      <section className="w-screen mt-6 px-4">
        <div className="grid md:grid-cols-4 gap-4 max-w-7xl mx-auto items-start">
          {/* Galeria de imagens inferior */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imagensInferiores.map((img, index) => (
              <div key={index} className="overflow-hidden shadow-md rounded-xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "12px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="h-4 md:h-4" />
      </section>

      {/* Descrição e Contato lado a lado */}
      <section className="w-full px-4 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <DescricaoImovel />
          </div>
          <div className="w-full lg:w-1/3">
            <ContatoCard />
          </div>
        </div>
      </section>

      <section className="w-full !px-4 !mt-16 !mb-6">
        <div className="!max-w-6xl !mx-auto !mt-4 text-center">
          <hr className="w-full !border-t !border-gray-300 my-4 !mt-4" />
          <h2 className="!text-xl !font-semibold !text-gray-900 !border-b !border-gray-300 !pb-2">
            Imóveis Similares
          </h2>
        </div>
      </section>
      

      <ImoveisPopulares />
    </>
  );
}
