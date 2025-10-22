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
      <div className="!w-screen !min-h-screen !flex !flex-col">
        <SidebarTrigger />

        <div className="!w-[95%] md:!w-[80%] !mx-auto !p-0 !flex-1 !mt-18">
          <div className="!grid !grid-cols-1 lg:!grid-cols-3 !gap-0 lg:!items-stretch !h-full ">
            
            <div className="hidden lg:!block lg:!col-span-1 !h-full">
              <LeftPanel previewSrc={preview} />
            </div>

            
            <div className="lg:!col-span-2 ">
              <RightPanel onImageSelect={setPreview} />
            </div>
          </div>
        </div>

        
        <div className="!mt-12">
          <FooterDesktop variant="create" />
        </div>
        <div className="block md:hidden !mt-8">
          <MobileBottomBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
