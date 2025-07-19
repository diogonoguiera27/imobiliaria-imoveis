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
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <Heart className="!text-red-500" /> Imóveis Favoritos
      </h3>

      <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
        {favoritos.map((imovel) => (
          <div
            key={imovel.id}
            className="!bg-white !rounded-lg !overflow-hidden !shadow-sm !border !border-red-100 hover:!shadow-md !transition !duration-200"
          >
            <img
              src={imovel.imagem}
              alt={imovel.titulo}
              className="!w-full !h-40 !object-cover"
            />
            <div className="!p-4 !text-gray-800">
              <h4 className="!font-semibold !text-base !mb-1">{imovel.titulo}</h4>
              <p className="!text-sm !text-gray-600">{imovel.cidade}</p>
              <p className="!text-sm !text-green-600 !font-bold">{imovel.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
