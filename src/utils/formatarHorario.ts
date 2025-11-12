/**
 * Formata apenas o horário (HH:MM) de uma mensagem
 */
export function formatarHorario(dataISO?: string): string {
  if (!dataISO) return "";

  const data = new Date(dataISO);
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata o separador de dia (Hoje, Ontem, ou dia da semana capitalizado)
 * Usado para agrupar mensagens por dia na lista de conversas e no chat
 */
export function formatarDia(dataISO?: string): string {
  if (!dataISO) return "";

  const data = new Date(dataISO);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  // Verifica se é hoje
  const ehHoje =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();

  // Verifica se é ontem
  const ehOntem =
    data.getDate() === ontem.getDate() &&
    data.getMonth() === ontem.getMonth() &&
    data.getFullYear() === ontem.getFullYear();

  if (ehHoje) return "Hoje";
  if (ehOntem) return "Ontem";

  // Caso contrário, mostra o dia da semana com primeira letra maiúscula
  return data
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Formata data para exibição na lista de conversas (compatível com WhatsApp)
 * Hoje → HH:MM
 * Ontem → Ontem
 * Semana passada → Dia da semana
 * Mais antigo → dd/mm/aaaa
 */
export function formatarDataWhatsApp(dataISO?: string): string {
  if (!dataISO) return "";

  const data = new Date(dataISO);
  const agora = new Date();

  // Zera hora pra comparar dias
  const dataDia = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const hojeDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

  const diffMs = hojeDia.getTime() - dataDia.getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Se é hoje → mostra só a hora
  if (diffDias === 0) {
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  // Se foi ontem → mostra "Ontem"
  if (diffDias === 1) return "Ontem";

  // Se está na mesma semana → mostra o dia da semana (com primeira letra maiúscula)
  if (diffDias < 7) {
    return data
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  // Caso contrário → mostra data padrão dd/mm/aaaa
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
