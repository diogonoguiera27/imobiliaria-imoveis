import { useState } from "react";

import {
  LayoutDashboard,
  Calculator,
  KeyRound,
  User,
  Bell,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import MyAccountSidebar from "@/components/MyAccountSidebar";
import MyAccountOverview from "@/components/MyAccountOverview";
import MyAccountSimulations from "@/components/MyAccountSimulations";
import MyAccountAccessData from "@/components/MyAccountAccessData";
import MyAccountPersonalData from "@/components/MyAccountPersonalData";
import MyAccountPreferences from "@/components/MyAccountPreferences";

const tabs = [
  { label: "Visão Geral", icon: LayoutDashboard },
  { label: "Simulações", icon: Calculator },
  { label: "Dados de Acesso", icon: KeyRound },
  { label: "Dados pessoais", icon: User },
  { label: "Preferências de notificação", icon: Bell },
];

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("Visão Geral");

  return (
    <SidebarProvider>
      <div className="!flex !flex-col !min-h-screen !w-screen !overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 !text-gray-900">
        <SidebarTrigger />

        {/* ===== Barra horizontal (somente mobile ≤ md) ===== */}
        <div className="!w-full !px-4 !mt-20 md:!hidden">
          <div className="!bg-white !rounded-xl !shadow-md !border !border-gray-200 p-2">
            <ul className="!grid !grid-cols-5 !gap-2">
              {tabs.map(({ label, icon: Icon }) => {
                const isActive = activeTab === label;
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActiveTab(label)}
                      className={`
                        !relative !w-full !h-12 !flex !items-center !justify-center !rounded-lg !transition
                        ${isActive ? "!text-red-600" : "!text-gray-600 hover:!bg-red-100"}
                      `}
                    >
                      <Icon size={22} />
                      {/* indicador ativo (linha inferior) */}
                      {isActive && (
                        <span className="!absolute !bottom-0 !left-2 !right-2 !h-[3px] !bg-red-600 !rounded-t-lg !transition-all"></span>
                      )}
                      <span className="sr-only">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main */}
        <main className="!flex-grow !flex !justify-center !px-4 !pt-10 !pb-10 !mt-10">
          {/* 🚀 AQUI está a mudança: largura 100% no mobile e 80% no desktop */}
          <div className="!w-full md:!w-[80%] !flex !flex-col lg:!flex-row !gap-8 !mb-10">
            {/* Sidebar só no desktop */}
            <aside className="!hidden md:!block !w-[320px] !flex-shrink-0">
              <MyAccountSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
              />
            </aside>

            {/* Conteúdo */}
            <section className="!flex-1 !flex !flex-col !gap-6">
              {activeTab === "Visão Geral" && <MyAccountOverview />}
              {activeTab === "Simulações" && <MyAccountSimulations />}
              {activeTab === "Dados de Acesso" && <MyAccountAccessData />}
              {activeTab === "Dados pessoais" && <MyAccountPersonalData />}
              {activeTab === "Preferências de notificação" && (
                <MyAccountPreferences />
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
