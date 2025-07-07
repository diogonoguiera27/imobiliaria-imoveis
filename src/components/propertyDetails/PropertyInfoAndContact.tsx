// src/components/PropertyDetails/DescricaoEContato.tsx
import { ContatoCard } from "../ContactFormCard";
import { DescricaoImovel } from "../PropertyDescriptionCard";

const DescricaoEContato = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full !max-w-[1280px] flex flex-col lg:flex-row lg:items-start gap-6 px-4">
      <div className="w-full lg:w-2/3">
        <DescricaoImovel />
      </div>
      <div className="w-full lg:w-1/3">
        <ContatoCard />
      </div>
    </div>
    </div>
  );
};

export default DescricaoEContato;
