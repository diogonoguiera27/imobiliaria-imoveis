import { LucideIcon } from "lucide-react";

interface Tab {
  label: string;
  icon: LucideIcon;
}

interface MyAccountSidebarProps {
  activeTab: string;
  onTabChange: (label: string) => void;
  tabs: Tab[];
}

export default function MyAccountSidebar({
  activeTab,
  onTabChange,
  tabs,
}: MyAccountSidebarProps) {
  return (
    <div>
      {/* ====== MOBILE ≤ 460px → BARRA HORIZONTAL FIXA COM ÍCONES ====== */}
      <div
        className="
          max-[460px]:block hidden
          !sticky !top-[60px] !z-40
          !w-full
          !bg-gradient-to-r !from-red-500 !to-red-600
          !shadow-md
        "
      >
        <ul className="!grid !grid-cols-5">
          {tabs.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label;
            return (
              <li key={label}>
                <button
                  onClick={() => onTabChange(label)}
                  className={`
                    !relative !w-full !h-12
                    !flex !items-center !justify-center
                    !transition
                    ${isActive
                      ? "!text-white !bg-white/10"
                      : "!text-white/80 hover:!text-white"}
                  `}
                >
                  <Icon size={22} />
                  {/* Indicador ativo */}
                  {isActive && (
                    <span className="!absolute !bottom-0 !left-2 !right-2 !h-[3px] !bg-white/90 !rounded-full" />
                  )}
                  <span className="sr-only">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ====== DESKTOP / TABLETS > 460px → SIDEBAR VERTICAL ====== */}
      <div
        className="
          max-[460px]:hidden
          !bg-gradient-to-br !from-white !via-red-50 !to-red-100
          !rounded-xl !p-4 !shadow-xl !border !border-red-100
        "
      >
        <ul className="!space-y-1">
          {tabs.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label;
            return (
              <li key={label}>
                <button
                  onClick={() => onTabChange(label)}
                  className={`
                    !w-full !flex !items-center !gap-3 !cursor-pointer
                    !py-3 !px-4 !rounded-lg !transition
                    ${isActive
                      ? "!bg-red-500 !text-white"
                      : "hover:!bg-red-50 !text-gray-700"}
                  `}
                >
                  <Icon size={18} />
                  <span className="!text-sm !font-medium">{label}</span>
                  {isActive && <span className="!ml-auto">›</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
