import { useState } from "react";
import {
  MyAccountSidebar,
  MyAccountOverview,
  MyAccountSimulations,
  MyAccountAccessData,
  MyAccountPersonalData,
  MyAccountPreferences,
} from "@/components/MyAccount";
import {
  LayoutDashboard,
  Calculator,
  KeyRound,
  User,
  Bell,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

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
      <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900">
        
        <SidebarTrigger />

        <main className="flex-grow flex justify-center !px-4 !pt-20 !mb-10">
          <div className="w-[80%] flex flex-col md:flex-row gap-8 mb-10">
            
            <aside className="w-full md:w-[320px] flex-shrink-0">
              <MyAccountSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
              />
            </aside>

            
            <section className="flex-1 flex flex-col gap-6">
              {activeTab === "Visão Geral" && <MyAccountOverview />}
              {activeTab === "Simulações" && <MyAccountSimulations />}
              {activeTab === "Dados de Acesso" && <MyAccountAccessData />}
              {activeTab === "Dados pessoais" && <MyAccountPersonalData />}
              {activeTab === "Preferências de notificação" && <MyAccountPreferences />}
            </section>
          </div>
        </main>

        
        <Footer />
      </div>
    </SidebarProvider>
  );
}
