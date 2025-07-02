import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type CarrosselProps = {
  imagens: { src: string; alt: string }[];
};

 const CarrosselPrincipal = ({ imagens }: CarrosselProps) => {
  return (
    <section className="w-full overflow-hidden">
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="flex gap-x-2">
          {imagens.map((img, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 p-0"
            >
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
  );
};

export default  CarrosselPrincipal;