// ✅ src/pages/propertyDetails/EditProperty.tsx (ou src/pages/EditProperty/index.tsx)
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ImageIcon } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

import type { Imovel } from "@/types";
import { buscarImovel } from "@/service/propertyService";
import PropertyFormCreate from "@/components/PropertyFormCreate";
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

  // 🔹 Carregar imóvel
  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!id) {
        alert("Identificador do imóvel não informado.");
        navigate("/meus-imoveis");
        return;
      }

      try {
        const imovel = await buscarImovel(id);

        if (isMounted) {
          setProperty(imovel);

          if (imovel.imagem) {
            let url = imovel.imagem;

            // Normaliza a URL da imagem
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

  // 🔹 Caso o imóvel não exista
  if (!property) {
    return (
      <SidebarProvider>
        <div className="!min-h-screen !flex !flex-col">
          <main className="!flex-1">
            <SidebarTrigger />
            <div className="!pt-[72px] !w-[95%] md:!w-[80%] !mx-auto !py-6">
              <p className="!text-red-600 font-medium">❌ Imóvel não encontrado.</p>
            </div>
          </main>
          <FooterDesktop variant="list" />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="!w-screen !min-h-screen !flex !flex-col !overflow-x-hidden">
        <SidebarTrigger />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="!flex-1 !flex !flex-col">
          <section className="!pt-[72px] !w-full">
            {/* 🔹 Container central padronizado */}
            <div className="!w-[95%] md:!w-[80%] !mx-auto !p-0 md:!p-4 !pb-12">
              <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0 lg:!items-stretch lg:!h-full !mt-4">
                {/* Painel esquerdo (desktop) */}
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
                      <img src={Boneco} alt="Ilustração" className="!w-40 !h-auto" />
                    </div>
                  </div>
                </div>

                {/* Formulário de Edição */}
                <div className="lg:!col-span-2">
                  <Card className="!bg-white !rounded-2xl !shadow-sm !border !border-neutral-200">
                    <CardHeader className="!px-6 !py-4 !border-b !border-neutral-200">
                      <CardTitle className="!text-xl !font-semibold">Editar Imóvel</CardTitle>
                      <p className="!text-sm !text-neutral-500 !mt-1">
                        Atualize as informações do seu anúncio
                      </p>
                    </CardHeader>
                    <CardContent className="!px-0 !py-0">
                      <PropertyFormCreate
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

        {/* 🔹 Footer fixo no fim da tela */}
        <div className="!mt-auto">
          <FooterDesktop variant="list" />
        </div>

        {/* 🔹 Bottom bar (mobile) */}
        <div className="!block !md:hidden !mt-8">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
