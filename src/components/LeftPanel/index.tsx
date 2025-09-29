import { useState } from "react";
import { ImageIcon } from "lucide-react";
import Boneco from "@/assets/Boneco.png";

type Props = {
  previewSrc: string | null;
};

export default function LeftPanel({ previewSrc }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="lg:!col-span-1 !bg-white !rounded-2xl !shadow-sm !border !border-neutral-200 !p-6 !flex !flex-col !justify-between !h-full">
      {/* Bloco da imagem */}
      <div className="!w-full">
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Preview do Imóvel"
            className="!w-full !h-48 !object-cover !rounded-xl"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : (
          <div className="!w-full !h-48 !rounded-xl !bg-neutral-100 !flex !items-center !justify-center">
            <ImageIcon className="!h-10 !w-10 !text-neutral-400" />
          </div>
        )}

        <div className="!mt-4">
          <p className="!text-sm !font-medium">Imagem</p>

          {previewSrc && loaded && !error && (
            <div className="!mt-2 !text-xs !text-neutral-500 !space-y-1">
              <p>Formatos aceitos: JPG, PNG ou WEBP</p>
              <p>Dica: escolha uma foto clara e em boa qualidade</p>
            </div>
          )}

          {error && (
            <p className="!mt-2 !text-xs !text-red-600">
              Não foi possível carregar a imagem.
            </p>
          )}
        </div>
      </div>

      {/* Texto do meio */}
      <div className="!mt-6 !text-center">
        <p className="!text-base !font-semibold !text-neutral-800">
          Cadastre seu imóvel com rapidez e segurança 🚀
        </p>
        <p className="!text-sm !text-neutral-500 !mt-2">
          Mais de 10.000 clientes já confiam na nossa imobiliária 🏡
        </p>
      </div>

      {/* Boneco embaixo */}
      <div className="!mt-8 !flex !justify-center">
        <img src={Boneco} alt="Ilustração" className="!w-40 !h-auto" />
      </div>
    </div>
  );
}
