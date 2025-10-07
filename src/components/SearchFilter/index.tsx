// ✅ src/components/Home/FiltroBusca.tsx
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import api from "@/service/api";
import type { Imovel } from "@/types";

// 🔹 Função utilitária para normalizar (sem acentos + minúsculo)
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

const SearchFilter = ({ onFiltrar, onLimparFiltro, filtroAtivo }: Props) => {
  const [valorMax, setValorMax] = useState<number>(3_000_000);
  const [tipo, setTipo] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");

  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[]>([]);

  // 🔹 Carregar cidades únicas de todos os imóveis
  useEffect(() => {
    api
      .get("/property", { params: { take: 9999 } })
      .then((res) => {
        const lista = (res.data?.data ?? []) as Imovel[];
        const nomes = lista
          .map((p) => (p.cidade ?? "").trim())
          .filter((nome) => nome.length > 0);

        const unicasMap = new Map<string, string>();
        nomes.forEach((nome) => {
          const chave = normalize(nome);
          if (!unicasMap.has(chave)) unicasMap.set(chave, nome);
        });

        const unicas = Array.from(unicasMap.values()).sort((a, b) =>
          a.localeCompare(b, "pt-BR")
        );

        setCidadesDisponiveis(unicas);
      })
      .catch((err) => console.error("Erro ao carregar cidades:", err));
  }, []);

  // 🔹 Resetar filtros via evento global
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

  const handleLimpar = () => {
    setValorMax(3_000_000);
    setTipo("");
    setCidade("");
    onLimparFiltro();
  };

  return (
    <div
      className="
        !w-[120%] sm:!w-full          /* 🔹 Mesmo comportamento do card de imóveis destaque */
        !max-w-[80%]                  /* 🔹 Igual ao container do destaque */
        !mx-auto                      /* 🔹 Centralizado */
        md:!max-w-[1412px]            /* 🔹 Desktop padrão */
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          !bg-white !rounded-xl !shadow-xl
          !px-3 sm:!px-6               /* 🔹 Mobile mais justo, desktop espaçado */
          !py-6
          !flex !flex-col sm:!flex-row !flex-wrap
          !gap-6 !items-end !w-full
          !border !border-gray-200
        "
      >
        {/* 🔹 Preço */}
        <div className="!flex !flex-col !w-full sm:!w-[380px]">
          <label className="!text-gray-800 !text-sm !font-semibold !mb-1">
            Filtrar por Preço
          </label>
          <Input
            type="range"
            min={50_000}
            max={3_000_000}
            step={10_000}
            value={valorMax}
            onChange={(e) => setValorMax(Number(e.target.value))}
            className="!w-full !accent-red-600"
          />
          <div className="!text-gray-700 !text-sm !font-semibold !mt-1">
            Até R${valorMax.toLocaleString("pt-BR")}
          </div>
        </div>

        {/* 🔹 Tipo */}
        <div className="!flex !flex-col !w-full sm:!flex-1">
          <label className="!text-gray-800 !text-sm !font-semibold !mb-1">
            Tipo de Imóvel
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="
              !w-full !rounded !px-4 !py-2
              !bg-white !text-black
              !border !border-gray-300
            "
          >
            <option value="">Selecionar</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Condomínio">Condomínio</option>
            <option value="Casa Residencial">Casa Residencial</option>
          </select>
        </div>

        {/* 🔹 Cidade */}
        <div className="!flex !flex-col !w-full sm:!flex-1">
          <label className="!text-gray-800 !text-sm !font-semibold !mb-1">
            Cidade
          </label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="
              !w-full !rounded !px-4 !py-2
              !bg-white !text-black
              !border !border-gray-300
            "
          >
            <option value="">Selecionar</option>
            {cidadesDisponiveis.map((nome, idx) => (
              <option key={idx} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Botões */}
        <div className="!flex !flex-col sm:!flex-row !justify-end !w-full sm:!w-[200px] !gap-4">
          <Button
            type="submit"
            className="
              !bg-red-600 !text-white
              !font-semibold !px-6 !py-3
              !rounded hover:!bg-red-700
              !w-full
            "
          >
            Pesquisar
          </Button>
          {filtroAtivo && (
            <Button
              type="button"
              variant="outline"
              onClick={handleLimpar}
              className="
                !bg-gray-200 !text-gray-700
                !font-semibold !px-6 !py-3
                !rounded hover:!bg-gray-300
                !w-full
              "
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;
