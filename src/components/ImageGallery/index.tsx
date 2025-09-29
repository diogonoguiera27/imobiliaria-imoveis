type GaleriaInferiorProps = {
  imagensInferiores: { src: string; alt: string }[];
};

const GaleriaInferior = ({ imagensInferiores }: GaleriaInferiorProps) => {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full !max-w-[1280px] !px-4">
        <div className="!grid md:grid-cols-4 !gap-4 !items-start !pb-4">
          {imagensInferiores.map((img, index) => (
            <div key={index} className="overflow-hidden shadow-md rounded-xl">
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

export default GaleriaInferior;
