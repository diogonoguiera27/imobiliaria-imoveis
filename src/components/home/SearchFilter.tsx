import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import api from "@/service/api"; // ✅ import do seu client

type Props = {
  onFiltrar: (filtro: {
    tipo: string;
    cidade: string;
    precoMax: number;
  }) => void;
  onLimparFiltro: () => void;
  filtroAtivo: boolean;
};

const FiltroBusca = ({ onFiltrar, onLimparFiltro, filtroAtivo }: Props) => {
  const [valorMax, setValorMax] = useState(3000000);
  const [tipo, setTipo] = useState("");
  const [cidade, setCidade] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Envia a busca para o backend
    if (tipo) {
      try {
        await api.post("/property/busca", {
          tipo,
          cidade,
        });
      } catch (error) {
        console.error("Erro ao registrar busca:", error);
      }
    }

    // 🔁 Executa filtro normal
    onFiltrar({ tipo, cidade, precoMax: valorMax });

  };

  const handleLimpar = () => {
    setValorMax(3000000);
    setTipo("");
    setCidade("");
    onLimparFiltro();
  };

  return (
    <div className="w-full !flex !justify-center !-mt-[120px] z-10 !relative !px-10">
      <form
        onSubmit={handleSubmit}
        className="!bg-white !rounded-xl !shadow-xl !px-6 !py-6 !flex !flex-col sm:!flex-row !flex-wrap !gap-6 !items-end !max-w-6xl !w-full border border-gray-200"
      >
        <div className="flex !flex-col !w-full sm:!w-[400px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">
            Filtrar por Preço
          </label>
          <Input
            type="range"
            min={50000}
            max={3000000}
            step={10000}
            value={valorMax}
            onChange={(e) => setValorMax(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="text-gray-700 text-sm font-semibold mt-1">
            Até R${valorMax.toLocaleString("pt-BR")}
          </div>
        </div>

        <div className="flex !flex-col !w-[200px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">
            Tipo de Imóvel
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="!rounded !px-4 !py-2 !bg-white !text-black !border"
          >
            <option value="">Selecionar</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Condomínio">Condomínio</option>
            <option value="Casa Residencial">Casa Residencial</option>
          </select>
        </div>

        <div className="flex !flex-col !w-[220px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">
            Cidade
          </label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="!rounded !px-4 !py-2 !bg-white !text-black !border border-gray-300"
          >
            <option value="">Selecionar</option>
            <option value="Senador Canedo">Senador Canedo</option>
            <option value="Aparecida de Goiânia">Aparecida de Goiânia</option>
            <option value="Goiania">Goiania</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
          </select>
        </div>

        <div className="!flex !justify-end w-full sm:w-auto !space-x-4">
          <Button
            type="submit"
            className="!bg-red-600 !text-white !font-semibold !px-6 !py-3 !rounded hover:!bg-red-700"
          >
            Pesquisar
          </Button>
          {filtroAtivo && (
            <Button
              type="button"
              variant="outline"
              onClick={handleLimpar}
              className="!bg-gray-200 !text-gray-700 !font-semibold !px-6 !py-3 !rounded hover:!bg-gray-300"
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FiltroBusca;
