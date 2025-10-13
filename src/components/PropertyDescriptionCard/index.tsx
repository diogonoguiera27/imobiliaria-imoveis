import { Ruler, Layout, BedDouble, Bath, Car } from "lucide-react";
import { Imovel } from "@/types";

type DescricaoImovelProps = {
  imovel: Imovel;
};

export function DescricaoImovel({ imovel }: DescricaoImovelProps) {
  return (
    <section className="!w-full !flex !justify-center !mt-2">
      <div className="!w-full !flex !flex-col  !mx-auto">
        {/* ===== DESKTOP ===== */}
        <div
          className="
            hidden md:block
            !w-full
            !bg-white !rounded-xl !shadow-md
            !border !border-gray-200
            !p-8
            !text-gray-800 !space-y-10
            !mx-auto
            !transition-all !duration-300
          "
        >
          {/* 🏷️ Título */}
          <div className="!space-y-1">
            <h2 className="!text-xl !font-semibold">
              {`${imovel.tipo} com ${imovel.quartos} quartos à venda em ${imovel.bairro} - ${imovel.cidade}`}
            </h2>
            <p className="!text-gray-600 !text-base">
              {`${imovel.endereco} - ${imovel.bairro} - ${imovel.cidade}`}
            </p>
          </div>

          {/* 💰 Preço */}
          <div>
            <h3 className="!text-3xl !font-bold !text-gray-900">
              {imovel.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h3>
          </div>

          {/* 📐 Características grid */}
          <div className="!grid !grid-cols-3 md:!grid-cols-4 lg:!grid-cols-5 !gap-6 !text-sm !text-gray-700">
            <div className="!flex !items-center !gap-2">
              <Ruler className="text-pink-600 !w-4 !h-4" />
              <span className="!font-medium">{imovel.metragem}m²</span>
              <span className="!text-gray-500">(Área total)</span>
            </div>

            {imovel.areaConstruida && (
              <div className="!flex !items-center !gap-2">
                <Layout className="text-pink-600 !w-4 !h-4" />
                <span className="!font-medium">{imovel.areaConstruida}m²</span>
                <span className="!text-gray-500">(Área construída)</span>
              </div>
            )}

            <div className="!flex !items-center !gap-2">
              <BedDouble className="text-pink-600 !w-4 !h-4" />
              <span className="!font-medium">{imovel.quartos}</span>
              <span className="!text-gray-500">Quartos</span>
            </div>

            {imovel.suites !== null && (
              <div className="!flex !items-center !gap-2">
                <Bath className="text-pink-600 !w-4 !h-4" />
                <span className="!font-medium">{imovel.suites}</span>
                <span className="!text-gray-500">Suítes</span>
              </div>
            )}

            <div className="!flex !items-center !gap-2">
              <Car className="text-pink-600 !w-4 !h-4" />
              <span className="!font-medium">{imovel.vagas}</span>
              <span className="!text-gray-500">Vagas</span>
            </div>
          </div>

          {/* 📝 Descrição */}
          <div className="!space-y-3">
            <hr className="!border-t !border-gray-300" />
            <h4 className="!text-base !font-semibold">Sobre o imóvel</h4>
            <p className="!text-base !text-gray-600 !leading-relaxed">
              {imovel.descricao ||
                "O imóvel é espaçoso e bem iluminado, com excelente localização próxima a comércios e transporte público. Ideal para famílias que buscam conforto e praticidade."}
            </p>
          </div>

          {/* 🔹 Características extras */}
          {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
            <>
              <hr className="!border-t !border-gray-300" />
              <div>
                <h3 className="!text-lg !font-medium !mb-3">Características</h3>
                <ul className="!grid !grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 !gap-3 !text-sm">
                  {imovel.caracteristicas.map((item, index) => (
                    <li
                      key={index}
                      className="!px-3 !py-1 !bg-gray-100 !rounded-full !text-gray-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* ===== MOBILE ===== */}
        <div
          className="
            block md:hidden
            !w-full
            !px-3 
            !mx-auto
            !space-y-6 !text-gray-800
          "
        >
          {/* 🏷️ Título */}
          <div className="!space-y-1">
            <h2 className="!text-lg !font-semibold">
              {`${imovel.tipo} com ${imovel.quartos} quartos à venda em ${imovel.bairro} - ${imovel.cidade}`}
            </h2>
            <p className="!text-gray-600 !text-sm">
              {`${imovel.endereco} - ${imovel.bairro} - ${imovel.cidade}`}
            </p>
          </div>

          {/* 💰 Preço */}
          <div>
            <h3 className="!text-2xl !font-bold !text-gray-900">
              {imovel.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h3>
          </div>

          {/* 📋 Lista alinhada */}
          <div className="!mt-4 !space-y-3">
            <div className="!flex !items-center !justify-between">
              <div className="!flex !items-center !gap-2">
                <Ruler className="text-pink-600 !w-5 !h-5" />
                <span className="!font-medium">Área total</span>
              </div>
              <span className="!font-semibold">{imovel.metragem} m²</span>
            </div>

            {imovel.areaConstruida && (
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-2">
                  <Layout className="text-pink-600 !w-5 !h-5" />
                  <span className="!font-medium">Área construída</span>
                </div>
                <span className="!font-semibold">
                  {imovel.areaConstruida} m²
                </span>
              </div>
            )}

            <div className="!flex !items-center !justify-between">
              <div className="!flex !items-center !gap-2">
                <BedDouble className="text-pink-600 !w-5 !h-5" />
                <span className="!font-medium">Quartos</span>
              </div>
              <span className="!font-semibold">{imovel.quartos}</span>
            </div>

            {imovel.suites !== null && (
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-2">
                  <Bath className="text-pink-600 !w-5 !h-5" />
                  <span className="!font-medium">Suítes</span>
                </div>
                <span className="!font-semibold">{imovel.suites}</span>
              </div>
            )}

            <div className="!flex !items-center !justify-between">
              <div className="!flex !items-center !gap-2">
                <Car className="text-pink-600 !w-5 !h-5" />
                <span className="!font-medium">Vagas</span>
              </div>
              <span className="!font-semibold">{imovel.vagas}</span>
            </div>
          </div>

          {/* 📝 Descrição */}
          <div className="!space-y-3 !mt-6">
            <hr className="!border-t !border-gray-300" />
            <h4 className="!text-base !font-semibold">Sobre o imóvel</h4>
            <p className="!text-base !text-gray-600 !leading-relaxed">
              {imovel.descricao ||
                "O imóvel é espaçoso e bem iluminado, com excelente localização próxima a comércios e transporte público. Ideal para famílias que buscam conforto e praticidade."}
            </p>
          </div>

          {/* 🔹 Características extras */}
          {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
            <>
              <hr className="!border-t !border-gray-300" />
              <div>
                <h3 className="!text-lg !font-medium !mb-2">Características</h3>
                <ul className="!grid !grid-cols-2 !gap-3 !text-sm">
                  {imovel.caracteristicas.map((item, index) => (
                    <li
                      key={index}
                      className="!px-3 !py-1 !bg-gray-100 !rounded-full !text-gray-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
