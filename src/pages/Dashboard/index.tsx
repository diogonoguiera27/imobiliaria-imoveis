// src/pages/UserManagement/index.tsx

import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";
import SidebarTrigger, { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col !overflow-x-hidden">
        <main className="!flex-grow">
          <SidebarTrigger />

          {/* MENSAGEM FIXA NO CENTRO DA TELA */}
          <div className="!fixed !inset-0 !flex !items-center !justify-center !pointer-events-none">
            <div
              className="!bg-yellow-100 !border !border-yellow-300 !text-yellow-900
                            !px-8 !py-6 !rounded-lg !shadow-lg !text-center
                            !text-2xl !font-bold !pointer-events-auto"
            >
              🚧 Dashboard em desenvolvimento
              <br />
              Em breve novas funcionalidades estarão disponíveis.
            </div>
          </div>
        </main>

        <div className="!mt-4">
          <FooterDesktop variant="list" />
        </div>
         <div className="block md:hidden !mt-8">
                  <MobileBottomBar />
          </div>
      </div>
    </SidebarProvider>
  );
}
