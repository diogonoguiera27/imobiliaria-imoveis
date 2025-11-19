import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { socket } from "@/service/socket";
import { listarConversasDoUsuario, ChatContato } from "@/service/chatService";

/* =========================================================
   📦 Tipos
========================================================= */
type Usuario = ChatContato & {
  online?: boolean;
  naoLidas?: number;
};

interface NovaMensagemEvent {
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  criadoEm?: string;
}

interface ChatListProps {
  corretores?: Usuario[];
  onSelectCorretor: (usuario: Usuario) => void;
  userId?: number;
  userRole?: "USER" | "CORRETOR" | "ADMIN";
  digitandoPor?: number | null;
  contadorNaoLidas?: Record<number, number>;
  usuariosOnline?: number[];
}

/* =========================================================
   🕒 Função estilo WhatsApp
========================================================= */
function formatarDataChat(dataISO?: string) {
  if (!dataISO) return "";

  const data = new Date(dataISO);
  const agora = new Date();

  const dia = data.getDate();
  const mes = data.getMonth();
  const ano = data.getFullYear();

  const diaAtual = agora.getDate();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const diffMs = agora.getTime() - data.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dia === diaAtual && mes === mesAtual && ano === anoAtual) {
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDias === 1) return "Ontem";

  if (diffDias <= 7) {
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return diasSemana[data.getDay()];
  }

  if (ano === anoAtual) {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }

  return data.toLocaleDateString("pt-BR");
}

/* =========================================================
   💬 ChatList — Lista estilo WhatsApp
========================================================= */
export default function ChatList({
  corretores = [],
  onSelectCorretor,
  userId,
  userRole,
  digitandoPor,
  contadorNaoLidas = {},
  usuariosOnline = [],
}: ChatListProps) {
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(corretores);

  /* =========================================================
     🔁 Atualiza lista inicial
  ========================================================== */
  useEffect(() => {
    // Sempre que a lista de conversas (corretores) mudar, aplicamos
    // o status `online` com base na lista `usuariosOnline`.
    setUsuarios(
      corretores.map((u) => ({
        ...u,
        online: usuariosOnline.includes(u.id),
      }))
    );
  }, [corretores, usuariosOnline]);

  /* =========================================================
     🟢 Atualiza status online em TEMPO REAL
  ========================================================== */
  useEffect(() => {
    const marcarOnline = (id: number) => {
      setUsuarios((prev) =>
        prev.map((u) => ({
          ...u,
          online: u.id === id ? true : u.online,
        }))
      );
    };

    const marcarOffline = (id: number) => {
      setUsuarios((prev) =>
        prev.map((u) => ({
          ...u,
          online: u.id === id ? false : u.online,
        }))
      );
    };

    const userOnlineHandler = ({ userId }: { userId: number }) => marcarOnline(userId);
    const userOfflineHandler = ({ userId }: { userId: number }) => marcarOffline(userId);

    socket.on("user_online", userOnlineHandler);
    socket.on("user_offline", userOfflineHandler);

    setUsuarios((prev) =>
      prev.map((u) => ({
        ...u,
        online: usuariosOnline.includes(u.id),
      }))
    );

    return () => {
      socket.off("user_online", userOnlineHandler);
      socket.off("user_offline", userOfflineHandler);
    };
  }, [usuariosOnline]);

  /* =========================================================
     📡 Carrega conversas — AGORA MEMORIZADO (useCallback)
  ========================================================== */
  const sincronizarConversas = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await listarConversasDoUsuario(userId);

      const ordenado = [...data]
        .map((u) => ({
          ...u,
          online: usuariosOnline.includes(u.id),
        }))
        .sort(
          (a, b) =>
            new Date(b.horario || "").getTime() -
            new Date(a.horario || "").getTime()
        );

      setUsuarios(ordenado);
    } catch (err) {
      console.error("❌ Erro ao carregar conversas:", err);
    }
  }, [userId, usuariosOnline]);

  /* =========================================================
     🔄 ATUALIZAÇÃO AUTOMÁTICA VIA EVENTO GLOBAL
     resolvido: sem erros, cleanup correto
  ========================================================== */
  useEffect(() => {
    function atualizar() {
      console.log("🔔 Atualizando lista via evento global…");
      sincronizarConversas();
    }

    window.addEventListener("atualizar_conversas_chat", atualizar);

    return () => {
      window.removeEventListener("atualizar_conversas_chat", atualizar);
    };
  }, [sincronizarConversas]);

  /* =========================================================
     🔄 Recebe nova mensagem e atualiza item da lista
  ========================================================== */
  useEffect(() => {
    const handler = (data: NovaMensagemEvent) => {
      console.log("📩 nova_mensagem_lista → Atualizando item…");

      setUsuarios((prev) => {
        const atualizado = [...prev];

        const idx = atualizado.findIndex(
          (u) => u.id === data.remetenteId || u.id === data.destinatarioId
        );

        const horario = data.criadoEm
          ? new Date(data.criadoEm).toISOString()
          : new Date().toISOString();

        if (idx !== -1) {
          atualizado[idx] = {
            ...atualizado[idx],
            ultimaMensagem: data.conteudo,
            horario,
          };
        }

        return atualizado.sort(
          (a, b) =>
            new Date(b.horario || "").getTime() -
            new Date(a.horario || "").getTime()
        );
      });
    };

    socket.on("nova_mensagem_lista", handler);

    return () => {
      socket.off("nova_mensagem_lista", handler);
    };
  }, []);

  /* =========================================================
     🔍 Filtro de busca
  ========================================================== */
  const filtrados = usuarios
    .filter((u) => {
      if (!userRole) return true;
      if (userRole === "CORRETOR") return u.role === "USER";
      if (userRole === "USER") return u.role === "CORRETOR";
      return true;
    })
    .filter((u) => u.nome.toLowerCase().includes(busca.toLowerCase()));

  /* =========================================================
     🎨 Avatar fallback
  ========================================================== */
  const obterAvatar = (u: Usuario) => {
    if (u.avatar && u.avatar.startsWith("http")) return u.avatar;
    if (u.avatarUrl && u.avatarUrl.startsWith("http")) return u.avatarUrl;
    if (u.avatar?.startsWith("/")) {
      return `${
        import.meta.env.VITE_API_URL || "http://localhost:3333"
      }${u.avatar}`;
    }
    return `https://i.pravatar.cc/100?u=${u.id}`;
  };

  /* =========================================================
     🎨 Renderização WHATSAPP-LIKE
  ========================================================== */
  return (
    <div className="!flex !flex-col !h-full !bg-gradient-to-b !from-green-300 !to-white !rounded-3xl !overflow-hidden">
      <div className="!p-5 !pb-3 !border-b !border-gray-200">
        <h2 className="!text-xl !font-semibold !text-gray-800">Conversas</h2>

        <div className="!mt-3 !relative">
          <Search className="!absolute !left-3 !top-2.5 !text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar contato..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="!w-full !pl-10 !pr-3 !py-2 !rounded-full !border !border-gray-300 !bg-white !text-sm focus:!ring-2 focus:!ring-green-400"
          />
        </div>
      </div>

      {/* ===== LISTA ===== */}
      <div className="!flex-1 !overflow-y-auto !bg-white">
        {filtrados.length === 0 ? (
          <div className="!p-5 !text-gray-500 !text-center">
            Nenhum contato ainda 😕
          </div>
        ) : (
          filtrados.map((u) => {
            const naoLidas = Math.max(
              contadorNaoLidas?.[u.id] ?? u.naoLidas ?? 0,
              0
            );

            return (
              <button
                key={u.id}
                onClick={() => onSelectCorretor(u)}
                className="!w-full !flex !items-center !gap-4 !px-5 !py-3 hover:!bg-green-50 !transition-all !cursor-pointer !border-b !border-gray-100"
              >
                {/* Avatar */}
                <div className="!relative">
                  <img
                    src={obterAvatar(u)}
                    alt={u.nome}
                    className="!w-12 !h-12 !rounded-full !object-cover !bg-gray-200"
                  />

                  {u.online && (
                    <span className="!absolute !bottom-0 !right-0 !w-3 !h-3 !bg-green-500 !rounded-full !border-2 !border-white" />
                  )}
                </div>

                {/* Nome e última mensagem */}
                <div className="!flex-1 !text-left !min-w-0">
                  <h3 className="!text-sm !font-semibold !truncate !text-gray-800">
                    {u.nome}
                  </h3>

                  {digitandoPor === u.id ? (
                    <span className="!text-green-500 !text-sm">digitando...</span>
                  ) : (
                    <p className="!text-xs !text-gray-500 !truncate">
                      {u.ultimaMensagem || "Inicie uma conversa"}
                    </p>
                  )}
                </div>

                {/* Horário + Badge */}
                <div className="!flex !flex-col !items-end !gap-2">
                  {naoLidas > 0 && (
                    <span className="!bg-green-500 !text-white !rounded-full !text-[11px] !w-5 !h-5 !flex !items-center !justify-center !font-bold">
                      {naoLidas > 99 ? "99+" : naoLidas}
                    </span>
                  )}

                  <div className="!text-xs !text-gray-400">
                    {formatarDataChat(u.horario)}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
