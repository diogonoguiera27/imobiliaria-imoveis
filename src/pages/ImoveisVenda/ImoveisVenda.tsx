import {
  FaRulerCombined,
  FaBed,
  FaCar,
  FaBath,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const imoveisVenda = [
  {
    id: 1,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "",
  },
  {
    id: 2,
    imagem:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    titulo: "Vila Darcy Penteado, São Roque",
    endereco: "Estrada Darcy Penteado",
    metragem: 600,
    quartos: 4,
    banheiros: 7,
    vagas: 4,
    preco: "Aluguel de R$ 15.000/mês",
    infoExtra: "Cond. R$ 3.000",
  },
  {
    id: 3,
    imagem:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    titulo: "Guarajuba (Monte Gordo), Camaçari",
    endereco: "Rua Arraia",
    metragem: 450,
    quartos: 7,
    banheiros: 5,
    vagas: 2,
    preco: "R$ 3.000.000",
    infoExtra: "Cond. R$ 950 · IPTU R$ 3.000",
  },
  {
    id: 4,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 5,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 6,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 7,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 8,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 9,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
  {
    id: 10,
    imagem:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    titulo: "Jardins Marselha, Aparecida de Goiânia",
    endereco: "Avenida Notredame",
    metragem: 181,
    quartos: 3,
    banheiros: 4,
    vagas: 2,
    preco: "R$ 380.000",
    infoExtra: "Cond. R$ 250",
  },
];

export const ListaImoveisVenda = () => {
  return (
    <section className="w-full px-4 py-12">
      <div className="w-full flex justify-center mb-8">
        <h2 className="!text-white !text-xl !font-bold !text-center !max-w-screen-lg">
          Imóveis à venda próximos a você
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1300px] mx-auto justify-items-center">
        {imoveisVenda.map((item) => (
          <Link to={`/imovel/${item.id}`} key={item.id}>
            <div className="w-[285px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 hover:scale-[1.01] transition">
              <img
                src={item.imagem}
                alt={item.titulo}
                className="w-full h-[180px] object-cover"
              />

              <div className="p-4 bg-gray-100 border-t border-gray-200 flex flex-col gap-4 rounded-b-xl">
                {/* Título + Endereço */}
                <div className="flex flex-col gap-2 text-left">
                  <h3 className="text-base font-semibold text-gray-900 leading-snug break-words">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 break-words">
                    {item.endereco}
                  </p>
                </div>

                {/* Ícones */}
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <FaRulerCombined className="text-[15px]" />
                    {item.metragem} m²
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBed className="text-[15px]" />
                    {item.quartos}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBath className="text-[15px]" />
                    {item.banheiros}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCar className="text-[15px]" />
                    {item.vagas}
                  </div>
                </div>

                {/* Preço + coração */}
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-base font-bold text-gray-900">
                      Aluguel de {item.preco}
                    </p>
                    {item.infoExtra && (
                      <p className="text-xs text-gray-500">{item.infoExtra}</p>
                    )}
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <Heart strokeWidth={1.5} />
                  </button>
                </div>

                {/* Botões */}
                <div className="flex justify-between gap-2 mt-4">
                  <Button className="flex-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Mensagem
                  </Button>
                  <Button className="flex-1 bg-transparent text-red-600 text-sm rounded hover:bg-red-700">
                    Telefone
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>   
  );
};