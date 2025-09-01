// src/pages/propertyDetails/index.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { buscarImovelPorId, buscarImoveisSimilares } from "@/service/propertyService";
import { Imovel } from "@/types";

import {
  MainCarousel,
  PropertyInfoAndContact,
  SimilarProperties,
} from "@/components/PropertyDetails/";

export function ImovelDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [similares, setSimilares] = useState<Imovel[]>([]);

  useEffect(() => {
    if (id) {
      const carregarImovel = async () => {
        try {
          const dados = await buscarImovelPorId(Number(id));
          setImovel(dados);

          const similares = await buscarImoveisSimilares(Number(id));
          console.log("Similares encontrados:", similares);
          setSimilares(similares);
        } catch (err) {
          console.error("Erro ao buscar imóvel:", err);
        }
      };

      carregarImovel();
    }
  }, [id]);

  if (!imovel) {
    return (
      <SidebarProvider>
        <div className="flex !flex-col !w-screen !overflow-x-hidden">
          <SidebarTrigger />
          <main className="flex-grow">
            <div className="w-full !max-w-[80%] !mx-auto px-4 !mt-6">
              <p className="text-red-500">Carregando imóvel...</p>
            </div>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex !flex-col !w-screen !overflow-x-hidden">
        <SidebarTrigger />
        <main className="!flex-grow !mt-10">
          <div className="w-full !max-w-[80%] !mx-auto !px-4 !mt-6">
            <MainCarousel imagem={imovel.imagem} />
            <PropertyInfoAndContact imovel={imovel} />
            {similares.length > 0 && <SimilarProperties imoveis={similares} />}
          </div>
        </main>
        <div className="!mt-4">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
