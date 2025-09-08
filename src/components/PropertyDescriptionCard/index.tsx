import { Ruler, Layout, BedDouble, Bath, Car } from "lucide-react";
import { Imovel } from "@/types";

type DescricaoImovelProps = {
  imovel: Imovel;
};

export function DescricaoImovel({ imovel }: DescricaoImovelProps) {
  return (
    <section className="w-full !flex !justify-start !px-4 !mt-2">
      <div className="w-full !max-w-5xl !pl-4 !bg-white !rounded-xl !shadow-md border !border-gray-200 p-6 !text-gray-800 space-y-8">
        
        
        <div className="!space-y-1">
          <h2 className=" !text-lg !font-semibold">
            {`${imovel.tipo} com ${imovel.quartos} quartos à venda em ${imovel.bairro} - ${imovel.cidade}`}
          </h2>
          <p className=" !text-gray-600 !text-lg">
            {`${imovel.endereco} - ${imovel.bairro} - ${imovel.cidade}`}
          </p>
        </div>

        
        <div className="!mt-4">
          <h3 className="!text-2xl !font-bold !text-gray-900">
            {imovel.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
        </div>

        
        <div className="grid !grid-cols-3 !sm:grid-cols-3 !md:grid-cols-4 !gap-4 !text-sm !text-gray-700 !mt-4">
          <div className="!flex !items-center !gap-2">
            <Ruler className="text-pink-600 !w-4 !h-4" />
            <span className="!font-medium">{imovel.metragem}m²</span>
            <span className="!text-gray-500 !text-lg">(Área total)</span>
          </div>

          {imovel.areaConstruida && (
            <div className="!flex !items-center !gap-2">
              <Layout className="text-pink-600 !w-4 !h-4" />
              <span className="!font-medium">{imovel.areaConstruida}m²</span>
              <span className="!text-gray-500 !text-lg">(Área construída)</span>
            </div>
          )}

          <div className="!flex !items-center !gap-2">
            <BedDouble className="text-pink-600 !w-4 !h-4" />
            <span className="!font-medium">{imovel.quartos}</span>
            <span className="!text-gray-500 text-lg">Quartos</span>
          </div>

          {imovel.suites !== null && (
            <div className="!flex !items-center !gap-2">
              <Bath className="text-pink-600 !w-4 !h-4" />
              <span className="!font-medium">{imovel.suites}</span>
              <span className="!text-gray-500 !text-lg">Suítes</span>
            </div>
          )}

          <div className="!flex !items-center !gap-2">
            <Car className="text-pink-600 !w-4 !h-4" />
            <span className="!font-medium">{imovel.vagas}</span>
            <span className="!text-gray-500 !text-lg">Vagas</span>
          </div>
        </div>

        
        <div className="!space-y-3">
          <hr className="w-full !border-t !border-gray-300 !my-4 !mt-4" />
          <h4 className="!text-base !font-semibold">Sobre o imóvel</h4>
          <p className="!text-lg !text-gray-600 !leading-relaxed">
            {imovel.descricao ||
              "O imóvel é espaçoso e bem iluminado, com excelente localização próxima a comércios e transporte público. Ideal para famílias que buscam conforto e praticidade."}
          </p>
        </div>

        
        <hr className="!w-full !border-t !border-gray-300 !my-4 !mt-4" />
        
        
        {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
        <div>
          <h3 className="!text-lg !font-medium !mb-2">Características</h3>
          <ul className="!grid !grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 !gap-2 !text-lg">
            {imovel.caracteristicas.map((item, index) => (
              <li
                key={index}
                className="!px-3 !py-1 !bg-muted !rounded-full !text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </section>
  );
}
