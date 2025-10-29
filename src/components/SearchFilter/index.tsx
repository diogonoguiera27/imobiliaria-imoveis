import { useEffect, useState, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/service/api";
import type { Imovel } from "@/types";

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

type Props = {
  onFiltrar: (filtro: {
    tipo: string;
    cidade: string;
    precoMax: number;
  }) => void;
  onLimparFiltro: () => void;
  filtroAtivo: boolean;
};

export default function SearchFilter({
  onFiltrar,
  onLimparFiltro,
  filtroAtivo,
}: Props) {
  const [valorMax, setValorMax] = useState<number>(3_000_000);
  const [tipo, setTipo] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterRef.current) return;
    console.log("📏 Largura do filtro:", filterRef.current.offsetWidth);
  }, []);

  // 🔹 Carrega cidades
  useEffect(() => {
    api
      .get("/property", { params: { take: 9999 } })
      .then((res) => {
        const lista = (res.data?.data ?? []) as Imovel[];
        const nomes = lista
          .map((p) => (p.cidade ?? "").trim())
          .filter((n) => n.length > 0);

        const unicas = Array.from(
          new Map(nomes.map((n) => [normalize(n), n])).values()
        ).sort((a, b) => a.localeCompare(b, "pt-BR"));

        setCidadesDisponiveis(unicas);
      })
      .catch((err) => console.error("Erro ao carregar cidades:", err));
  }, []);

  // 🔹 Resetar filtros ao limpar
  useEffect(() => {
    const onClear = () => {
      setValorMax(3_000_000);
      setTipo("");
      setCidade("");
      onLimparFiltro();
    };
    window.addEventListener("clear-filters", onClear);
    return () => window.removeEventListener("clear-filters", onClear);
  }, [onLimparFiltro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo || cidade) {
      try {
        await api.post("/property/busca", { tipo, cidade });
      } catch (error) {
        console.error("Erro ao registrar busca:", error);
      }
    }

    onFiltrar({
      tipo: tipo.trim(),
      cidade: cidade.trim(),
      precoMax: Number.isFinite(valorMax) ? valorMax : 3_000_000,
    });
  };

  return (
    <div
      ref={filterRef}
      className="
        !relative !bg-white
        !rounded-[12px]
        !shadow-[0_8px_28px_rgba(0,0,0,0.08)]
        !border !border-gray-200
        !p-[24px] sm:!p-[28px]
        !w-full md:!w-[420px]
        !h-auto !flex !flex-col !gap-[12px]
      "
    >
      {/* 🔹 Cabeçalho */}
      <div className="!mb-[24px] !w-full">
        <h1 className="!text-[34px] !font-bold !text-gray-900 !leading-[1.2] !mb-[8px]">
          Encontre o imóvel{" "}
          <span className="!text-red-600">perfeito</span>
        </h1>
        <p className="!text-[16px] !text-[#6b6b6b] !leading-snug !w-full">
          Filtre imóveis por localização, tipo e faixa de preço.
        </p>
      </div>

      {/* 🔸 Formulário */}
      <form
        onSubmit={handleSubmit}
        className="!flex !flex-col !gap-2 !w-full"
      >
        {/* 📍 Cidade */}
        <label
          className="
            !h-[60px] !w-full
            !text-[14px] !rounded-[8px]
            !border !border-[#dddddd]
            focus-within:!border-black
            !px-[16px] !pt-[14px] !pb-[8px]
            !flex !flex-col !justify-center
          "
        >
          <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
            Cidade ou Bairro
          </span>
          <Select value={cidade} onValueChange={setCidade}>
            <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {cidadesDisponiveis.map((c) => (
                <SelectItem
                  key={c}
                  value={c}
                  className="!px-4 !py-2.5 !text-gray-700 !text-[15px]
                  hover:!bg-red-50 hover:!text-red-600
                  focus:!bg-red-100 focus:!text-red-700
                  !cursor-pointer !rounded-lg"
                >
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* 🏡 Tipo */}
        <label
          className="
            !h-[60px] !w-full
            !text-[14px] !rounded-[8px]
            !border !border-[#dddddd]
            focus-within:!border-black
            !px-[16px] !pt-[14px] !pb-[8px]
            !flex !flex-col !justify-center
          "
        >
          <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
            Tipo de Imóvel
          </span>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="!h-[22px] !px-0 !border-0 !shadow-none !bg-transparent focus:!ring-0">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {["Apartamento", "Casa Residencial", "Condomínio"].map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                  className="!px-4 !py-2.5 !text-gray-700 !text-[15px]
                  hover:!bg-red-50 hover:!text-red-600
                  focus:!bg-red-100 focus:!text-red-700
                  !cursor-pointer !rounded-lg"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* 💰 Preço */}
        <div className="!flex !flex-col !gap-1 !mt-2">
          <span className="!text-[10px] !font-semibold !uppercase !text-neutral-700 tracking-wide !mb-[2px]">
            Preço Máximo
          </span>
          <input
            type="range"
            min={50_000}
            max={3_000_000}
            step={10_000}
            value={valorMax}
            onChange={(e) => setValorMax(Number(e.target.value))}
            className="!w-full !accent-red-600"
          />
          <span className="!text-sm !font-medium !text-gray-700">
            Até R${valorMax.toLocaleString("pt-BR")}
          </span>
        </div>

        {/* 🔘 Botão */}
        <div className="!mt-3 !w-full">
          <Button
            type="submit"
            className="
              !w-full !h-[48px] !rounded-[10px]
              !font-semibold !text-white !text-[15px]
              !bg-gradient-to-r !from-red-500 !to-red-700
              hover:!from-red-600 hover:!to-red-800
              active:!scale-[0.98]
              !transition-all !duration-200
              !shadow-[0_4px_12px_rgba(0,0,0,0.1)]
            "
          >
            Aplicar filtros
          </Button>

          {filtroAtivo && (
            <Button
              type="button"
              variant="outline"
              onClick={onLimparFiltro}
              className="!mt-2 !w-full !border !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-gray-700"
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
