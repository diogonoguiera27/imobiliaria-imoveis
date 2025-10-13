// ✅ src/components/PropertyDetails/PropertyInfoAndContact/index.tsx
import { ContatoCard } from "../ContactFormCard";
import { DescricaoImovel } from "../PropertyDescriptionCard";
import { Imovel } from "@/types";

type Props = {
  imovel: Imovel;
};

const DescricaoEContato = ({ imovel }: Props) => {
  return (
    <section className="!w-full !flex !justify-center !mt-8">
      <div
        className="
          !w-full 
         
          !mx-auto             /* ✅ centralizado horizontalmente */
          !flex !flex-col lg:!flex-row 
          !gap-8 lg:!gap-6
          !px-0                /* ✅ sem padding lateral extra */
        "
      >
        {/* 🏠 Descrição → 100% no mobile, 2/3 no desktop */}
        <div className="!w-full lg:!w-2/3">
          <DescricaoImovel imovel={imovel} />
        </div>

        {/* 📞 Contato → abaixo no mobile, 1/3 no desktop */}
        <div className="!w-full lg:!w-1/3">
          <ContatoCard imovel={imovel} />
        </div>
      </div>
    </section>
  );
};

export default DescricaoEContato;
