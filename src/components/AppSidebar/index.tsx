import { Home, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo_cardapia.png";

const items = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Contato",
    url: "/contato",
    icon: Phone,
  },
];

export function AppSidebar() {
  const companyName = import.meta.env.VITE_COMPANY_NAME || "Menu";
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          {/* LOGO CENTRALIZADA NO TOPO */}
          <div className="flex items-center justify-center mb-6">
            <img src={logoImg} alt={companyName} className="h-12 w-auto" />
          </div>

          {/* NOME DA EMPRESA */}
          <SidebarGroupLabel className="text-cardapiaPrimaryColor font-bold text-lg text-center">
            {companyName}
          </SidebarGroupLabel>

          {/* MENU LATERAL */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                          isActive
                            ? "bg-cardapiaPrimaryColor bg-opacity-10 text-cardapiaPrimaryColor font-medium"
                            : "hover:bg-accent"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-5",
                            isActive
                              ? "text-cardapiaPrimaryColor"
                              : "text-gray-600"
                          )}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
