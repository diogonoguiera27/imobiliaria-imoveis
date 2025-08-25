import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { criarImovel } from "@/service/propertyService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

/* ===================== Helpers numéricos (Zod) ===================== */
const asRequiredInt = (msg: string, opts?: { positive?: boolean }) =>
  z.preprocess(
    (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    },
    z
      .number({ required_error: msg })
      .int()
      .refine((n) => (opts?.positive ? n > 0 : true), msg)
  );

const asRequiredNumber = (msg: string, opts?: { positive?: boolean }) =>
  z.preprocess(
    (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    },
    z
      .number({ required_error: msg })
      .refine((n) => (opts?.positive ? n > 0 : true), msg)
  );

/* ========================= Opções dos selects ========================= */
const TIPO_IMOVEL_OPCOES = ["Apartamento", "Casa Residencial", "Condomínio"];

const TIPO_NEGOCIO_OPCOES = ["Aluguel", "Venda"];

const CATEGORIA_OPCOES = ["venda", "destaque", "popular"];


/* ========================= Schema do Form ========================= */
const schema = z.object({
  imagem: z.string().url("Informe uma URL válida para a imagem"),
  endereco: z.string().min(3, "Endereço é obrigatório"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  tipo: z.string().min(2, "Tipo é obrigatório"),
  tipoNegocio: z.string().min(2, "Tipo de negócio é obrigatório"),
  categoria: z.string().min(2, "Categoria é obrigatória"),

  metragem: asRequiredInt("Metragem deve ser maior que 0", { positive: true }),
  areaConstruida: asRequiredInt("Área construída deve ser maior que 0", {
    positive: true,
  }),
  quartos: asRequiredInt("Número de quartos inválido", { positive: true }),
  suites: asRequiredInt("Número de suítes inválido", { positive: true }),
  banheiros: asRequiredInt("Número de banheiros inválido", { positive: true }),
  vagas: asRequiredInt("Número de vagas inválido", { positive: true }),
  preco: asRequiredNumber("Preço deve ser maior que 0", { positive: true }),

  infoExtra: z.string().optional(),
  descricao: z.string().optional(),
});

type FormValues = z.input<typeof schema>;

type BackendFieldErrors = Record<string, string[] | undefined>;
type BackendError = {
  message?: string;
  error?: string;
  errors?: BackendFieldErrors;
};

/* ========================= UI helper erro ========================= */
function withError(base: string, hasError?: boolean) {
  return `${base} ${hasError ? "!border-red-500 !ring-1 !ring-red-500/60" : ""}`;
}

/* ============================ Componente ========================== */
export default function PropertyForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control, // necessário para Controller
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      imagem: "",
      endereco: "",
      bairro: "",
      cidade: "",
      tipo: "",
      tipoNegocio: "",
      categoria: "",
      metragem: "",
      areaConstruida: "",
      quartos: "",
      suites: "",
      banheiros: "",
      vagas: "",
      preco: "",
      infoExtra: "",
      descricao: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const parsed = schema.parse(values);

    try {
      const { id } = await criarImovel(parsed);
      navigate(`/meus-imoveis?createdId=${id}`, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const fieldErrors = (err.response?.data as BackendError | undefined)
          ?.errors;

        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, msgs]) => {
            if (msgs?.[0]) {
              setError(field as keyof FormValues, {
                type: "server",
                message: msgs[0],
              });
            }
          });
          return;
        }

        const msg =
          (err.response?.data as BackendError | undefined)?.message ||
          (err.response?.data as BackendError | undefined)?.error ||
          "Erro ao criar imóvel";

        alert(msg);
        if (err.response?.status === 401) navigate("/login");
        return;
      }

      alert("Erro inesperado ao criar imóvel.");
    }
  };

  return (
    <form
      className="!px-6 !py-6 !space-y-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Linha 1: Imagem + Bairro */}
      <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="imagem" className="!text-sm !font-medium">
            Imagem
          </Label>
          <Input
            id="imagem"
            type="file"
            accept="image/*"
            className={withError(
              "!h-10 !text-sm !w-full !rounded-full !border !border-neutral-300 !bg-white !px-4 focus:!ring-1 focus:!ring-red-500/40",
              !!errors.imagem
            )}
            {...register("imagem")}
          />
          {errors.imagem && (
            <p className="!text-xs !text-red-600">{errors.imagem.message}</p>
          )}
        </div>

        <div className="!space-y-1">
          <Label htmlFor="bairro" className="!text-sm !font-medium">
            Bairro
          </Label>
          <Input
            id="bairro"
            type="text"
            className={withError(
              "!h-10 !text-sm !w-full !rounded-full !border !border-neutral-300 !bg-white !px-4 focus:!ring-1 focus:!ring-red-500/40",
              !!errors.bairro
            )}
            {...register("bairro")}
          />
          {errors.bairro && (
            <p className="!text-xs !text-red-600">{errors.bairro.message}</p>
          )}
        </div>
      </div>

      {/* Linha 2: Endereço + Categoria + Tipo de Negócio */}
      <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="endereco" className="!text-sm !font-medium">
            Endereço
          </Label>
          <Input
            id="endereco"
            type="text"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("endereco")}
          />
          {errors.endereco && (
            <p className="!text-xs !text-red-600">{errors.endereco.message}</p>
          )}
        </div>

        {/* Categoria - Select */}
        <div className="!space-y-1">
          <Label htmlFor="categoria" className="!text-sm !font-medium">
            Categoria
          </Label>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="categoria"
                  className={withError(
                    "!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !bg-white focus:!ring-1 focus:!ring-red-500/40",
                    !!errors.categoria
                  )}
                  aria-invalid={!!errors.categoria}
                >
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIA_OPCOES.map((opt) => (
                    <SelectItem
                      key={opt}
                      value={opt}
                      className="!py-2 !px-3 !text-sm"
                    >
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoria && (
            <p className="!text-xs !text-red-600">{errors.categoria.message}</p>
          )}
        </div>

        {/* Tipo de Negócio - Select */}
        <div className="!space-y-1">
          <Label htmlFor="tipoNegocio" className="!text-sm !font-medium">
            Tipo de Negócio
          </Label>
          <Controller
            name="tipoNegocio"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="tipoNegocio"
                  className={withError(
                    "!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !bg-white focus:!ring-1 focus:!ring-red-500/40",
                    !!errors.tipoNegocio
                  )}
                  aria-invalid={!!errors.tipoNegocio}
                >
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_NEGOCIO_OPCOES.map((opt) => (
                    <SelectItem
                      key={opt}
                      value={opt}
                      className="!py-2 !px-3 !text-sm"
                    >
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoNegocio && (
            <p className="!text-xs !text-red-600">
              {errors.tipoNegocio.message}
            </p>
          )}
        </div>
      </div>

      {/* Linha 3: Cidade + Tipo + Metragem */}
      <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="cidade" className="!text-sm !font-medium">
            Cidade
          </Label>
          <Input
            id="cidade"
            type="text"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("cidade")}
          />
          {errors.cidade && (
            <p className="!text-xs !text-red-600">{errors.cidade.message}</p>
          )}
        </div>

        {/* Tipo - Select */}
        <div className="!space-y-1">
          <Label htmlFor="tipo" className="!text-sm !font-medium">
            Tipo
          </Label>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="tipo"
                  className={withError(
                    "!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !bg-white focus:!ring-1 focus:!ring-red-500/40",
                    !!errors.tipo
                  )}
                  aria-invalid={!!errors.tipo}
                >
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_IMOVEL_OPCOES.map((opt) => (
                    <SelectItem
                      key={opt}
                      value={opt}
                      className="!py-2 !px-3 !text-sm"
                    >
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipo && (
            <p className="!text-xs !text-red-600">{errors.tipo.message}</p>
          )}
        </div>

        <div className="!space-y-1">
          <Label htmlFor="metragem" className="!text-sm !font-medium">
            Metragem (m²)
          </Label>
          <Input
            id="metragem"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("metragem")}
          />
          {errors.metragem && (
            <p className="!text-xs !text-red-600">{errors.metragem.message}</p>
          )}
        </div>
      </div>

      {/* Linha 4: Área construída + Quartos + Suítes */}
      <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="areaConstruida" className="!text-sm !font-medium">
            Área Construída (m²)
          </Label>
          <Input
            id="areaConstruida"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("areaConstruida")}
          />
          {errors.areaConstruida && (
            <p className="!text-xs !text-red-600">
              {errors.areaConstruida.message}
            </p>
          )}
        </div>
        <div className="!space-y-1">
          <Label htmlFor="quartos" className="!text-sm !font-medium">
            Quartos
          </Label>
          <Input
            id="quartos"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("quartos")}
          />
          {errors.quartos && (
            <p className="!text-xs !text-red-600">{errors.quartos.message}</p>
          )}
        </div>
        <div className="!space-y-1">
          <Label htmlFor="suites" className="!text-sm !font-medium">
            Suítes
          </Label>
          <Input
            id="suites"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("suites")}
          />
          {errors.suites && (
            <p className="!text-xs !text-red-600">{errors.suites.message}</p>
          )}
        </div>
      </div>

      {/* Linha 5: Banheiros + Vagas + Preço */}
      <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="banheiros" className="!text-sm !font-medium">
            Banheiros
          </Label>
          <Input
            id="banheiros"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("banheiros")}
          />
          {errors.banheiros && (
            <p className="!text-xs !text-red-600">{errors.banheiros.message}</p>
          )}
        </div>
        <div className="!space-y-1">
          <Label htmlFor="vagas" className="!text-sm !font-medium">
            Vagas
          </Label>
          <Input
            id="vagas"
            type="number"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("vagas")}
          />
          {errors.vagas && (
            <p className="!text-xs !text-red-600">{errors.vagas.message}</p>
          )}
        </div>
        <div className="!space-y-1">
          <Label htmlFor="preco" className="!text-sm !font-medium">
            Preço (R$)
          </Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("preco")}
          />
          {errors.preco && (
            <p className="!text-xs !text-red-600">{errors.preco.message}</p>
          )}
        </div>
      </div>

      {/* Linha 6: Info Extra + Descrição */}
      <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
        <div className="!space-y-1">
          <Label htmlFor="infoExtra" className="!text-sm !font-medium">
            Informação Extra
          </Label>
          <Input
            id="infoExtra"
            type="text"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4"
            {...register("infoExtra")}
          />
        </div>
        <div className="!space-y-1">
          <Label htmlFor="descricao" className="!text-sm !font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            rows={3}
            className="!text-sm !w-full !rounded-2xl !border !border-neutral-300 !px-4 !py-2 focus:!ring-1 focus:!ring-red-500/40"
            {...register("descricao")}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="!flex !justify-end !gap-3 !pt-3 !border-t !border-neutral-200">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="!rounded-full !px-6 !py-2 !text-sm !bg-red-600 !text-white hover:!opacity-95 disabled:!opacity-60"
        >
          {isSubmitting ? "Validando..." : "Salvar Imóvel"}
        </Button>
        <Button
          type="button"
          className="!rounded-full !px-6 !py-2 !text-sm !bg-neutral-400 !text-white hover:!bg-neutral-500"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
