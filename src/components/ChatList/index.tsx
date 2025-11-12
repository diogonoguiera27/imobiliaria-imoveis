import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { socket } from "@/service/socket";
import { listarConversasDoUsuario, ChatContato } from "@/service/chatService";
import { formatarHorario } from "@/utils/formatarHorario";

/* =========================================================
   📦 Tipos
========================================================= */
// ✅ Usa o tipo diretamente do serviço para garantir compatibilidade
type Usuario = ChatContato & {
  online?: boolean;
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
  usuariosOnline?: number[]; // 👈 array de usuários online
}


/* =========================================================
   🕓 Formatação estilo WhatsApp (usa util externo)
========================================================= */
// Agora usamos formatarHorario importado de src/utils/formatarHorario

/* =========================================================
   💬 Componente principal
========================================================= */
export default function ChatList({
  corretores = [],
  onSelectCorretor,
  userId,
  userRole,
  digitandoPor,
  contadorNaoLidas = {},
  usuariosOnline = [], // 👈 array de usuários online
}: ChatListProps) {
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(corretores);

  // Atualiza lista inicial vinda do ChatModal
  useEffect(() => {
    setUsuarios(corretores);
  }, [corretores]);

  // 🟢 Atualiza status online quando usuariosOnline muda
  useEffect(() => {
    setUsuarios((prev) =>
      prev.map((u) => ({
        ...u,
        online: usuariosOnline.includes(u.id),
      }))
    );
  }, [usuariosOnline]);

  // 📡 Atualiza lista via API e WebSocket
  useEffect(() => {
    if (!userId) return;

    // 🔹 Carrega conversas iniciais
    const carregarConversas = async () => {
      try {
        const data = await listarConversasDoUsuario(userId);
        // 🔍 Log para debug
        console.log("📋 Conversas carregadas do backend:", data);
        
        // Ordena pela data da última mensagem (mais recente primeiro)
        const ordenado = [...data].sort((a, b) =>
          (b.horario || "").localeCompare(a.horario || "")
        );
        setUsuarios(ordenado);
      } catch (err) {
        console.error("❌ Erro ao carregar conversas:", err);
      }
    };
    carregarConversas();

    //  Atualiza lista com a última mensagem em tempo real
    socket.on("nova_mensagem_lista", (data: NovaMensagemEvent) => {
      setUsuarios((prev) => {
        const atualizado = [...prev];
        const idx = atualizado.findIndex(
          (u) =>
            u.id === data.remetenteId || u.id === data.destinatarioId
        );

        // ⏰ Garante que o horário é uma data real
        const horario = data.criadoEm
          ? new Date(data.criadoEm).toISOString()
          : new Date().toISOString();

        if (idx !== -1) {
          // Atualiza o contato existente com a última mensagem
          atualizado[idx] = {
            ...atualizado[idx],
            ultimaMensagem: data.conteudo,
            horario,
          };
        } else {
          // Se for uma nova conversa ainda não listada
          const outroId =
            data.remetenteId === userId
              ? data.destinatarioId
              : data.remetenteId;

          const novo: Usuario = {
            id: outroId,
            nome: "Novo contato",
            avatar: `https://i.pravatar.cc/100?u=${outroId}`,
            ultimaMensagem: data.conteudo,
            horario,
          };
          atualizado.unshift(novo);
        }

        // 🔁 Ordena para mostrar a conversa mais recente primeiro
        return atualizado.sort(
          (a, b) =>
            new Date(b.horario || "").getTime() -
            new Date(a.horario || "").getTime()
        );
      });
    });

    return () => {
      socket.off("nova_mensagem_lista");
    };
  }, [userId]);

  /* 🔍 Filtro de busca + filtro por tipo de usuário */
  const filtrados = usuarios
    .filter((u) => {
      // ✅ Se não houver userRole definido, mostra todos
      if (!userRole) return true;
      
      // 🔹 Corretor vê apenas clientes (USER)
      if (userRole === "CORRETOR") return u.role === "USER";
      
      // 🔹 Cliente (USER) vê apenas corretores (CORRETOR)
      if (userRole === "USER") return u.role === "CORRETOR";
      
      return true;
    })
    .filter((u) => u.nome.toLowerCase().includes(busca.toLowerCase()));

  /* =========================================================
     🎨 Função para obter avatar correto com fallback
  ========================================================= */
  const obterAvatar = (usuario: Usuario): string => {
    // ✅ Prioridade 1: avatar (como retornado pelo backend com avatarUrl)
    if (usuario.avatar && usuario.avatar.startsWith("http")) {
      return usuario.avatar;
    }
    
    // ✅ Prioridade 2: avatarUrl (caso exista)
    if (usuario.avatarUrl && usuario.avatarUrl.startsWith("http")) {
      return usuario.avatarUrl;
    }
    
    // ✅ Prioridade 3: avatar (pode ser apenas um caminho)
    if (usuario.avatar) {
      // Se for um caminho local, concatena com a URL base
      if (usuario.avatar.startsWith("/")) {
        return `${import.meta.env.VITE_API_URL || "http://localhost:3333"}${usuario.avatar}`;
      }
      return usuario.avatar;
    }
    
    // ✅ Fallback final: gera avatar padrão baseado no ID
    return `https://i.pravatar.cc/100?u=${usuario.id}`;
  };

  /* =========================================================
     🎨 Renderização
  ========================================================= */
  return (
    <div
      className="
        !flex !flex-col !h-full 
        !bg-gradient-to-b !from-green-300 !to-white
        !rounded-3xl !overflow-hidden
      "
    >
      {/* ===== HEADER ===== */}
      <div className="!p-5 !pb-3 !border-b !border-gray-200">
        <h2 className="!text-xl !font-semibold !text-gray-800">
          Conversas
        </h2>

        {/* 🔍 Campo de busca */}
        <div className="!mt-3 !relative">
          <Search
            className="!absolute !left-3 !top-2.5 !text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar corretor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="
              !w-full !pl-10 !pr-3 !py-2 
              !rounded-full 
              !border !border-gray-300 
              !bg-white 
              !text-sm 
              focus:!outline-none focus:!ring-2 focus:!ring-green-400
              !transition-all
            "
          />
        </div>
      </div>

      {/* ===== LISTA ===== */}
      <div
        className="
          !flex-1 
          !overflow-y-auto 
          !bg-white 
          !scroll-smooth
        "
      >
        {filtrados.length === 0 ? (
          <div className="!p-5 !text-gray-500 !text-center">
            Nenhum corretor contatado ainda 😕
          </div>
        ) : (
          filtrados.map((u) => (
            <button
              key={u.id}
              onClick={() => onSelectCorretor(u)}
              className="
                !w-full 
                !flex !items-center !gap-4 
                !px-5 !py-3 
                hover:!bg-green-50 
                !transition-all !duration-150 
                !cursor-pointer !border-b !border-gray-100
              "
            >
              {/* Avatar + status */}
              <div className="!relative">
                <img
                  src={obterAvatar(u)}
                  alt={u.nome}
                  className="!w-12 !h-12 !rounded-full !object-cover !bg-gray-200"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    // Log para debug
                    console.warn(`❌ Erro ao carregar avatar para ${u.nome} (ID: ${u.id}), usando fallback...`);
                    // Fallback: usa avatar genérico
                    img.src = `https://i.pravatar.cc/100?u=${u.id}`;
                  }}
                  loading="lazy"
                />
                {usuariosOnline.includes(u.id) && (
                  <span
                    className="
                      !absolute !bottom-0 !right-0 
                      !w-3 !h-3 
                      !bg-green-500 
                      !rounded-full 
                      !border-2 !border-white
                    "
                  />
                )}
              </div>

              {/* Nome + última mensagem */}
              <div className="!flex-1 !text-left !min-w-0">
                <h3 className="!text-sm !font-semibold !truncate !text-gray-800">
                  {u.nome}
                </h3>
                {/* Mostra `digitando...` em verde quando aplicável (sem bolinha) */}
                {digitandoPor === u.id ? (
                  <span className="!text-green-500 !text-sm !font-medium">digitando...</span>
                ) : (
                  <p className="!text-xs !text-gray-500 !truncate">
                    {u.ultimaMensagem || "Inicie uma conversa"}
                  </p>
                )}
              </div>

              {/* Horário + badge de não lidas */}
              <div className="!flex !flex-col !items-end !gap-2">
                {(() => {
                  const naoLidas = Math.max(contadorNaoLidas?.[u.id] ?? 0, 0);
                  console.log(`� Renderizando ${u.nome} (ID: ${u.id}): ${naoLidas} não lidas`);
                  return naoLidas > 0 && (
                    <span className="!bg-green-500 !text-white !rounded-full !text-xs !w-6 !h-6 !flex !items-center !justify-center !font-bold">
                      {naoLidas}
                    </span>
                  );
                })()}
                <div className="!text-xs !text-gray-400">
                  {u.horario ? formatarHorario(u.horario) : ""}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
