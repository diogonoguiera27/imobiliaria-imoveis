
import api from "./api";


function getAuthHeader() {
  const token = localStorage.getItem("token"); 
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary", {
    headers: getAuthHeader(),
  });
  return response.data;
}

export async function registrarVisualizacao(propertyId: number) {
  try {
    await api.post(
      `/property/${propertyId}/view`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
  } catch (err) {
    console.error("Erro ao registrar visualização:", err);
  }
}
