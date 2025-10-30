// src/pages/Dashboard/index.tsx

import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";
import SidebarTrigger, { SidebarProvider } from "@/components/ui/sidebar";
import DashboardCards from "@/components/DashboardCards";
import DashboardChart from "@/components/DashboardChart";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col !overflow-x-hidden !min-h-screen !bg-gray-50 dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100">
        <main className="!flex-grow">
          <SidebarTrigger />

          {/* Container Centralizado e espaçado do header */}
          <div className="!flex !justify-center  !pt-28 md:!pt-32">
            <div className="!w-[95%] md:!w-[80%] !mx-auto">
              <h1 className="!text-2xl !font-semibold !mb-8 !text-center !flex !items-center !justify-center !gap-2">
                <span className="!text-3xl">📊</span> Dashboard Imobiliária
              </h1>

              {/* Componente dos Cards */}
              <DashboardCards />
              <div className="!mt-4">
                <DashboardChart />
              </div>
              
            </div>
          </div>
        </main>

        {/* Rodapé */}
        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>

        {/* Barra inferior mobile */}
        <div className="!block md:!hidden !mt-8">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
