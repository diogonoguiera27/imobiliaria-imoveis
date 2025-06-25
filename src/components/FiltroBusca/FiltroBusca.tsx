import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const FiltroBusca = () => {
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buscar imóveis do tipo: ${tipo} com valor: ${valor}`);
  };

  return (
    <div className="w-full !flex !justify-center !-mt-20 z-10 !relative">
      <form
        onSubmit={handleSubmit}
        className="!bg-white !rounded-xl !shadow-xl !px-6 !py-8 !flex !flex-col !sm:flex-row !sm:items-end !gap-6 !justify-between !max-w-5xl !w-full !min-h-[160px]"
      >
        {/* Campo Valor */}
        <div className="flex !flex-col !w-full !sm:w-1/3">
          <label className="!text-sm !font-semibold !mb-1 !text-black">Valor Máximo</label>
          <Input
            type="number"
            placeholder="Ex: 500000"
            value={valor}
            onChange={e => setValor(e.target.value)}
            className="!border !border-gray-300 !rounded !px-4 !py-2 !w-full"
          />
        </div>

        {/* Campo Tipo */}
        <div className="flex !flex-col !w-full !sm:w-1/3">
          <label className="!text-sm !font-semibold !mb-1 !text-black">Tipo</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="!border !border-gray-300 !rounded !px-4 !py-2 !w-full"
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="condominio">Condomínio</option>
          </select>
        </div>

        {/* Botão */}
        <div className="w-full !sm:w-auto !flex !justify-end !sm:items-end">
          <Button
            type="submit"
            className="!bg-red-600 !hover:bg-red-700 !text-white !font-bold !px-6 !py-3 !rounded !w-full !sm:w-auto"
          >
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
};
