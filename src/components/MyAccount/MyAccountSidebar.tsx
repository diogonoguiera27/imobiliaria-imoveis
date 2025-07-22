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
    <div className="!bg-gradient-to-br !from-white !via-red-50 !to-red-100 !rounded-xl !p-4 !shadow-xl !border !border-red-100">
      <ul className="!space-y-1">
        {tabs.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              onClick={() => onTabChange(label)}
              className={`!w-full !flex !items-center !gap-3 !py-3 !px-4 !rounded-lg !transition ${
                activeTab === label
                  ? "!bg-red-500 !text-white"
                  : "hover:!bg-purple-50 !text-gray-700"
              }`}
            >
              <Icon size={18} />
              <span className="!text-sm !font-medium">{label}</span>
              {activeTab === label && <span className="!ml-auto">›</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
