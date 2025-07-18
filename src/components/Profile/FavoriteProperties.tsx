import { Heart } from "lucide-react";

interface FavoriteProperty {
  id: number;
  titulo: string;
  cidade: string;
  preco: string;
  imagem: string;
}

interface FavoritePropertiesProps {
  favoritos: FavoriteProperty[];
}

export default function FavoriteProperties({ favoritos }: FavoritePropertiesProps) {
  return (
    <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
      <h3 className="!text-lg !font-semibold !mb-4 flex items-center gap-2">
        <Heart className="text-red-500" /> Imóveis Favoritos
      </h3>
      <div className="!grid !grid-cols-1 md:!grid-cols-2 gap-4">
        {favoritos.map((imovel) => (
          <div
            key={imovel.id}
            className="!bg-neutral-900 !rounded-lg overflow-hidden shadow"
          >
            <img
              src={imovel.imagem}
              alt={imovel.titulo}
              className="!w-full !h-40 !object-cover"
            />
            <div className="!p-4">
              <h4 className="!font-semibold !text-base mb-1">
                {imovel.titulo}
              </h4>
              <p className="!text-sm !text-neutral-400">{imovel.cidade}</p>
              <p className="!text-sm !text-green-500 !font-bold">{imovel.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
