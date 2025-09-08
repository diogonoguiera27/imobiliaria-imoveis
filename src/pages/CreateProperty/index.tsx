import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";
import { LeftPanel, RightPanel } from "@/components/CreateProperty";

export default function CreatePropertyPage() {
  const [preview, setPreview] = useState<string | null>(null);

  // Revoga URL de preview quando desmonta
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <SidebarProvider>
      <div className="!w-screen">
        <SidebarTrigger />

        <div className="!max-w-6xl !mx-auto !p-20">
          <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0">
            {/* Coluna Esquerda */}
            <LeftPanel previewSrc={preview} />

            {/* Coluna Direita */}
            <RightPanel onImageSelect={setPreview} />
          </div>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
