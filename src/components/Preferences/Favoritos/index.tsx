import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  getNotificationPreferences,
  saveNotificationPreference,
} from "@/service/notificationService";

export default function FavoritosOptions() {
  const { user, token } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!user || !token) return;

    getNotificationPreferences("Favoritos", token).then((pref) => {
      // 🔧 Se vier um array, usa o primeiro item
      const p = Array.isArray(pref) ? pref[0] : pref;

      setEmailEnabled(p?.porEmail ?? true);
      setPushEnabled(p?.porPush ?? false);
      isFirstLoad.current = false;
    });
  }, [user, token]);

  const handleToggle = async (
    field: "porEmail" | "porPush",
    value: boolean
  ) => {
    if (!user || !token) return;

    if (field === "porEmail") setEmailEnabled(value);
    if (field === "porPush") setPushEnabled(value);

    const updated = {
      tipo: "Favoritos",
      porEmail: field === "porEmail" ? value : emailEnabled,
      porPush: field === "porPush" ? value : pushEnabled,
    };

    try {
      await saveNotificationPreference(updated, token);
    } catch (error) {
      // 🔁 rollback em caso de falha
      if (field === "porEmail") setEmailEnabled((prev) => !prev);
      if (field === "porPush") setPushEnabled((prev) => !prev);
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* 💌 Notificação por E-mail */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">Notificação por E-mail</span>
        <Switch
          checked={emailEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porEmail", checked);
          }}
        />
      </div>

      {/* 🔔 Notificação Push */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">Notificação Push</span>
        <Switch
          checked={pushEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porPush", checked);
          }}
        />
      </div>
    </div>
  );
}
