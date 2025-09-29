// src/components/PropertyDetails/MainCarousel.tsx
type CarrosselProps = {
  imagem: string;
};

const CarrosselPrincipal = ({ imagem }: CarrosselProps) => {
  const fullUrl = imagem.startsWith("http")
    ? imagem
    : `http://localhost:3333${imagem}`;

  return (
    <section
      className="
        w-full 
        !flex 
        !justify-center 
        !overflow-hidden 
        !pt-0 md:!pt-2   /* 👉 mobile encosta no topo, desktop mantém espaçamento */
      "
    >
      <div
        className="
          !w-full 
          md:!max-w-[1280px]   /* 👉 desktop centralizado */
          !px-0 md:!px-4       /* 👉 mobile sem padding, desktop com padding */
        "
      >
        <img
          src={fullUrl}
          alt="Imagem do imóvel"
          className="
            !w-full 
            !object-cover !object-center
            !h-[220px] sm:!h-[300px] lg:!h-[400px]
            !rounded-none md:!rounded-xl /* 👉 mobile sem borda, desktop com borda */
          "
        />
      </div>
    </section>
  );
};

export default CarrosselPrincipal;
