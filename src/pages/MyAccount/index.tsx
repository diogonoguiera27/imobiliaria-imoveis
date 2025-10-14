import { useState } from "react";
import {
  LayoutDashboard,
  Calculator,
  KeyRound,
  User,
  Bell,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import MyAccountSidebar from "@/components/MyAccountSidebar";
import MyAccountOverview from "@/components/MyAccountOverview";
import MyAccountSimulations from "@/components/MyAccountSimulations";
import MyAccountAccessData from "@/components/MyAccountAccessData";
import MyAccountPersonalData from "@/components/MyAccountPersonalData";
import MyAccountPreferences from "@/components/MyAccountPreferences";
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

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
      <div className="!flex !flex-col !min-h-screen !w-full !overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 !text-gray-900">
        <SidebarTrigger />

        {/* ===== 🧭 Tabs horizontais — apenas no mobile (até md) ===== */}
        <div className="!w-full !px-4 !mt-24 sm:!mt-28 md:!hidden">
          <div className="!bg-white !rounded-xl !shadow-md !border !border-gray-200 !p-2">
            <ul className="!grid !grid-cols-5 !gap-2">
              {tabs.map(({ label, icon: Icon }) => {
                const isActive = activeTab === label;
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActiveTab(label)}
                      className={`!relative !w-full !h-12 !flex !items-center !justify-center !rounded-lg !transition ${
                        isActive
                          ? "!text-red-600"
                          : "!text-gray-600 hover:!bg-red-100"
                      }`}
                    >
                      <Icon size={22} />
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

        {/* ===== 📦 CONTEÚDO PRINCIPAL ===== */}
        <main
          className="
            !flex-grow 
            !mt-24 sm:!mt-28 md:!mt-32 
            !flex 
            !justify-center 
            !px-0 
            !pb-16
          "
        >
          {/* 🧩 Container centralizado padrão global */}
          <div
            className="
              !w-full 
              md:!max-w-[80%] md:!mx-auto 
              !flex 
              !flex-col lg:!flex-row 
              !gap-8
            "
          >
            {/* ===== Sidebar (visível no desktop) ===== */}
            <aside className="!hidden md:!block !w-[320px] !flex-shrink-0">
              <MyAccountSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
              />
            </aside>

            {/* ===== Conteúdo dinâmico ===== */}
            <section className="!flex-1 !flex !flex-col !gap-6 ">
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

        {/* ===== 🔹 Footer padronizado ===== */}
        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>

        <div className="block md:hidden">
          <MobileBottomBar/>
        </div>
      </div>
    </SidebarProvider>
  );
}
