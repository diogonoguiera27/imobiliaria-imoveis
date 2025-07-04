import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HeroBanner, HighlightSection, SearchFilter } from "@/components/Home";
import { Footer } from "@/components/Footer";
import { imoveis as todosImoveis } from "@/data/imovel";
import { Imovel } from "@/types";

export function Home() {
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [imoveisFiltrados, setImoveisFiltrados] = useState<Imovel[]>([]);

const handleFiltrar = ({
  tipo,
  cidade,
  valorMax,
}: {
  tipo: string;
  cidade: string;
  valorMax: number;
}) => {
  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const cidadeNormalizadaFiltro = normalize(cidade);

  const resultado = todosImoveis.filter((imovel) => {
    const cidadeNormalizadaImovel = normalize(imovel.cidade);

    const tipoOk = tipo ? imovel.tipo === tipo : true;
    const cidadeOk = cidade
      ? cidadeNormalizadaImovel === cidadeNormalizadaFiltro
      : true;

    const precoOk = typeof imovel.preco === "number"
      ? imovel.preco <= valorMax
      : false;

    return tipoOk && cidadeOk && precoOk;
  });

  setImoveisFiltrados(resultado);
  setFiltroAtivo(true);
};

  const handleLimparFiltro = () => {
    setImoveisFiltrados([]);
    setFiltroAtivo(false);
  };

  return (
    <SidebarProvider>
      <div className="!min-h-screen flex !flex-col !overflow-x-hidden">
        <main className="flex-grow">
          <SidebarTrigger />
          <HeroBanner />
          <SearchFilter
            onFiltrar={handleFiltrar}
            onLimparFiltro={handleLimparFiltro}
          />

          {filtroAtivo ? (
            <div className="!px-10 !py-8">
              <h2 className="text-xl font-semibold mb-4">Resultados filtrados</h2>

              {imoveisFiltrados.length === 0 ? (
                <p className="!text-gray-600">Nenhum imóvel encontrado.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 !gap-6">
                  {imoveisFiltrados.map((imovel) => (
                    <div
                      key={imovel.id}
                      className="!border rounded-lg !shadow !overflow-hidden"
                    >
                      <img
                        src={imovel.imagem}
                        alt={`${imovel.tipo} em ${imovel.bairro}, ${imovel.cidade}`}
                        className="w-full !h-48 !object-cover"
                      />
                      <div className="!p-4">
                        <h3 className="!text-lg !font-bold">
                          {imovel.bairro}, {imovel.cidade}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {imovel.tipo} - {imovel.tipoNegocio}
                        </p>
                        <p className="!text-red-600 !font-semibold !mt-1">
                          R$ {imovel.preco.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <HighlightSection />
          )}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
