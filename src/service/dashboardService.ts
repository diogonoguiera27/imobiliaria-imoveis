import api from "./api";

/**
 * Retorna o header com o token JWT armazenado.
 */
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Busca o resumo do Dashboard do usuário logado.
 * Backend já retorna IDs e UUIDs quando disponível.
 */
export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary", {
    headers: getAuthHeader(),
  });
  return response.data;
}

/**
 * Registra uma visualização para um imóvel.
 * 🔑 Aceita tanto ID numérico quanto UUID (prefira UUID no front).
 */
export async function registrarVisualizacao(
  identifier: number | string
): Promise<void> {
  try {
    await api.post(
      `/property/${identifier}/view`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
  } catch (err) {
    console.error("Erro ao registrar visualização:", err);
  }
}
