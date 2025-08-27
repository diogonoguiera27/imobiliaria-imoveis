import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

import type { Imovel } from "@/types";
import { buscarImovelPorId } from "@/service/propertyService";
import PropertyForm from "@/components/PropertyForm/PropertyForm";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!id) {
        alert("ID do imóvel não informado.");
        navigate("/meus-imoveis");
        return;
      }
      try {
        const imovel = await buscarImovelPorId(Number(id));
        if (isMounted) setProperty(imovel);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Erro ao carregar imóvel"
          );
        }
        navigate("/meus-imoveis");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="!min-h-screen !flex !flex-col !overflow-x-hidden">
          <main className="!flex-1">
            <SidebarTrigger />
            <div className="!pt-[72px] !w-full">
              <div className="!max-w-6xl !mx-auto !px-6 md:!px-10 !py-6">
                <p className="!text-neutral-600">Carregando imóvel...</p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  if (!property) {
    return (
      <SidebarProvider>
        <div className="!min-h-screen !flex !flex-col !overflow-x-hidden">
          <main className="!flex-1">
            <SidebarTrigger />
            <div className="!pt-[72px] !w-full">
              <div className="!max-w-6xl !mx-auto !px-6 md:!px-10 !py-6">
                <p className="!text-red-600 font-medium">
                  ❌ Imóvel não encontrado.
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col !overflow-x-hidden">
        <main className="!flex-1">
          <SidebarTrigger />

          <section className="!pt-[72px] !w-full">
            <div className="!w-full !max-w-6xl !mx-auto !px-6 md:!px-10">
              {/* Cabeçalho no mesmo padrão dos cards */}
              <div className="!pb-3 !flex !items-start !justify-between">
                <div>
                  <h1 className="!text-2xl !font-semibold">Editar Imóvel</h1>
                  <p className="!text-sm !text-neutral-500">
                    Atualize as informações do seu anúncio
                  </p>
                </div>
              </div>

              {/* Card/Form */}
              <div className="!mt-6 !bg-white !rounded-xl !shadow-md !p-6 !border !border-neutral-200">
                <PropertyForm
                  mode="edit"
                  initialData={property}
                  onSuccess={(updatedId) =>
                    navigate(`/meus-imoveis?updatedId=${updatedId}`, {
                      replace: true,
                    })
                  }
                />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
