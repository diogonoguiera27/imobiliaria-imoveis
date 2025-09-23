// src/pages/propertyDetails/EditProperty.tsx (ou src/pages/EditProperty/index.tsx)
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImageIcon } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Imovel } from "@/types";
import { buscarImovel } from "@/service/propertyService"; // ✅ atualizado
import PropertyForm from "@/components/PropertyForm/PropertyForm";
import Boneco from "@/assets/Boneco.png";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Imovel | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const previewRef = useRef<string | null>(null);
  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!id) {
        alert("Identificador do imóvel não informado.");
        navigate("/meus-imoveis");
        return;
      }

      try {
        // ✅ agora usa a função genérica que aceita id numérico ou uuid
        const imovel = await buscarImovel(id);

        if (isMounted) {
          setProperty(imovel);

          if (imovel.imagem) {
            let url = imovel.imagem;

            // normaliza URL da imagem
            if (!url.startsWith("http")) {
              if (url.startsWith("/uploads")) {
                url = `${import.meta.env.VITE_API_URL}${url}`;
              } else {
                url = `${import.meta.env.VITE_API_URL}/uploads/${url}`;
              }
            }

            setPreview(url);
          } else {
            setPreview(null);
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Erro ao carregar imóvel"
          );
        } else {
          alert("Erro ao carregar imóvel");
        }
        navigate("/meus-imoveis");
      }
    })();

    return () => {
      isMounted = false;
      if (previewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [id, navigate]);

  if (!property) {
    return (
      <SidebarProvider>
        <div className="!min-h-screen !flex !flex-col">
          <main className="!flex-1">
            <SidebarTrigger />
            <div className="!pt-[72px] !w-full !max-w-6xl !mx-auto !px-6 md:!px-10 !py-6">
              <p className="!text-red-600 font-medium">
                ❌ Imóvel não encontrado.
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col">
        <main className="!flex-1">
          <SidebarTrigger />

          <section className="!pt-[72px] !w-full">
            <div className="!max-w-6xl !mx-auto !p-6 lg:!p-20">
              {/* GRID responsivo */}
              <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0 lg:!items-stretch lg:!h-full !mt-4">
                {/* Painel esquerdo (oculto no mobile) */}
                <div className="hidden lg:!block lg:!col-span-1">
                  <div className="!h-full !bg-white !rounded-2xl !shadow-sm !border !border-neutral-200 !p-6 !flex !flex-col !items-center !justify-between">
                    <div className="!w-full">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview do Imóvel"
                          className="!w-full !h-48 !object-cover !rounded-xl"
                          onLoad={() => setImgLoaded(true)}
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="!w-full !h-48 !rounded-xl !bg-neutral-100 !flex !items-center !justify-center">
                          <ImageIcon className="!h-10 !w-10 !text-neutral-400" />
                        </div>
                      )}

                      <div className="!mt-4">
                        <p className="!text-sm !font-medium">Imagem</p>
                        {preview && imgLoaded && !imgError && (
                          <div className="!mt-2 !text-xs !text-neutral-500 !space-y-1">
                            <p>Formatos aceitos: JPG, PNG ou WEBP</p>
                            <p>Dica: escolha uma foto clara e em boa qualidade</p>
                          </div>
                        )}
                        {imgError && (
                          <p className="!mt-2 !text-xs !text-red-600">
                            Não foi possível carregar a imagem.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="!mt-6 !text-center">
                      <p className="!text-base !font-semibold !text-neutral-800">
                        Atualize as informações do seu imóvel 🛠️
                      </p>
                      <p className="!text-sm !text-neutral-500 !mt-2">
                        Mantenha seu anúncio sempre atualizado 📢
                      </p>
                    </div>

                    <div className="!mt-8">
                      <img
                        src={Boneco}
                        alt="Ilustração"
                        className="!w-40 !h-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Painel direito (formulário) */}
                <div className="lg:!col-span-2">
                  <Card className="!bg-white !rounded-2xl !shadow-sm !border !border-neutral-200">
                    <CardHeader className="!px-6 !py-4 !border-b !border-neutral-200">
                      <CardTitle className="!text-xl !font-semibold">
                        Editar Imóvel
                      </CardTitle>
                      <p className="!text-sm !text-neutral-500 !mt-1">
                        Atualize as informações do seu anúncio
                      </p>
                    </CardHeader>
                    <CardContent className="!px-0 !py-0">
                      <PropertyForm
                        mode="edit"
                        initialData={property}
                        onImageSelect={setPreview}
                        onSuccess={(updatedId) =>
                          navigate(`/meus-imoveis?updatedId=${updatedId}`, {
                            replace: true,
                          })
                        }
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
