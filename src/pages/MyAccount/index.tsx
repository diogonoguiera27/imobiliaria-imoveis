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
  Bell
} from "lucide-react";

const tabs = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Simulations", icon: Calculator },
  { label: "Access Data", icon: KeyRound },
  { label: "Personal Data", icon: User },
  { label: "Preferences", icon: Bell },
];

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 text-gray-900 flex px-6 py-10">
      {/* Sidebar */}
      <aside className="w-72">
        <MyAccountSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />
      </aside>

      {/* Content */}
      <main className="flex-1 px-8">
        {activeTab === "Overview" && <MyAccountOverview />}
        {activeTab === "Simulations" && <MyAccountSimulations />}
        {activeTab === "Access Data" && <MyAccountAccessData />}
        {activeTab === "Personal Data" && <MyAccountPersonalData />}
        {activeTab === "Preferences" && <MyAccountPreferences />}
      </main>
    </div>
  );
}
