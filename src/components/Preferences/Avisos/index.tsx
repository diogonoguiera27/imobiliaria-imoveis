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
      setStatusEnabled(pref?.porPush ?? false); // status = push
      setAprovacoesEnabled(pref?.porEmail ?? true); // aprovações = email
      isFirstLoad.current = false;
    });
  }, [user, token]);

  const handleToggle = async (field: "porEmail" | "porPush", value: boolean) => {
    if (!user || !token) return;

    // Atualiza o estado imediatamente para feedback visual
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
      // Se der erro, desfaz o toggle
      if (field === "porPush") setStatusEnabled((prev) => !prev);
      if (field === "porEmail") setAprovacoesEnabled((prev) => !prev);
      console.error("Erro ao salvar preferência:", error);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Mudanças de status do imóvel</span>
        <Switch
          checked={statusEnabled}
          onCheckedChange={(checked) => {
            if (!isFirstLoad.current) handleToggle("porPush", checked);
          }}
        />
      </div>

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