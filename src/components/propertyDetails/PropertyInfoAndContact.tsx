import { ContatoCard } from "../ContactFormCard";
import { DescricaoImovel } from "../PropertyDescriptionCard";

 const DescricaoEContato = () => {
  return (
    <section className="w-full px-4 mt-2">
      <div className="max-w-[1280px] !mx-auto flex flex-col lg:flex-row !gap-6 items-start">
        <div className="w-full lg:w-2/3">
          <DescricaoImovel />
        </div>
        <div className="w-full lg:w-1/3">
          <ContatoCard />
        </div>
      </div>
    </section>
  );
};

export default DescricaoEContato;