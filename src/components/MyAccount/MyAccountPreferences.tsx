import {
  Bell,
  BellRing,
  Star,
  CalendarClock,
  BadgeCheck,
  Tag,
  SearchCheck,
} from "lucide-react";
import { useState } from "react";
import NovoImoveisOptions from "../Preferences/NovosImoveis";
import FavoritosOptions from "../Preferences/Favoritos";
import AgendamentosOptions from "../Preferences/Agendamentos";
import AvisosOptions from "../Preferences/Avisos";
import PromocaoOptions from "../Preferences/Promocoes";
import PesquisaOptions from "../Preferences/Pesquisas";

const preferences = [
  {
    icon: BellRing,
    title: "Novos imóveis",
    description: "Receba alertas de novos imóveis que correspondem às suas preferências.",
    component: <NovoImoveisOptions />,
  },
  {
    icon: Star,
    title: "Favoritos",
    description: "Atualizações sobre seus imóveis salvos.",
    component: <FavoritosOptions />,
  },
  {
    icon: CalendarClock,
    title: "Agendamentos",
    description: "Lembretes e confirmações de visitas agendadas.",
    component: <AgendamentosOptions />,
  },
  {
    icon: BadgeCheck,
    title: "Avisos",
    description: "Mudanças em status de imóvel, aprovações, notificações importantes.",
    component: <AvisosOptions />,
  },
  {
    icon: Tag,
    title: "Promoções",
    description: "Receba promoções e condições especiais.",
    component: <PromocaoOptions />,
  },
  {
    icon: SearchCheck,
    title: "Pesquisas",
    description: "Histórico e sugestões baseadas na sua navegação.",
    component: <PesquisaOptions />,
  },
];

export default function MyAccountPreferences() {
  const [selected, setSelected] = useState<string |null>(null);

  const handleClick = (title: string) => {
    setSelected((prev) => (prev === title ? null : title));
  };

  return (
    <div>
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-gray-800">
        <Bell size={20} className="!text-red-500" />
        Preferências de notificação
      </h3>

      <div className="!space-y-4">
        {preferences.map(({ icon: Icon, title, description, component }) => {
          const isOpen = selected === title;

          return (
            <div
              key={title}
              className="!rounded-xl !overflow-hidden !border !border-red-200 !shadow-sm !bg-gradient-to-br !from-white !via-red-50 !to-red-100"
            >
              <div
                onClick={() => handleClick(title)}
                className="!px-6 !py-4 !flex !items-start !justify-between !cursor-pointer hover:!bg-red-100"
              >
                <div className="!flex !items-start !gap-4">
                  <Icon size={20} className="!mt-1 !text-red-500" />
                  <div>
                    <p className="!font-semibold !text-gray-800">{title}</p>
                    <p className="!text-sm !text-gray-600">{description}</p>
                  </div>
                </div>
                <span className="!text-gray-400">{isOpen ? "▲" : "›"}</span>
              </div>

              {isOpen && (
                <div className="!bg-white !border-t !border-red-100 !px-6 !py-4">
                  {component}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
