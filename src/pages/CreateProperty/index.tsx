import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { FooterDesktop } from "@/components/FooterDesktop";


export default function CreatePropertyPage() {
  const [preview, setPreview] = useState<string | null>(null);

  // Limpa preview ao desmontar
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <SidebarProvider>
      <div className="!w-screen">
        <SidebarTrigger />

        <div className="!max-w-6xl !mx-auto !p-6 lg:!p-20">
          {/* GRID responsivo */}
          <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0 lg:!items-stretch lg:!h-full !mt-10">
            <div className="hidden lg:!block lg:!col-span-1">
              <div className="!h-full">
                <LeftPanel previewSrc={preview} />
              </div>
            </div>
            <div className="lg:!col-span-2">
              <RightPanel onImageSelect={setPreview} />
            </div>
          </div>
        </div>

        <div className="!mt-6">
  <FooterDesktop variant="create" />
</div>
      </div>
    </SidebarProvider>
  );
}
