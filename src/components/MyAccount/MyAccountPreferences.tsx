import {
  Bell,
  BellRing,
  Star,
  CalendarClock,
  BadgeCheck,
  Tag,
  SearchCheck,
} from "lucide-react";

const preferences = [
  {
    icon: BellRing,
    title: "Novos imóveis",
    description:
      "Receba alertas de novos imóveis que correspondem às suas preferências.",
  },
  {
    icon: Star,
    title: "Favoritos",
    description: "Atualizações sobre seus imóveis salvos.",
  },
  {
    icon: CalendarClock,
    title: "Agendamentos",
    description: "Lembretes e confirmações de visitas agendadas.",
  },
  {
    icon: BadgeCheck,
    title: "Avisos",
    description:
      "Mudanças em status de imóvel, aprovações, notificações importantes.",
  },
  {
    icon: Tag,
    title: "Promoções",
    description: "Receba promoções e condições especiais.",
  },
  {
    icon: SearchCheck,
    title: "Pesquisas",
    description: "Histórico e sugestões baseadas na sua navegação.",
  },
];

export default function MyAccountPreferences() {
  return (
    <div>
      <h3 className="!text-2xl !font-bold !mb-6 !flex !items-center !gap-2 !text-white">
        <Bell size={20} /> Preferências de notificação
      </h3>

      <div className="!space-y-4">
        {preferences.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="!bg-neutral-800 !rounded-xl !px-6 !py-4 !flex !items-start !justify-between hover:!bg-neutral-700 !cursor-pointer"
          >
            <div className="!flex !items-start !gap-4">
              <Icon size={20} className="!mt-1 !text-purple-500" />
              <div>
                <p className="!font-semibold !text-white">{title}</p>
                <p className="!text-sm !text-neutral-400">{description}</p>
              </div>
            </div>
            <span className="!text-neutral-500">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
