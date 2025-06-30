import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const FiltroBusca = () => {
  const [valorMax, setValorMax] = useState(3000000);
  const [valorMin] = useState(500000);
  const [tipo, setTipo] = useState("");
  const [cidade, setCidade] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buscar imóveis tipo: ${tipo}, cidade: ${cidade}, entre R$${valorMin} e R$${valorMax}`);
  };

  return (
    <div className="w-full !flex !justify-start !-mt-[120px] z-10 !relative !px-10">
      <form
        onSubmit={handleSubmit}
        className="!bg-white !rounded-xl !shadow-xl !px-6 !py-6 !flex !flex-col sm:!flex-row !flex-wrap !gap-6 !items-end !max-w-6xl !w-full border border-gray-200"
      >
        
        <div className="flex !flex-col !w-full sm:!w-[400px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">Filtrar por Preço</label>
          <Input
            type="range"
            min={500000}
            max={3000000}
            step={50000}
            value={valorMax}
            onChange={(e) => setValorMax(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="text-gray-700 text-sm font-semibold mt-1">
            R${valorMin.toLocaleString("pt-BR")} — R${valorMax.toLocaleString("pt-BR")}
          </div>
        </div>

        
        <div className="flex !flex-col !w-[200px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">Tipo de Imóvel</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="!rounded !px-4 !py-2 !bg-white !text-black !border"
          >
            <option value="">Selecionar</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="condominio">Condomínio</option>
          </select>
        </div>

        
        <div className="flex !flex-col !w-[220px]">
          <label className="!text-gray-800 !text-sm !font-semibold mb-1">Cidade</label>
          <select
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="!rounded !px-4 !py-2 !bg-white !text-black !border border-gray-300"
          >
            <option value="">Selecionar</option>
            <option value="goiania">Goiânia</option>
            <option value="aparecida">Aparecida de Goiânia</option>
          </select>
        </div>

       
        <div className="!flex !justify-end w-full sm:w-auto">
          <Button
            type="submit"
            className="!bg-red-600 !text-white !font-semibold !px-6 !py-3 !rounded hover:!bg-red-700"
          >
            Pesquisar
          </Button>
        </div>
      </form>
    </div>
  );
};
