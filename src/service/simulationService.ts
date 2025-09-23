import api from "./api";

/**
 * Payload para criar uma simulação.
 * ⚡ O backend usa userId da sessão, então userId aqui é opcional
 * (só precisa se o back exigir explicitamente, caso contrário pode remover).
 */
export interface CreateSimulationPayload {
  userId?: number;
  title: string;
  entry: number;
  installments: number;
  installmentValue: number;
}

/**
 * 🔒 Cria uma nova simulação.
 * O backend retorna também o uuid gerado.
 */
export async function createSimulation(data: CreateSimulationPayload) {
  const response = await api.post("/simulations", data);
  return response.data as {
    id: number;
    uuid: string | null;
    title: string;
    entry: number;
    installments: number;
    installmentValue: number;
    date: string;
    userId: number;
  };
}

/**
 * 🔹 Lista simulações de um usuário.
 * Aceita **userId** (número) ou **userUuid** (string).
 * Prefira uuid quando possível para não expor o id.
 */
export async function getSimulationsByUser(
  identifier: number | string
) {
  const response = await api.get(
    `/simulations/users/${identifier}/simulations`
  );
  return response.data as {
    id: number;
    uuid: string | null;
    title: string;
    entry: number;
    installments: number;
    installmentValue: number;
    date: string;
  }[];
}
