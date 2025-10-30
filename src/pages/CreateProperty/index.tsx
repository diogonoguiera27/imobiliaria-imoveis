import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { FooterDesktop } from "@/components/FooterDesktop";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function CreatePropertyPage() {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <SidebarProvider>
      <div className="!w-screen !min-h-screen !flex !flex-col !bg-gray-50 dark:!bg-gray-900">
        {/* Menu lateral */}
        <SidebarTrigger />

        {/* 🔹 Área principal */}
        <main className="!flex-grow !flex !justify-center !pt-24 md:!pt-32">
          <div className="!w-[95%] md:!w-[80%] !mx-auto">
            <div className="!grid !grid-cols-1 lg:!grid-cols-3 ">
              {/* 🖼️ Painel esquerdo (preview) — só aparece no desktop */}
              <div className="!hidden lg:!flex !flex-col">
                <LeftPanel previewSrc={preview} />
              </div>

              {/* 📝 Painel direito (formulário) — visível sempre */}
              <div className="!col-span-1 lg:!col-span-2 !flex !flex-col">
                <RightPanel onImageSelect={setPreview} />
              </div>
            </div>
          </div>
        </main>

        {/* 🦶 Rodapé Desktop */}
        <div className="!hidden md:!block !mt-12">
          <FooterDesktop variant="create" />
        </div>

        {/* 📱 Barra inferior mobile */}
        <div className="!block md:!hidden !mt-16">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
