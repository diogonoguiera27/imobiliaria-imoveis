import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createSimulation } from "../../service/simulationService";
import { toast } from "react-toastify";

interface NovaSimulacaoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: number;
  onSimulacaoSalva?: () => void;
}

export function NovaSimulacaoModal({
  open,
  setOpen,
  userId,
  onSimulacaoSalva,
}: NovaSimulacaoModalProps) {
  const [form, setForm] = useState({
    titulo: "",
    valorImovel: "",
    entrada: "",
    parcelas: "",
  });

  const [valorParcela, setValorParcela] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSimular = () => {
    const valorImovel = parseFloat(form.valorImovel);
    const entrada = parseFloat(form.entrada);
    const parcelas = parseInt(form.parcelas);

    if (!valorImovel || !entrada || !parcelas || !form.titulo) {
      toast.warn("Preencha todos os campos corretamente.");
      return;
    }

    const valorFinanciado = valorImovel - entrada;
    const resultado = Math.round(valorFinanciado / parcelas);
    setValorParcela(resultado);
  };

  const handleSalvar = async () => {
    try {
      await createSimulation({
        userId,
        title: form.titulo,
        entry: parseFloat(form.entrada),
        installments: parseInt(form.parcelas),
        installmentValue: valorParcela!,
      });

      toast.success("Simulação salva com sucesso!");
      resetForm();
      setOpen(false);
      onSimulacaoSalva?.(); 
    } catch {
      toast.error("Erro ao salvar simulação.");
    }
  };

  const resetForm = () => {
    setForm({ titulo: "", valorImovel: "", entrada: "", parcelas: "" });
    setValorParcela(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="!flex !items-center !gap-2">
          <PlusCircle size={18} />
          Nova Simulação
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-md !rounded-2xl !px-6 !py-5">
        <DialogHeader>
          <DialogTitle className="!text-xl !font-bold !text-gray-800">
            Nova Simulação
          </DialogTitle>
        </DialogHeader>

        <div className="!space-y-4 !mt-4">
          <Input
            name="titulo"
            placeholder="Título do imóvel"
            value={form.titulo}
            onChange={handleChange}
            className="!rounded-lg !border-gray-300"
          />
          <Input
            name="valorImovel"
            placeholder="Valor do imóvel (ex: 300000)"
            value={form.valorImovel}
            onChange={handleChange}
            className="!rounded-lg !border-gray-300"
          />
          <Input
            name="entrada"
            placeholder="Valor da entrada (ex: 60000)"
            value={form.entrada}
            onChange={handleChange}
            className="!rounded-lg !border-gray-300"
          />
          <Input
            name="parcelas"
            placeholder="Parcelas (ex: 240)"
            value={form.parcelas}
            onChange={handleChange}
            className="!rounded-lg !border-gray-300"
          />

          <Button onClick={handleSimular} className="!w-full !mt-2">
            Simular
          </Button>

          {valorParcela !== null && (
            <>
              <div className="!text-green-600 !font-semibold !text-center">
                Parcela estimada: R$ {valorParcela.toLocaleString()}
              </div>

              <Button onClick={handleSalvar} className="!w-full !mt-3">
                Salvar Simulação
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
