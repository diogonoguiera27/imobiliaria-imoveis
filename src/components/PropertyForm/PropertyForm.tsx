import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { criarImovel } from "@/service/propertyService";

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
      // cria no backend; userId vem do token
      const { id } = await criarImovel(parsed);

      // ✅ redireciona para a página "Meus Imóveis" já indicando o recém-criado
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
    <form className="!px-6 !py-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
        <div className="!space-y-2">
          <Label htmlFor="imagem" className="!text-sm !font-medium">
            Imagem (URL)
          </Label>
          <Input
            id="imagem"
            type="url"
            placeholder="https://exemplo.com/foto.jpg"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.imagem
            )}
            aria-invalid={!!errors.imagem}
            {...register("imagem")}
          />
          {errors.imagem && (
            <p className="!text-xs !text-red-600">{errors.imagem.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="endereco" className="!text-sm !font-medium">
            Endereço
          </Label>
          <Input
            id="endereco"
            type="text"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.endereco
            )}
            aria-invalid={!!errors.endereco}
            {...register("endereco")}
          />
          {errors.endereco && (
            <p className="!text-xs !text-red-600">{errors.endereco.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="bairro" className="!text-sm !font-medium">
            Bairro
          </Label>
          <Input
            id="bairro"
            type="text"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.bairro
            )}
            aria-invalid={!!errors.bairro}
            {...register("bairro")}
          />
          {errors.bairro && (
            <p className="!text-xs !text-red-600">{errors.bairro.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="cidade" className="!text-sm !font-medium">
            Cidade
          </Label>
          <Input
            id="cidade"
            type="text"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.cidade
            )}
            aria-invalid={!!errors.cidade}
            {...register("cidade")}
          />
          {errors.cidade && (
            <p className="!text-xs !text-red-600">{errors.cidade.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="tipo" className="!text-sm !font-medium">
            Tipo
          </Label>
          <Input
            id="tipo"
            type="text"
            placeholder="Casa, Apto, Terreno..."
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.tipo
            )}
            aria-invalid={!!errors.tipo}
            {...register("tipo")}
          />
          {errors.tipo && (
            <p className="!text-xs !text-red-600">{errors.tipo.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="tipoNegocio" className="!text-sm !font-medium">
            Tipo de Negócio
          </Label>
          <Input
            id="tipoNegocio"
            type="text"
            placeholder="Venda, Aluguel..."
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.tipoNegocio
            )}
            aria-invalid={!!errors.tipoNegocio}
            {...register("tipoNegocio")}
          />
          {errors.tipoNegocio && (
            <p className="!text-xs !text-red-600">
              {errors.tipoNegocio.message}
            </p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="categoria" className="!text-sm !font-medium">
            Categoria
          </Label>
          <Input
            id="categoria"
            type="text"
            placeholder="Residencial, Comercial..."
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.categoria
            )}
            aria-invalid={!!errors.categoria}
            {...register("categoria")}
          />
          {errors.categoria && (
            <p className="!text-xs !text-red-600">{errors.categoria.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="metragem" className="!text-sm !font-medium">
            Metragem (m²)
          </Label>
          <Input
            id="metragem"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.metragem
            )}
            aria-invalid={!!errors.metragem}
            {...register("metragem")}
          />
          {errors.metragem && (
            <p className="!text-xs !text-red-600">{errors.metragem.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="areaConstruida" className="!text-sm !font-medium">
            Área Construída (m²)
          </Label>
          <Input
            id="areaConstruida"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.areaConstruida
            )}
            aria-invalid={!!errors.areaConstruida}
            {...register("areaConstruida")}
          />
          {errors.areaConstruida && (
            <p className="!text-xs !text-red-600">
              {errors.areaConstruida.message}
            </p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="quartos" className="!text-sm !font-medium">
            Quartos
          </Label>
          <Input
            id="quartos"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.quartos
            )}
            aria-invalid={!!errors.quartos}
            {...register("quartos")}
          />
          {errors.quartos && (
            <p className="!text-xs !text-red-600">{errors.quartos.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="suites" className="!text-sm !font-medium">
            Suítes
          </Label>
          <Input
            id="suites"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.suites
            )}
            aria-invalid={!!errors.suites}
            {...register("suites")}
          />
          {errors.suites && (
            <p className="!text-xs !text-red-600">{errors.suites.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="banheiros" className="!text-sm !font-medium">
            Banheiros
          </Label>
          <Input
            id="banheiros"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.banheiros
            )}
            aria-invalid={!!errors.banheiros}
            {...register("banheiros")}
          />
          {errors.banheiros && (
            <p className="!text-xs !text-red-600">{errors.banheiros.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="vagas" className="!text-sm !font-medium">
            Vagas
          </Label>
          <Input
            id="vagas"
            type="number"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.vagas
            )}
            aria-invalid={!!errors.vagas}
            {...register("vagas")}
          />
          {errors.vagas && (
            <p className="!text-xs !text-red-600">{errors.vagas.message}</p>
          )}
        </div>

        <div className="!space-y-2">
          <Label htmlFor="preco" className="!text-sm !font-medium">
            Preço (R$)
          </Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            className={withError(
              "!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30",
              !!errors.preco
            )}
            aria-invalid={!!errors.preco}
            {...register("preco")}
          />
          {errors.preco && (
            <p className="!text-xs !text-red-600">{errors.preco.message}</p>
          )}
        </div>

        <div className="md:!col-span-2 !space-y-2">
          <Label htmlFor="infoExtra" className="!text-sm !font-medium">
            Info Extra
          </Label>
          <Input
            id="infoExtra"
            type="text"
            className="!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30"
            {...register("infoExtra")}
          />
        </div>

        <div className="md:!col-span-2 !space-y-2">
          <Label htmlFor="descricao" className="!text-sm !font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            rows={4}
            className="!w-full !rounded-xl !border !border-neutral-300 !bg-white !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-red-500/30"
            {...register("descricao")}
          />
        </div>
      </div>

      <div className="!mt-8 !flex !items-center !gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="!rounded-xl !px-5 !py-2 !font-medium !shadow-sm !bg-red-600 !text-white hover:!opacity-95 disabled:!opacity-60"
        >
          {isSubmitting ? "Validando..." : "Salvar Imóvel"}
        </Button>
        <Button
          type="button"
          className="!rounded-xl !px-5 !py-2 !font-medium !bg-neutral-400 !text-white hover:!bg-neutral-500"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
