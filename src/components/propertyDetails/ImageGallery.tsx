type GaleriaInferiorProps = {
  imagensInferiores: { src: string; alt: string }[];
};

export const GaleriaInferior = ({ imagensInferiores }: GaleriaInferiorProps) => {
  return (
    <section className="!w-screen mt-6 px-4 ">
      <div className="!grid !md:grid-cols-4 !gap-4 !max-w-7xl !mx-auto !items-start">
        <div className="flex gap-4 pb-2 pl-4 !justify-center !max-w-full">
          {imagensInferiores.map((img, index) => (
            <div
              key={index}
              className="min-w-[300px] overflow-hidden shadow-md rounded-xl"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="!w-full !h-[220px] !object-cover !object-center !rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-4 md:h-4" />
    </section>
  );
};