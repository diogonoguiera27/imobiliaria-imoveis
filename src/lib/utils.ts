import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Imovel } from "@/types"; // 👈 adicione isso aqui

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🔹 Nova função utilitária
export function priorizarImoveisDaCidade(imoveis: Imovel[], cidade: string): Imovel[] {
  const cidadeLower = cidade.toLowerCase();

  const daCidade = imoveis.filter((i) => i.cidade?.toLowerCase() === cidadeLower);
  const outras = imoveis.filter((i) => i.cidade?.toLowerCase() !== cidadeLower);

  return [...daCidade, ...outras];
}
