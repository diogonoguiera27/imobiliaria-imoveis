import { useState } from "react";
import {
  FaBed,
  FaCar,
  FaRulerCombined,
  FaToilet,
  FaBuilding,
  FaUtensils,
  FaHeart,
  FaBookOpen,
  FaSpa,
} from "react-icons/fa";
import { GiBathtub, GiHomeGarage, GiBarbecue } from "react-icons/gi";
import {
  MdOutlineBedroomParent,
  MdOutlineKitchen,
  MdBalcony,
} from "react-icons/md";
import { IoMdThermometer } from "react-icons/io";

export const ImovelDetalhes = () => {
  const [verMais, setVerMais] = useState({
    gastronomia: false,
    educacao: false,
    saude: false,
    lazer: false,
  });

  const toggle = (key: keyof typeof verMais) =>
    setVerMais((estado) => ({ ...estado, [key]: !estado[key] }));

  const imagens = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <section className="w-full px-4 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-10 text-center">
        {/* Imagens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {imagens.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Imagem ${index + 1}`}
              className="w-full h-[200px] object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Título */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Apartamento com 3 quartos à venda em Vila Madalena - SP
          </h1>
          <p className="text-gray-600">
            Rua Doutor Alberto Seabra – Vila Madalena – São Paulo/SP
          </p>
        </div>

        {/* Preço */}
        <div className="space-y-1">
          <p className="text-3xl font-bold text-red-600">R$ 5.300.000</p>
          <p className="text-sm text-gray-500">R$ 25.159 /m²</p>
          <p className="text-sm text-gray-500">
            Condomínio: R$ 3.466 | IPTU: R$ 2.200
          </p>
        </div>

        {/* Detalhes principais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-gray-700 border-t pt-6 justify-center">
          <div className="flex items-center gap-2 justify-center">
            <FaRulerCombined className="text-red-600" /> Área total: 225m²
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaRulerCombined className="text-red-600" /> Área construída: 210m²
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaBed className="text-red-600" /> Dormitórios: 3
          </div>
          <div className="flex items-center gap-2 justify-center">
            <GiBathtub className="text-red-600" /> Suítes: 3
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaToilet className="text-red-600" /> Banheiros: 5
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaCar className="text-red-600" /> Vagas: 3
          </div>
          <div className="flex items-center gap-2 justify-center">
            <FaBuilding className="text-red-600" /> Andar: 4º
          </div>
        </div>

        {/* Sobre o imóvel */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Sobre o imóvel</h2>
          <p className="text-gray-700">
            O Mirá é um convite para descobrir uma São Paulo diferente. Sua
            fachada impressionante, localização privilegiada, vistas deslumbrantes
            e áreas de convivência encantadoras tornam este imóvel único...
          </p>
          <div>
            <span className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
              Ver mais
            </span>
          </div>
        </div>

        {/* Características */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">
            Características do imóvel
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 text-sm justify-center">
            <div className="flex items-center gap-2 justify-center">
              <IoMdThermometer className="text-red-600" /> Aquecedor central
            </div>
            <div className="flex items-center gap-2 justify-center">
              <GiBarbecue className="text-red-600" /> Churrasqueira
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MdOutlineKitchen className="text-red-600" /> Cozinha mobiliada
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaCar className="text-red-600" /> Ar-condicionado
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaBed className="text-red-600" /> Armário embutido
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MdOutlineBedroomParent className="text-red-600" /> Closet
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MdBalcony className="text-red-600" /> Cozinha americana
            </div>
            <div className="flex items-center gap-2 justify-center">
              <GiHomeGarage className="text-red-600" /> Dependência de empregados
            </div>
            <div className="flex items-center gap-2 justify-center">
              <FaToilet className="text-red-600" /> Lavabo
            </div>
          </div>
          <div>
            <span className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
              Ver mais
            </span>
          </div>
        </div>

        {/* Nas proximidades do imóvel */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Nas proximidades do imóvel
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 justify-center text-left mx-auto max-w-4xl">
            {/* Gastronomia */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-600">
                <FaUtensils /> Gastronomia
              </h3>
              <ul>
                <li className="flex justify-between">
                  <span>Salsa Restaurante</span><span>16m</span>
                </li>
                <li className="flex justify-between">
                  <span>Haraguni Restaurante</span><span>96m</span>
                </li>
                {verMais.gastronomia && (
                  <>
                    <li className="flex justify-between"><span>Restaurante Vila Madá</span><span>138m</span></li>
                    <li className="flex justify-between"><span>Café Flor</span><span>201m</span></li>
                  </>
                )}
              </ul>
              <span onClick={() => toggle("gastronomia")} className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
                {verMais.gastronomia ? "Ver menos" : "Ver mais"}
              </span>
            </div>

            {/* Educação */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-600">
                <FaBookOpen /> Educação
              </h3>
              <ul>
                <li className="flex justify-between"><span>Fundação Escola De Comércio</span><span>431m</span></li>
                <li className="flex justify-between"><span>Álvares Penteado - FECAP</span><span>435m</span></li>
                <li className="flex justify-between"><span>Colégio Vectra</span><span>435m</span></li>
                {verMais.educacao && (
                  <li className="flex justify-between"><span>Colégio Albert Einstein</span><span>490m</span></li>
                )}
              </ul>
              <span onClick={() => toggle("educacao")} className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
                {verMais.educacao ? "Ver menos" : "Ver mais"}
              </span>
            </div>

            {/* Saúde e Bem-estar */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-600">
                <FaHeart /> Saúde e Bem-estar
              </h3>
              <ul>
                <li className="flex justify-between"><span>Smartfit Escola De Ginástica</span><span>234m</span></li>
                <li className="flex justify-between"><span>Hospital Saint Paul</span><span>380m</span></li>
                {verMais.saude && (
                  <>
                    <li className="flex justify-between"><span>Farmácia Gonçalves</span><span>422m</span></li>
                    <li className="flex justify-between"><span>Academia Kyokushin</span><span>456m</span></li>
                  </>
                )}
              </ul>
              <span onClick={() => toggle("saude")} className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
                {verMais.saude ? "Ver menos" : "Ver mais"}
              </span>
            </div>

            {/* Lazer */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-red-600">
                <FaSpa /> Lazer
              </h3>
              <ul>
                <li className="flex justify-between"><span>Empreendimento Raposo Shopping</span><span>305m</span></li>
                {verMais.lazer && (
                  <>
                    <li className="flex justify-between"><span>Praça Vila Madalena</span><span>342m</span></li>
                    <li className="flex justify-between"><span>Teatro das Artes</span><span>490m</span></li>
                  </>
                )}
              </ul>
              <span onClick={() => toggle("lazer")} className="text-sm text-red-600 font-medium cursor-pointer hover:underline">
                {verMais.lazer ? "Ver menos" : "Ver mais"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
