import api from "./api";

/**
 * ========================================================
 * 📊 DASHBOARD SERVICE (versão tipada e sem any)
 * ========================================================
 * - /dashboard/summary → Dados dos cards
 * - /dashboard/chart   → Dados do gráfico (filtrável por data)
 * ========================================================
 */

/** Tipagem do resumo retornado pela rota /dashboard/summary */
export interface DashboardSummary {
  totalImoveis: number;
  ativos: number;
  inativos: number;
  usuariosAtivos: number;
  corretores: number;
  vendedores: number;
  valorPatrimonialTotal: number;
}

/** Tipagem dos itens do gráfico de imóveis cadastrados */
export interface DashboardChartItem {
  day: string;
  imoveis: number;
}

/**
 * Retorna o header com o token JWT armazenado no localStorage.
 */
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Busca o resumo geral do Dashboard (somente ADMIN).
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await api.get<DashboardSummary>("/dashboard/summary", {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar o resumo do dashboard:", error);
    throw new Error("Erro ao buscar dados do dashboard.");
  }
}

/**
 * Busca os dados do gráfico de cadastros por dia.
 * Pode receber intervalo opcional (from, to).
 */
export async function getDashboardChart(
  from?: Date,
  to?: Date
): Promise<DashboardChartItem[]> {
  try {
    const params = new URLSearchParams();
    if (from) params.append("from", from.toISOString());
    if (to) params.append("to", to.toISOString());

    const response = await api.get<DashboardChartItem[]>(
      `/dashboard/chart?${params.toString()}`,
      { headers: getAuthHeader() }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao carregar gráfico do dashboard:", error);
    throw new Error("Erro ao buscar dados do gráfico.");
  }
}

/**
 * Verifica se o usuário logado é ADMIN (para proteger a rota no front).
 */
export function isAdminUser(): boolean {
  const userData = localStorage.getItem("user");
  if (!userData) return false;

  try {
    const parsed = JSON.parse(userData) as { role?: string };
    return parsed.role === "ADMIN";
  } catch {
    return false;
  }
}


