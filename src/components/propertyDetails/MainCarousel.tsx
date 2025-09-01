type CarrosselProps = {
  imagem: string;
};

const CarrosselPrincipal = ({ imagem }: CarrosselProps) => {
  const fullUrl = imagem.startsWith("http")
    ? imagem
    : `http://localhost:3333${imagem}`;

  return (
    <section className="w-full flex !justify-center !overflow-hidden !pt-2 ">
      <div className="!w-full !max-w-[1280px] !px-4">
        <img
          src={fullUrl}
          alt="Imagem do imóvel"
          className="!w-full !h-[400px] !object-cover !object-center !rounded-xl"
        />
      </div>
    </section>
  );
};

export default CarrosselPrincipal;
