import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  getNotificationPreferences,
  saveNotificationPreference,
} from "@/service/notificationService";

export default function AvisosOptions() {
  const { user, token } = useAuth();
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [aprovacoesEnabled, setAprovacoesEnabled] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user || !token) return;

    getNotificationPreferences("Avisos", token).then((pref) => {
      // 🔧 Se vier um array, pega o primeiro item
      const p = Array.isArray(pref) ? pref[0] : pref;

      setStatusEnabled(p?.porPush ?? false);
      setAprovacoesEnabled(p?.porEmail ?? true);
      isFirstLoad.current = false;
    });
  }, [user, token]);

  const handleToggle = async (field: "porEmail" | "porPush", value: boolean) => {
    if (!user || !token) return;

    if (field === "porPush") setStatusEnabled(value);
    if (field === "porEmail") setAprovacoesEnabled(value);

    const updated = {
      tipo: "Avisos",
      porPush: field === "porPush" ? value : statusEnabled,
      porEmail: field === "porEmail" ? value : aprovacoesEnabled,
    };

    try {
      await saveNotificationPreference(updated, token);
    } catch (error) {
      if (field === "porPush") setStatusEnabled((prev) => !prev);
      if (field === "porEmail") setAprovacoesEnabled((prev) => !prev);
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* 🔔 Preferência de status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Mudanças de status do imóvel</span>
        <Switch
          checked={statusEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porPush", checked);
          }}
        />
      </div>

      {/* 📧 Preferência de aprovações */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Aprovações e rejeições</span>
        <Switch
          checked={aprovacoesEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porEmail", checked);
          }}
        />
      </div>
    </div>
  );
}
