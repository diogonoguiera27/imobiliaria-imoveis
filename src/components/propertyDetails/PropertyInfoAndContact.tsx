// src/components/PropertyDetails/PropertyInfoAndContact/index.tsx
import { ContatoCard } from "../ContactFormCard";
import { DescricaoImovel } from "../PropertyDescriptionCard";
import { Imovel } from "@/types";

type Props = {
  imovel: Imovel;
};

const DescricaoEContato = ({ imovel }: Props) => {
  return (
    <section className="w-full flex justify-center">
      <div
        className="
          w-full max-w-[1280px] 
          flex flex-col lg:flex-row 
          gap-8 lg:gap-6
          px-4 sm:px-6 md:px-8
        "
      >
        {/* Descrição → sempre 100% no mobile, 2/3 no desktop */}
        <div className="w-full lg:w-2/3">
          <DescricaoImovel imovel={imovel} />
        </div>

        {/* Contato → aparece abaixo no mobile, 1/3 no desktop */}
        <div className="w-full lg:w-1/3">
          <ContatoCard imovel={imovel} />
        </div>
      </div>
    </section>
  );
};

export default DescricaoEContato;
