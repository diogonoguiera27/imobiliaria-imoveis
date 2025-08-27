import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { getFavoritedProperties } from "@/service/favoriteService";
import { Imovel } from "@/types";
import { useAuth } from "@/hooks/auth";

export default function FavoriteProperties() {
  const [favoritos, setFavoritos] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

  useEffect(() => {
    const carregarFavoritos = async () => {
      if (!token) {
        console.warn("🔒 Token ausente — usuário não autenticado.");
        setFavoritos([]);
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 Buscando imóveis favoritos...");
        const imoveisFavoritos = await getFavoritedProperties(token);
        console.log("✅ Imóveis favoritos encontrados:", imoveisFavoritos);
        setFavoritos(imoveisFavoritos);
      } catch (err) {
        console.error("❌ Erro ao buscar imóveis favoritos:", err);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarFavoritos();
  }, [token]);

  return (
    <div className="!rounded-xl !p-6 !shadow-xl !bg-gradient-to-br !from-white !via-red-50 !to-red-100">
      <h3 className="!text-lg !font-semibold !mb-4 !flex !items-center !gap-2 !text-gray-800">
        <Heart className="!text-red-500" /> Imóveis Favoritos
      </h3>

      {loading ? (
        <p className="text-gray-500">Carregando favoritos...</p>
      ) : favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <Heart size={48} className="mb-4 text-red-300" />
          <p className="text-lg font-medium">
            Você ainda não adicionou imóveis aos favoritos.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Explore os imóveis disponíveis e clique no{" "}
            <Heart className="inline text-red-400" size={16} /> para salvar seus
            preferidos!
          </p>
        </div>
      ) : (
        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
          {favoritos.map((imovel) => (
            <div
              key={imovel.id}
              className="!bg-white !rounded-lg !overflow-hidden !shadow-sm !border !border-red-100 hover:!shadow-md !transition !duration-200"
            >
              <img
                src={`${API_URL}${imovel.imagem}`}
                alt={`${imovel.tipo} em ${imovel.bairro}`}
                className="!w-full !h-40 !object-cover"
              />
              <div className="!p-4 !text-gray-800">
                <h4 className="!font-semibold !text-base !mb-1">
                  {imovel.tipo} para {imovel.tipoNegocio?.toLowerCase()}
                </h4>
                <p className="!text-sm !text-gray-600">
                  {imovel.endereco}, {imovel.bairro}
                </p>
                <p className="!text-sm !text-gray-500">{imovel.cidade}</p>
                {imovel.user?.nome && (
                  <p className="!text-xs !text-gray-700 !font-bold">
                    Proprietário:{" "}
                    <span className="font-medium">{imovel.user.nome}</span>
                  </p>
                )}
                <p className="!text-sm !text-green-600 !font-bold !mt-2">
                  R$ {imovel.preco.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
