import { useEffect, useRef } from "react";
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
  q?: string;
  cidade?: string;
  tipo?: TipoImovel;
  negocio?: TipoNegocio;
  ativo?: boolean;
};

type Props = {
  q?: string;
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
  allCities: string[];
  onApply: () => void;
  TIPO_IMOVEL_OPCOES: TipoImovel[];
  TIPO_NEGOCIO_OPCOES: TipoNegocio[];
};

export default function FiltersMyProperty({
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
  allCities,
  onApply,
  TIPO_IMOVEL_OPCOES,
  TIPO_NEGOCIO_OPCOES,
}: Props) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterRef.current) return;
    console.log("📏 Largura do card:", filterRef.current.offsetWidth);
  }, []);

  return (
    <div
      ref={filterRef}
      className="
    !relative
    !bg-white
    !rounded-[12px]
    !shadow-[0_8px_28px_rgba(0,0,0,0.08)]
    !border
    !border-gray-200
    !p-[32px]
    !w-[420px]
    !h-[518px]
    !flex
    !flex-col
    !justify-start
  "
    >
      {/* 🔹 Cabeçalho */}
      <div className="!mb-[24px] !w-full">
        <h1
          className="
        !text-[34px]
        !font-bold
        !text-gray-900
        !leading-[1.2]
        !tracking-tight
        !mb-[8px]
      "
        >
          Descubra acomodações em <span className="!text-red-600">Goiás</span>
        </h1>

        <p
          className="
        !text-[16px]
        !text-[#6b6b6b]
        !leading-snug
        !w-full
      "
        >
          As melhores viagens começam no Airbnb, com acomodações únicas para
          todos os tipos de viagem.
        </p>
      </div>

      {/* 🔸 Formulário */}
      <form className="!flex !flex-col !gap-2 !w-full">
        {/* 🏠 Localização */}
        <label
          className="
        !h-[60px]
        !w-full
        !text-[14px]
        !rounded-[8px]
        !border
        !border-[#dddddd]
        focus-within:!border-black
        !transition
        !px-[16px]
        !pt-[14px]
        !pb-[8px]
        !flex
        !flex-col
        !justify-center
      "
        >
          <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
            Localização
          </span>
          <Input
            placeholder="Goiás, Brasil"
            value={q || ""}
            onChange={(e) => setQ(e.target.value)}
            className="
          !h-[22px]
          !px-0
          !border-0
          !shadow-none
          !text-[15px]
          !bg-transparent
          !w-full
          focus:!ring-0
          focus:!outline-none
          placeholder:!text-neutral-400
        "
          />
        </label>

        {/* 🏡 Tipo / Negócio */}
        <div
          className="
        !relative
        !flex
        !border
        !border-[#dddddd]
        !rounded-[8px]
        !overflow-hidden
        focus-within:!border-black
        !h-[62px]
        !w-full
      "
        >
          {/* Tipo */}
          <label
            className="
          !w-1/2
          !h-[60px]
          !flex
          !flex-col
          !justify-center
          !px-[16px]
          !pt-[14px]
          !pb-[8px]
          !text-[13px]
          !leading-tight
          !cursor-pointer
        "
          >
            <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
              Tipo
            </span>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as TipoImovel)}
            >
              <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0 focus:!outline-none">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {TIPO_IMOVEL_OPCOES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          {/* Divisor */}
          <span className="!absolute !top-0 !bottom-0 !left-1/2 !w-px !bg-[#dddddd]" />

          {/* Negócio */}
          <label
            className="
          !w-1/2
          !h-[60px]
          !flex
          !flex-col
          !justify-center
          !px-[16px]
          !pt-[14px]
          !pb-[8px]
          !text-[13px]
          !leading-tight
          !cursor-pointer
        "
          >
            <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
              Negócio
            </span>
            <Select
              value={negocio}
              onValueChange={(v) => setNegocio(v as TipoNegocio)}
            >
              <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0 focus:!outline-none">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {TIPO_NEGOCIO_OPCOES.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n === "venda" ? "Venda" : "Aluguel"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* 🌆 Cidade / Status */}
        <div
          className="
        !relative
        !flex
        !border
        !border-[#dddddd]
        !rounded-[8px]
        !overflow-hidden
        focus-within:!border-black
        !h-[62px]
        !w-full
      "
        >
          {/* Cidade */}
          <label
            className="
          !w-1/2
          !h-[60px]
          !flex
          !flex-col
          !justify-center
          !px-[16px]
          !pt-[14px]
          !pb-[8px]
          !text-[13px]
          !leading-tight
          !cursor-pointer
        "
          >
            <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
              Cidade
            </span>
            <Select value={cidade} onValueChange={(v) => setCidade(v)}>
              <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0 focus:!outline-none">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {allCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          {/* Divisor */}
          <span className="!absolute !top-0 !bottom-0 !left-1/2 !w-px !bg-[#dddddd]" />

          {/* Status */}
          <label
            className="
          !w-1/2
          !h-[60px]
          !flex
          !flex-col
          !justify-center
          !px-[16px]
          !pt-[14px]
          !pb-[8px]
          !text-[13px]
          !leading-tight
          !cursor-pointer
        "
          >
            <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
              Status
            </span>
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
              <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0 focus:!outline-none">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* 🔘 Botão */}
        <div className="!mt-3 !w-full">
          <Button
            type="button"
            className="
          !w-full
          !h-[48px]
          !rounded-[8px]
          !font-semibold
          !text-white
          !text-[15px]
          !tracking-wide
          !bg-gradient-to-r
          !from-[#ff385c]
          !to-[#e61e4d]
          hover:!opacity-90
          !transition
          !shadow-[0_1px_2px_rgba(0,0,0,0.1)]
          !flex
          !items-center
          !justify-center
        "
            onClick={onApply}
          >
            Aplicar filtros
          </Button>
        </div>
      </form>
    </div>
  );
}
