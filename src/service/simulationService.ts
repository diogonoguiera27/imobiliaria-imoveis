import api from "./api";

interface CreateSimulationPayload {
  userId: number;
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
}


export async function createSimulation(data: CreateSimulationPayload) {
  const response = await api.post("/simulations", data);
  return response.data;
}


export async function getSimulationsByUser(userId: number) {
  const response = await api.get(`/simulations/users/${userId}/simulations`);
  return response.data;
}
