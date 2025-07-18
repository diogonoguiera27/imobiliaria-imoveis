import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calculator,
  KeyRound,
  User,
  Bell,
  BellRing,
  CalendarClock,
  Star,
  BadgeCheck,
  Tag,
  SearchCheck
} from "lucide-react";

const abas = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Simulações", icon: Calculator },
  { label: "Dados de acesso", icon: KeyRound },
  { label: "Dados pessoais", icon: User },
  { label: "Preferências", icon: Bell },
];

export default function MinhaConta() {
  const [abaAtiva, setAbaAtiva] = useState("Visão geral");

  return (
    <div className="!min-h-screen !bg-neutral-900 !text-white !flex !px-6 !py-10">
      {/* SIDEBAR CARD */}
      <aside className="!w-72 !bg-neutral-800 !rounded-xl !p-4 !shadow-xl !h-fit">
        <ul className="!space-y-1">
          {abas.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                onClick={() => setAbaAtiva(label)}
                className={`!w-full !flex !items-center !gap-3 !py-3 !px-4 !rounded-lg transition ${
                  abaAtiva === label
                    ? "!bg-purple-600 !text-white"
                    : "hover:!bg-neutral-700 !text-neutral-300"
                }`}
              >
                <Icon size={18} />
                <span className="!text-sm font-medium">{label}</span>
                {abaAtiva === label && <span className="ml-auto">›</span>}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="!flex-1 !px-8">
        {abaAtiva === "Visão geral" && (
          <div className="!space-y-6">
            {/* Simulações */}
            <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
              <h3 className="!text-lg !font-semibold mb-2">Simulações</h3>
              <p className="!text-sm text-neutral-400">
                Você possui 2 simulações de financiamento em andamento.
              </p>
              <ul className="!mt-2 !text-sm text-neutral-300 list-disc ml-5">
                <li>Casa em Goiânia - R$ 350 mil - Entrada R$ 70 mil</li>
                <li>Apartamento em Aparecida - R$ 250 mil - Entrada R$ 50 mil</li>
              </ul>
            </div>

            {/* Dados pessoais */}
            <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
              <h3 className="!text-lg !font-semibold mb-2">Dados pessoais</h3>
              <p className="!text-sm text-neutral-400">
                Nome: Gilberto Bessa<br />
                Cidade: São Paulo<br />
                Telefone: (11) 98765-4321
              </p>
            </div>

            {/* Dados de acesso */}
            <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
              <h3 className="!text-lg !font-semibold mb-2">Dados de acesso</h3>
              <p className="!text-sm text-neutral-400">
                E-mail: gilberto@example.com<br />
                Senha: ********
              </p>
            </div>
          </div>
        )}

        {abaAtiva === "Simulações" && (
          <div>
            <h3 className="!text-2xl !font-bold mb-6 flex items-center gap-2">
              <Calculator size={20} /> Simulações
            </h3>
            <div className="!space-y-4">
              <div className="!bg-neutral-800 !rounded-xl !p-4 !shadow">
                <p className="!font-semibold">Apartamento - Setor Bueno</p>
                <p className="!text-sm !text-neutral-400">Simulado em 20/06/2025 - Entrada: R$ 40.000 - Parcelas: 240x R$ 1.200</p>
              </div>
              <div className="!bg-neutral-800 !rounded-xl !p-4 !shadow">
                <p className="!font-semibold">Casa - Jardim América</p>
                <p className="!text-sm !text-neutral-400">Simulado em 05/07/2025 - Entrada: R$ 80.000 - Parcelas: 300x R$ 1.500</p>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "Dados de acesso" && (
          <div>
            <h3 className="!text-2xl !font-bold mb-6 flex items-center gap-2">
              <KeyRound size={20} /> Dados de acesso
            </h3>

            <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow flex flex-col sm:flex-row gap-4">
              <div className="!flex-1">
                <p className="!text-sm text-neutral-400 mb-1">E-mail</p>
                <div className="!bg-neutral-900 !p-4 !rounded-lg !flex !justify-between items-center">
                  <span className="!text-sm">gilberto@example.com</span>
                  <Button variant="ghost" size="sm" className="!text-purple-400">Alterar</Button>
                </div>
              </div>
              <div className="!flex-1">
                <p className="!text-sm text-neutral-400 mb-1">Senha</p>
                <div className="!bg-neutral-900 !p-4 !rounded-lg !flex !justify-between items-center">
                  <span className="!text-sm">********</span>
                  <Button variant="ghost" size="sm" className="!text-purple-400">Alterar</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "Dados pessoais" && (
          <div>
            <h3 className="!text-2xl !font-bold mb-6 flex items-center gap-2">
              <User size={20} /> Dados pessoais
            </h3>

            <div className="!bg-neutral-800 !rounded-xl !p-6 !shadow">
              <h4 className="!text-md !font-semibold mb-4">Informações do usuário</h4>
              <form className="!grid sm:!grid-cols-2 gap-4">
                <div>
                  <label className="!text-sm text-neutral-400">Nome *</label>
                  <input
                    type="text"
                    defaultValue="Gilberto Bessa"
                    className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                  />
                </div>
                <div>
                  <label className="!text-sm text-neutral-400">Telefone *</label>
                  <input
                    type="text"
                    defaultValue="(11) 98765-4321"
                    className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                  />
                </div>
                <div>
                  <label className="!text-sm text-neutral-400">E-mail *</label>
                  <input
                    type="email"
                    defaultValue="gilberto@example.com"
                    className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                  />
                </div>
                <div>
                  <label className="!text-sm text-neutral-400">Senha</label>
                  <input
                    type="password"
                    value="********"
                    readOnly
                    className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white !cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="!text-sm text-neutral-400">Cidade *</label>
                  <input
                    type="text"
                    defaultValue="São Paulo"
                    className="!w-full !p-2 !rounded-md !bg-neutral-900 !border !border-neutral-700 !text-white"
                  />
                </div>
                <div className="sm:!col-span-2 !pt-4">
                  <Button className="!bg-purple-600 !hover:bg-purple-700 !text-white">Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {abaAtiva === "Preferências" && (
          <div>
            <h3 className="!text-2xl !font-bold mb-6 flex items-center gap-2">
              <Bell size={20} /> Preferências de notificação
            </h3>
            <div className="!space-y-4">
              {[
                {
                  icon: BellRing,
                  title: "Novos imóveis",
                  description: "Receba alertas de novos imóveis que correspondem às suas preferências."
                },
                {
                  icon: Star,
                  title: "Favoritos",
                  description: "Atualizações sobre seus imóveis salvos."
                },
                {
                  icon: CalendarClock,
                  title: "Agendamentos",
                  description: "Lembretes e confirmações de visitas agendadas."
                },
                {
                  icon: BadgeCheck,
                  title: "Avisos",
                  description: "Mudanças em status de imóvel, aprovações, notificações importantes."
                },
                {
                  icon: Tag,
                  title: "Promoções",
                  description: "Receba promoções e condições especiais."
                },
                {
                  icon: SearchCheck,
                  title: "Pesquisas",
                  description: "Histórico e sugestões baseadas na sua navegação."
                }
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="!bg-neutral-800 !rounded-xl !px-6 !py-4 !flex !items-start !justify-between hover:!bg-neutral-700 !cursor-pointer"
                >
                  <div className="!flex !items-start gap-4">
                    <Icon size={20} className="!mt-1 !text-purple-500" />
                    <div>
                      <p className="!font-semibold">{title}</p>
                      <p className="!text-sm !text-neutral-400">{description}</p>
                    </div>
                  </div>
                  <span className="!text-neutral-500">›</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
