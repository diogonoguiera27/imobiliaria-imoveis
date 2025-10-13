// ✅ src/components/MainCarousel.tsx
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
        !w-full 
        !flex 
        !justify-center 
        !overflow-hidden 
        !mt-[14px]
        !pt-0 md:!pt-2
      "
    >
      {/* ✅ container ocupa 100% do pai (que já é 80%) */}
      <div className="!w-full !px-0">
        <img
          src={fullUrl}
          alt="Imagem do imóvel"
          className="
            !w-full 
            !object-cover !object-center
            !h-[220px] sm:!h-[300px] lg:!h-[400px]
            !rounded-none md:!rounded-xl
            !transition-all !duration-300 hover:!scale-[1.01]
            !shadow-md md:!shadow-lg
          "
        />
      </div>
    </section>
  );
};

export default CarrosselPrincipal;
