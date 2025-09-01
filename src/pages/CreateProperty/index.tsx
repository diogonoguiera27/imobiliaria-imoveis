import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react"; // 👈 ícone opcional

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Boneco from "@/assets/Boneco.png";
import SidebarTrigger, { SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import PropertyForm from "@/components/PropertyForm/PropertyForm";

export default function CreatePropertyPage() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <SidebarProvider>
      <div className="!w-screen ">
        <SidebarTrigger />

        <div className="!max-w-6xl !mx-auto !p-20">
          <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0">
            {/* Coluna Esquerda */}
            <div className="lg:!col-span-1 !bg-white !rounded-2xl !shadow-sm !border !border-neutral-200 !p-6 !flex !flex-col !items-center !justify-between">
              {/* Imagem do imóvel */}
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
                  // Placeholder quando não tem imagem
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

              {/* Mensagens institucionais */}
              <div className="!mt-6 !text-center">
                <p className="!text-base !font-semibold !text-neutral-800">
                  Cadastre seu imóvel com rapidez e segurança 🚀
                </p>
                <p className="!text-sm !text-neutral-500 !mt-2">
                  Mais de 10.000 clientes já confiam na nossa imobiliária 🏡
                </p>
              </div>

              {/* Boneco/Ilustração */}
              <div className="!mt-8">
                <img src={Boneco} alt="Ilustração" className="!w-40 !h-auto" />
              </div>
            </div>

            {/* Coluna Direita - Formulário */}
            <div className="lg:!col-span-2">
              <Card className="!bg-white !rounded-2xl !shadow-sm !border !border-neutral-200">
                <CardHeader className="!px-6 !py-4 !border-b !border-neutral-200">
                  <CardTitle className="!text-xl !font-semibold">
                    Cadastrar Imóvel
                  </CardTitle>
                  <p className="!text-sm !text-neutral-500 !mt-1">
                    Preencha os dados do imóvel abaixo
                  </p>
                </CardHeader>
                <CardContent className="!px-0 !py-0">
                  <PropertyForm onImageSelect={setPreview} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
