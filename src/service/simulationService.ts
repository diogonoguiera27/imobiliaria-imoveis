import api from "./api";

interface CreateSimulationPayload {
  userId: number;
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
}

// Cria uma nova simulação no banco
export async function createSimulation(data: CreateSimulationPayload) {
  const response = await api.post("/simulations", data);
  return response.data;
}

// Busca todas as simulações de um usuário específico
export async function getSimulationsByUser(userId: number) {
  const response = await api.get(`/simulations/users/${userId}/simulations`);
  return response.data;
}
