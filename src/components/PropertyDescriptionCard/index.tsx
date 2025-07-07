import { Ruler, Layout, BedDouble, Bath, Car, Building2 } from "lucide-react";

export function DescricaoImovel() {
  return (
    <section className="w-full !flex !justify-start !px-4 !mt-2">
      <div className="w-full !max-w-5xl !pl-4 !bg-white !rounded-xl !shadow-md border !border-gray-200 p-6 !text-gray-800 space-y-8">
        
        <div className="!space-y-1">
          <h2 className="!text-lg !font-semibold">
            Apartamento com 3 quartos à venda em Vila Nova Conceição - SP
          </h2>
          <p className="!text-sm !text-gray-600 ">
            Rua Bueno Brandão - Vila Nova Conceição - São Paulo/SP
          </p>
        </div>

        
        <div className="!mt-4">
          <h3 className="!text-2xl !font-bold !text-gray-900">R$ 2.700.000</h3>
          <p className="!text-xs !text-gray-500">R$ 26.377 preço do m²</p>
          <p className="!text-xs !text-gray-700">
            <span className="!font-semibold">Condomínio:</span> R$ 1.730
            &nbsp;&nbsp;
            <span className="!font-semibold">IPTU:</span> R$ 525
          </p>
        </div>

        
        <div className="grid !grid-cols-3 !sm:grid-cols-3 !md:grid-cols-4 !gap-4 !text-sm !text-gray-700 !mt-4">
          <div className="flex items-center gap-2">
            <Ruler className="text-pink-600 w-4 h-4" />
            <span className="font-medium">181m²</span>
            <span className="text-gray-500">(Área total)</span>
          </div>

          <div className="!flex !items-center !gap-2">
            <Layout className="text-pink-600 w-4 h-4" />
            <span className="!font-medium">102m²</span>
            <span className="!text-gray-500">(Área construída)</span>
          </div>

          <div className="!flex !items-center !gap-2">
            <BedDouble className="text-pink-600 w-4 h-4" />
            <span className="!font-medium">3</span>
            <span className="!text-gray-500">Dormitórios</span>
          </div>

          <div className="!flex !items-center !gap-2">
            <Bath className="text-pink-600 w-4 h-4" />
            <span className="!font-medium">2</span>
            <span className="!text-gray-500">Suítes</span>
          </div>

          <div className="!flex !items-center !gap-2">
            <Car className="text-pink-600 !w-4 !h-4" />
            <span className="!font-medium">2</span>
            <span className="!text-gray-500">Vagas</span>
          </div>

          <div className="!flex !items-center !gap-2">
            <Building2 className="text-pink-600 !w-4 !h-4" />
            <span className="!font-medium">9º</span>
            <span className="!text-gray-500">Andar</span>
          </div>
        </div>
       
        <div className="!space-y-3">
          <hr className="w-full !border-t !border-gray-300 !my-4 !mt-4" />
          <h4 className="!text-base !font-semibold">Sobre o imóvel</h4>
          <p className="!text-sm !text-gray-600 !leading-relaxed">
            O imóvel é espaçoso e bem iluminado, com excelente localização
            próxima a comércios e transporte público. Ideal para famílias que
            buscam conforto e praticidade.
          </p>
          <a
            href="#"
            className="!text-red-600 !text-sm !font-medium !hover:underline"
          >
            Ver mais
          </a>
        </div>

        <hr className="!w-full !border-t !border-gray-300 !my-4 !mt-4" />

        
        <div className="!space-y-3">
          <h4 className="!text-base !font-semibold !mt-4">
            Instalações do condomínio
          </h4>
          <div className="grid !grid-cols-2 !sm:grid-cols-3 !md:grid-cols-4 !gap-y-2 !text-sm !text-gray-600">
            <span>🏋️ Academia de ginástica</span>
            <span>🚲 Bicicletário</span>
            <span>🎮 Brinquedoteca</span>
            <span>🔥 Churrasqueira</span>
            <span>🍴 Espaço gourmet</span>
            <span>🏊‍♂️ Piscina</span>
            <span>🛋️ Lounge</span>
            <span>🧸 Playground</span>
            <span>🛎️ Lobby</span>
          </div>
          <a
            href="#"
            className="!text-red-600 !text-sm !font-medium !hover:underline"
          >
            Ver mais
          </a>
        </div>

        <hr className="w-full !border-t !border-gray-300 !my-4 !mt-4" />

        
        <div className="!space-y-4">
          <h4 className="!text-base !font-semibold !mt-4">
            Nas proximidades do imóvel
          </h4>
          <div className="grid md:grid-cols-2 !gap-6 text-sm !text-gray-700">
            
            <div className="!space-y-2">
              <h5 className="!font-semibold !text-black">🍽️ Gastronomia</h5>
              <div className="flex flex-col">
                <span>Salsa Restaurante</span>
                <span className="!text-gray-500 !text-xs">16m</span>
              </div>
              <div className="flex flex-col">
                <span>Haraguni Restaurante</span>
                <span className="!text-gray-500 text-xs">96m</span>
              </div>
            </div>

            
            <div className="space-y-2">
              <h5 className="!font-semibold !text-black">🎓 Educação</h5>
              <div className="flex flex-col">
                <span>Fundação Escola De Comércio</span>
                <span className="!text-gray-500 !text-xs">431m</span>
              </div>
              <div className="flex flex-col">
                <span>Colégio Vectra</span>
                <span className="!text-gray-500 !text-xs">435m</span>
              </div>
            </div>

            
            <div className="!space-y-2">
              <h5 className="!font-semibold !text-black">
                🩺 Saúde e Bem-estar
              </h5>
              <div className="flex flex-col">
                <span>Escola de Ginástica e Dança</span>
                <span className="!text-gray-500 !text-xs">234m</span>
              </div>
              <div className="flex flex-col">
                <span>Hospital Saint Paul</span>
                <span className="!text-gray-500 !text-xs">380m</span>
              </div>
            </div>

            
            <div className="!space-y-2">
              <h5 className="!font-semibold !text-black">🎯 Lazer</h5>
              <div className="flex flex-col">
                <span>Raposo Shopping</span>
                <span className="!text-gray-500 !text-xs">305m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
