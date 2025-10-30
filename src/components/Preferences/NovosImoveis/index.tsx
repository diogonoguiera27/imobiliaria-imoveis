import { Switch } from "@/components/ui/switch";
import { useEffect, useState, useRef } from "react";
import {
  getNotificationPreferences,
  saveNotificationPreference,
} from "@/service/notificationService";
import { useAuth } from "@/hooks/auth";

export default function NovoImoveisOptions() {
  const { token } = useAuth();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!token) return;

    getNotificationPreferences("NovosImoveis", token).then((pref) => {
      // 🔧 Se vier um array, pega o primeiro item
      const p = Array.isArray(pref) ? pref[0] : pref;

      setEmail(p?.porEmail ?? true);
      setPush(p?.porPush ?? false);
      isFirstLoad.current = false;
    });
  }, [token]);

  const handleToggle = async (field: "porEmail" | "porPush", value: boolean) => {
    if (!token) return;

    // Atualiza estado local
    if (field === "porEmail") setEmail(value);
    if (field === "porPush") setPush(value);

    const updated = {
      tipo: "NovosImoveis",
      porEmail: field === "porEmail" ? value : email,
      porPush: field === "porPush" ? value : push,
    };

    try {
      await saveNotificationPreference(updated, token);
    } catch (error) {
      // 🔁 rollback se falhar
      if (field === "porEmail") setEmail((prev) => !prev);
      if (field === "porPush") setPush((prev) => !prev);
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <div className="space-y-3">
      {/* 💌 Notificação por E-mail */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Notificação por E-mail</span>
        <Switch
          checked={email}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porEmail", checked);
          }}
        />
      </div>

      {/* 🔔 Notificação Push */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Notificação Push</span>
        <Switch
          checked={push}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porPush", checked);
          }}
        />
      </div>
    </div>
  );
}
 