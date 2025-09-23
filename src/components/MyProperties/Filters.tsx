import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import type { Imovel, TipoImovel, TipoNegocio } from "@/types";

export type AppliedFilters = {
  q: string;
  cidade?: string;
  tipo?: TipoImovel;
  negocio?: TipoNegocio;
  ativo?: boolean;
};

type Props = {
  q: string;
  setQ: (v: string) => void;
  cidade?: string;
  setCidade: (v?: string) => void;
  tipo?: TipoImovel;
  setTipo: (v?: TipoImovel) => void;
  negocio?: TipoNegocio;
  setNegocio: (v?: TipoNegocio) => void;
  applied: AppliedFilters;
  setApplied: React.Dispatch<React.SetStateAction<AppliedFilters>>;
  items: Imovel[];
  onApply: () => void;
  TIPO_IMOVEL_OPCOES: TipoImovel[];
  TIPO_NEGOCIO_OPCOES: TipoNegocio[];
};

export default function Filters({
  q,
  setQ,
  cidade,
  setCidade,
  tipo,
  setTipo,
  negocio,
  setNegocio,
  applied,
  setApplied,
  items,
  onApply,
  TIPO_IMOVEL_OPCOES,
  TIPO_NEGOCIO_OPCOES,
}: Props) {
  return (
    <div
      className="
        w-[285px]
        md:w-full        /* 🔹 mesma largura dos cards em <640px */
        sm:w-auto        /* 🔹 em >=640px usa largura automática */
        mx-auto          /* 🔹 centraliza no mobile */
        !rounded-2xl
        !bg-white
        !shadow-sm
        !ring-1
        !ring-neutral-200
        
      "
    >
      <div
        className="
          !grid
          !grid-cols-1
          md:!grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]
          !gap-4
          !items-end
          !p-4
          md:!p-5
        "
      >
        {/* Buscar */}
        <div className="!flex !flex-col !gap-1 !w-full">
          <label className="!text-xs !font-medium !text-neutral-600">
            Buscar
          </label>
          <Input
            placeholder="Bairro ou cidade"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="!h-10 !px-3 !w-full !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30"
          />
        </div>

        {/* Cidade */}
        <div className="!flex !flex-col !gap-1 !w-full">
          <label className="!text-xs !font-medium !text-neutral-600">
            Cidade
          </label>
          <Select value={cidade} onValueChange={setCidade}>
            <SelectTrigger className="!h-10 !px-3 !w-full !rounded-lg !border !border-neutral-300 !bg-white !text-sm !cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(items.map((i) => i.cidade))).map((c) => (
                <SelectItem
                  key={c}
                  value={c}
                  className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
                >
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo */}
        <div className="!flex !flex-col !gap-1 !w-full">
          <label className="!text-xs !font-medium !text-neutral-600">
            Tipo
          </label>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="!h-10 !px-3 !w-full !rounded-lg !border !border-neutral-300 !bg-white !text-sm !cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {TIPO_IMOVEL_OPCOES.map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                  className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Negócio */}
        <div className="!flex !flex-col !gap-1 !w-full">
          <label className="!text-xs !font-medium !text-neutral-600">
            Negócio
          </label>
          <Select value={negocio} onValueChange={setNegocio}>
            <SelectTrigger className="!h-10 !px-3 !w-full !rounded-lg !border !border-neutral-300 !bg-white !text-sm !cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {TIPO_NEGOCIO_OPCOES.map((n) => (
                <SelectItem
                  key={n}
                  value={n}
                  className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
                >
                  {n === "venda" ? "Venda" : "Aluguel"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="!flex !flex-col !gap-1 !w-full">
          <label className="!text-xs !font-medium !text-neutral-600">
            Status
          </label>
          <Select
            value={
              typeof applied.ativo === "boolean"
                ? applied.ativo
                  ? "active"
                  : "inactive"
                : "all"
            }
            onValueChange={(v) =>
              setApplied((prev) => ({
                ...prev,
                ativo: v === "all" ? undefined : v === "active",
              }))
            }
          >
            <SelectTrigger className="!h-10 !px-3 !w-full !rounded-lg !border !border-neutral-300 !bg-white !text-sm !cursor-pointer">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
              >
                Todos
              </SelectItem>
              <SelectItem
                value="active"
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
              >
                Ativos
              </SelectItem>
              <SelectItem
                value="inactive"
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100 !cursor-pointer"
              >
                Inativos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botão */}
        <div className="!flex !w-full md:!w-auto">
          <Button
            className="!h-10 !w-full md:!w-auto !rounded-lg !bg-blue-600 hover:!bg-blue-700"
            onClick={onApply}
          >
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
