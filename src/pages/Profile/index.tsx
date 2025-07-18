import {
  FavoriteProperties,
  ProfileEditForm,
  ProfileProgressCard,
  ProfileSidebar,
  ScheduledVisits,
  SearchPreferences,
} from "@/components/Profile";

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

const searchPreferences = {
  type: "Casa ou Apartamento",
  cities: ["São Paulo", "Campinas"],
  priceRange: "R$ 200 mil — R$ 500 mil",
  purpose: "Compra",
};

export default function ProfilePage() {
  return (
    <div className="!min-h-screen !bg-neutral-900 !text-white !px-6 !py-10">
      <div className="!max-w-7xl !mx-auto !flex !flex-col md:!flex-row !gap-8">
        <div className="!w-full md:!w-[320px] !flex !flex-col !gap-6">
          <ProfileSidebar user={user} />
        </div>

        <div className="!flex-1 !flex !flex-col !gap-6">
          <ProfileProgressCard />
          <ProfileEditForm user={user} />
          <FavoriteProperties favoritos={favoritos} />
          <ScheduledVisits visits={visitas} />
          <SearchPreferences
            type={searchPreferences.type}
            cities={searchPreferences.cities}
            priceRange={searchPreferences.priceRange}
            purpose={searchPreferences.purpose}
          />
        </div>
      </div>
    </div>
  );
}
