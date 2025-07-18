import { Button } from "@/components/ui/button";

import { Calendar, Heart, Plus } from "lucide-react";

export default function ProfilePreview() {
  const user = {
    nome: "Gilberto Bessa",
    username: "@gilberto-bessa",
    telefone: "(11) 98765-4321",
    email: "gilberto@example.com",
    senha: "********",
    cidade: "São Paulo",
  };

  const favoritos = [
    {
      id: 1,
      titulo: "Apartamento moderno no centro",
      cidade: "São Paulo",
      preco: "R$ 350.000",
      imagem: "https://source.unsplash.com/400x300/?apartment",
    },
    {
      id: 2,
      titulo: "Casa com quintal espaçoso",
      cidade: "Campinas",
      preco: "R$ 480.000",
      imagem: "https://source.unsplash.com/400x300/?house",
    },
  ];

   const visitas = [
    {
      id: 1,
      data: "21/07/2025",
      hora: "10:00",
      endereco: "Rua das Flores, 123 - São Paulo",
      status: "Confirmada",
    },
    {
      id: 2,
      data: "25/07/2025",
      hora: "14:30",
      endereco: "Av. Brasil, 456 - Campinas",
      status: "Pendente",
    },
  ];

  return (
    <div className="!min-h-screen !bg-neutral-900 !text-white !px-6 !py-10">
      <div className="!max-w-7xl !mx-auto !flex !flex-col md:!flex-row !gap-8">
        {/* CARD LATERAL */}
        <div className="!w-full md:!w-[320px] !flex !flex-col !gap-6">
          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl !text-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt={user.nome}
              className="!w-24 !h-24 !rounded-[24px] !border-4 !border-white !object-cover !mx-auto !mb-4"
            />
            <h2 className="!text-lg !font-bold !mb-1">{user.nome}</h2>
            <p className="!text-sm !text-purple-400 !mb-4">{user.username}</p>

            <div className="!bg-neutral-900 !rounded-lg !p-4 !text-left !space-y-3">
              <div>
                <p className="!text-xs !text-neutral-400">E-mail</p>
                <p className="!text-sm !font-medium">{user.email}</p>
              </div>
              <div>
                <p className="!text-xs !text-neutral-400">Telefone</p>
                <p className="!text-sm !font-medium">{user.telefone}</p>
              </div>
              <div>
                <p className="!text-xs !text-neutral-400">Cidade</p>
                <p className="!text-sm !font-medium">{user.cidade}</p>
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className="!bg-neutral-800 !rounded-xl !p-4 !shadow-xl">
            <div className="!flex !items-center !justify-between !mb-3">
              <h3 className="!text-sm !font-semibold">Links</h3>
              <button className="!text-neutral-400 hover:!text-white">
                <Plus size={18} />
              </button>
            </div>
            <div className="!grid !grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="!w-10 !h-10 !flex !items-center !justify-center !bg-neutral-700 !rounded-md !text-purple-400 hover:!bg-purple-700 hover:!text-white"
                >
                  <Plus size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="!flex-1 !flex !flex-col !gap-6">
          {/* Card de progresso */}
          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
            <h3 className="!text-lg !font-semibold !mb-2">
              Complete seu perfil
            </h3>
            <p className="!text-sm !text-neutral-400 !mb-4">
              Perfis completos atraem mais oportunidades!
            </p>
            <div className="!w-full !bg-neutral-700 !h-2 !rounded-full !mb-4">
              <div className="!bg-green-500 !h-2 !rounded-full !w-1/2" />
            </div>
            <div className="!grid !grid-cols-2 md:!grid-cols-3 !gap-2 text-sm">
              {[
                "Informações básicas",
                "Foto do perfil",
                "Imagem de capa",
                "Links",
                "Sobre você",
                "Destaques",
                "Habilidades",
                "Momento de carreira",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="!bg-neutral-900 !rounded-lg !py-2 !px-3 !text-left !border !border-neutral-700 hover:!border-purple-500"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
            <h3 className="!text-lg !font-semibold !mb-6">Editar Perfil</h3>

            <form className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
              <div>
                <label className="!block !text-sm !text-neutral-400 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  defaultValue={user.nome}
                  className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                />
              </div>

              <div>
                <label className="!block !text-sm !text-neutral-400 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  defaultValue={user.telefone}
                  className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                />
              </div>

              <div className="md:!col-span-2">
                <label className="!block !text-sm !text-neutral-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                />
              </div>

              <div>
                <label className="!block !text-sm !text-neutral-400 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={user.senha}
                  readOnly
                  className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white !cursor-not-allowed"
                />
              </div>

              <div>
                <label className="!block !text-sm !text-neutral-400 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  defaultValue={user.cidade}
                  className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                />
              </div>

              <div className="md:!col-span-2 !flex !justify-end !pt-4">
                <Button className="!bg-green-600 !hover:bg-green-700 !text-white !font-semibold">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>

          {/* Imóveis Favoritos */}
          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
            <h3 className="!text-lg !font-semibold !mb-4 flex items-center gap-2">
              <Heart className="text-red-500" /> Imóveis Favoritos
            </h3>
            <div className="!grid !grid-cols-1 md:!grid-cols-2 gap-4">
              {favoritos.map((imovel) => (
                <div key={imovel.id} className="!bg-neutral-900 !rounded-lg overflow-hidden shadow">
                  <img
                    src={imovel.imagem}
                    alt={imovel.titulo}
                    className="!w-full !h-40 !object-cover"
                  />
                  <div className="!p-4">
                    <h4 className="!font-semibold !text-base mb-1">{imovel.titulo}</h4>
                    <p className="!text-sm !text-neutral-400">{imovel.cidade}</p>
                    <p className="!text-sm !text-green-500 !font-bold">{imovel.preco}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
            <h3 className="!text-lg !font-semibold !mb-4 flex items-center gap-2">
              <Calendar className="text-blue-400" /> Visitas Agendadas
            </h3>
            <div className="!space-y-4">
              {visitas.map((visita) => (
                <div key={visita.id} className="!bg-neutral-900 !rounded-lg !p-4 !border !border-neutral-700">
                  <p className="!text-sm !text-neutral-300">
                    <span className="!font-medium">Data:</span> {visita.data} às {visita.hora}
                  </p>
                  <p className="!text-sm !text-neutral-300">
                    <span className="!font-medium">Endereço:</span> {visita.endereco}
                  </p>
                  <p className="!text-sm">
                    <span className="!font-medium">Status:</span> <span className={`!font-bold ${visita.status === "Confirmada" ? "!text-green-500" : "!text-yellow-400"}`}>{visita.status}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interesses de Busca */}
          <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow-xl">
            <h3 className="!text-lg !font-semibold !mb-4">
              Interesses de Busca
            </h3>
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 gap-4 text-sm">
              <div className="!bg-neutral-900 !rounded-lg !p-4">
                <p className="!text-neutral-400">Tipo</p>
                <p className="!font-semibold">Casa ou Apartamento</p>
              </div>
              <div className="!bg-neutral-900 !rounded-lg !p-4">
                <p className="!text-neutral-400">Cidade de interesse</p>
                <p className="!font-semibold">São Paulo, Campinas</p>
              </div>
              <div className="!bg-neutral-900 !rounded-lg !p-4">
                <p className="!text-neutral-400">Faixa de preço</p>
                <p className="!font-semibold">R$ 200 mil — R$ 500 mil</p>
              </div>
              <div className="!bg-neutral-900 !rounded-lg !p-4">
                <p className="!text-neutral-400">Finalidade</p>
                <p className="!font-semibold">Compra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
