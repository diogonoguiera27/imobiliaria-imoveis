import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useRef } from "react";
import {
  getNotificationPreferences,
  saveNotificationPreference,
} from "@/service/notificationService";
import { useAuth } from "@/hooks/auth";

export default function PesquisaOptions() {
  const { user, token } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user || !token) return;

    getNotificationPreferences("Pesquisas", token).then((pref) => {
      // 🔧 Se o backend retornar um array, usa o primeiro item
      const p = Array.isArray(pref) ? pref[0] : pref;

      setPushEnabled(p?.porPush ?? false);
      setEmailEnabled(p?.porEmail ?? true);
      isFirstLoad.current = false;
    });
  }, [user, token]);

  const handleToggle = async (field: "porEmail" | "porPush", value: boolean) => {
    if (!user || !token) return;

    if (field === "porPush") setPushEnabled(value);
    if (field === "porEmail") setEmailEnabled(value);

    const updated = {
      tipo: "Pesquisas",
      porPush: field === "porPush" ? value : pushEnabled,
      porEmail: field === "porEmail" ? value : emailEnabled,
    };

    try {
      await saveNotificationPreference(updated, token);
    } catch (error) {
      // 🔁 rollback automático em caso de erro
      if (field === "porPush") setPushEnabled((prev) => !prev);
      if (field === "porEmail") setEmailEnabled((prev) => !prev);
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {/* 🔔 Notificação por Push */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Notificar por Push</span>
        <Switch
          checked={pushEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porPush", checked);
          }}
        />
      </div>

      {/* 💌 Notificação por E-mail */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Notificar por E-mail</span>
        <Switch
          checked={emailEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porEmail", checked);
          }}
        />
      </div>
    </div>
  );
}
