import { useEffect } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { criarImovel, atualizarImovel } from "@/service/propertyService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Imovel, TipoImovel, TipoNegocio, CategoriaImovel } from "@/types";
import { Upload } from "lucide-react";

/* ========================= Opções ========================= */
const TIPO_IMOVEL_OPCOES: TipoImovel[] = [
  "Apartamento",
  "Casa Residencial",
  "Condomínio",
];
const TIPO_NEGOCIO_OPCOES: TipoNegocio[] = ["aluguel", "venda"];
const CATEGORIA_OPCOES: CategoriaImovel[] = [
  "venda",
  "destaque",
  "popular",
  "promocao",
];

/* ========================= Schemas ========================= */
const createSchema = z.object({
  imagem: z
    .instanceof(FileList, { message: "Selecione uma imagem" })
    .refine((fl) => fl.length > 0, "Selecione uma imagem")
    .refine(
      (fl) =>
        ["image/jpeg", "image/png", "image/webp"].includes(fl[0]?.type ?? ""),
      "Formato inválido (use JPG, PNG ou WEBP)"
    )
    .refine(
      (fl) => (fl[0]?.size ?? 0) <= 5 * 1024 * 1024,
      "Imagem deve ter no máximo 5MB"
    ),
  endereco: z.string().min(3),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  tipo: z.string().min(2),
  tipoNegocio: z.string().min(2),
  categoria: z.string().min(2),
  metragem: z.coerce.number().int().positive(),
  areaConstruida: z.coerce.number().int().positive(),
  quartos: z.coerce.number().int().positive(),
  suites: z.coerce.number().int().min(0),
  banheiros: z.coerce.number().int().positive(),
  vagas: z.coerce.number().int().positive(),
  preco: z.coerce.number().positive(),
  caracteristicas: z.array(z.string()).optional(),
  descricao: z.string().optional(),
});

const editSchema = createSchema.extend({
  imagem: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fl) =>
        !fl ||
        fl.length === 0 ||
        ["image/jpeg", "image/png", "image/webp"].includes(fl[0]?.type ?? ""),
      "Formato inválido"
    )
    .refine(
      (fl) => !fl || fl.length === 0 || (fl[0]?.size ?? 0) <= 5 * 1024 * 1024,
      "Imagem deve ter no máximo 5MB"
    ),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;
type FormValues = CreateValues | EditValues;

/* ========================= Props ========================= */
export type PropertyFormProps = {
  mode?: "create" | "edit";
  initialData?: Imovel;
  onSuccess?: (id: number) => void;
  /** envia para o pai a URL do preview (blob ou URL do backend) */
  onImageSelect?: (url: string | null) => void;
};

/* ========================= Tipagem do erro backend ========================= */
type BackendFieldErrors = Record<string, string[] | undefined>;
type BackendError = {
  message?: string;
  error?: string;
  errors?: BackendFieldErrors;
};

/* ========================= Helper ========================= */
function withError(base: string, hasError?: boolean) {
  return `${base} ${hasError ? "!border-red-500 !ring-1 !ring-red-500/60" : ""}`;
}

/* ========================= Componente ========================= */
export default function PropertyForm({
  mode = "create",
  initialData,
  onSuccess,
  onImageSelect,
}: PropertyFormProps) {
  const navigate = useNavigate();
  const schema = mode === "edit" ? editSchema : createSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit" && initialData
        ? {
            endereco: initialData.endereco,
            bairro: initialData.bairro,
            cidade: initialData.cidade,
            tipo: initialData.tipo,
            tipoNegocio: initialData.tipoNegocio,
            categoria: initialData.categoria,
            metragem: initialData.metragem,
            areaConstruida: initialData.areaConstruida ?? 0,
            quartos: initialData.quartos,
            suites: initialData.suites ?? 0,
            banheiros: initialData.banheiros,
            vagas: initialData.vagas,
            preco: initialData.preco,
            caracteristicas: initialData.caracteristicas ?? [],
            descricao: initialData.descricao ?? "",
          }
        : undefined,
  });

  // observa o campo de arquivo
  const selectedFile = watch("imagem");

  // 🔁 Sempre que o arquivo mudar, gera o preview.
  // No modo edição, se nenhum arquivo estiver selecionado, mostra a imagem do backend.
  useEffect(() => {
    if (!onImageSelect) return;

    // 1) Usuário escolheu um novo arquivo => preview blob
    if (selectedFile && (selectedFile as FileList).length > 0) {
      const file = (selectedFile as FileList)[0];
      const url = URL.createObjectURL(file);
      onImageSelect(url);
      return () => URL.revokeObjectURL(url); // cleanup do blob
    }

    // 2) Modo edição sem novo arquivo => usa imagem do backend
    if (mode === "edit" && initialData?.imagem) {
      onImageSelect(initialData.imagem);
      return;
    }

    // 3) Nada selecionado => remove preview
    onImageSelect(null);
  }, [selectedFile, mode, initialData?.imagem, onImageSelect]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (mode === "create") {
        const fd = new FormData();
        fd.append("imagem", (values as CreateValues).imagem[0]);

        for (const [k, v] of Object.entries(values)) {
          if (k === "imagem") continue;

          if (k === "caracteristicas" && Array.isArray(v)) {
            fd.append("caracteristicas", JSON.stringify(v));
          } else if (v !== undefined && v !== null) {
            fd.append(k, String(v));
          }
        }

        const created = await criarImovel(fd);

        if (onSuccess) {
          onSuccess(created.id);
        } else {
          navigate(`/meus-imoveis?createdId=${created.id}`, { replace: true });
        }
        return;
      }

      if (!initialData) throw new Error("ID do imóvel ausente para edição.");

      const hasNewImage =
        (values as EditValues).imagem &&
        (values as EditValues).imagem!.length > 0;

      if (hasNewImage) {
        const fd = new FormData();
        fd.append("imagem", (values as EditValues).imagem![0]);

        for (const [k, v] of Object.entries(values)) {
          if (k === "imagem") continue;

          if (k === "caracteristicas" && Array.isArray(v)) {
            fd.append("caracteristicas", JSON.stringify(v));
          } else if (v !== undefined && v !== null) {
            fd.append(k, String(v));
          }
        }

        const updated = await atualizarImovel(initialData.id, fd);

        if (onSuccess) {
          onSuccess(updated.id);
        } else {
          navigate("/meus-imoveis", { replace: true });
        }
      } else {
        const payload = { ...values } as Partial<FormValues>;
        delete (payload as Partial<EditValues>).imagem;

        const updated = await atualizarImovel(initialData.id, payload);

        if (onSuccess) {
          onSuccess(updated.id);
        } else {
          navigate("/meus-imoveis", { replace: true });
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const fieldErrors = (err.response?.data as BackendError)?.errors;
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
        alert(
          (err.response?.data as BackendError)?.message ||
            (err.response?.data as BackendError)?.error ||
            "Erro ao salvar imóvel"
        );
        if (err.response?.status === 401) navigate("/login");
      } else {
        alert("Erro inesperado ao salvar imóvel.");
      }
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

          {/* Input escondido */}
          <input
            id="imagem"
            type="file"
            accept="image/*"
            className="hidden"
            {...register("imagem")}
          />

          {/* Label/“botão” no estilo do segundo print */}
          <label
            htmlFor="imagem"
            className={withError(
              "!h-10 !w-full !flex !items-center !justify-start !rounded-full !border !border-neutral-300 !bg-white !px-4 !text-sm !font-normal cursor-pointer hover:!bg-neutral-50",
              !!errors.imagem
            )}
          >
            <Upload className="!mr-2 !h-4 !w-4" />
            {selectedFile?.length ? selectedFile[0].name : "Upload File"}
          </label>

          {errors.imagem && (
            <p className="!text-xs !text-red-600">{errors.imagem.message}</p>
          )}
        </div>

        {/* Bairro (igual estava antes) */}
        <div className="!space-y-1">
          <Label htmlFor="bairro" className="!text-sm !font-medium">
            Bairro
          </Label>
          <Input
            id="bairro"
            type="text"
            placeholder="Ex: Setor Oeste"
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
            placeholder="Ex: Rua das Flores, 123"
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
            placeholder="Ex: Goiânia"
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
            placeholder="Ex: 250"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 120"
            inputMode="numeric"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 3"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 1"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 2"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 2"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            placeholder="Ex: 350000"
            step="0.01"
            className="!h-10 !text-sm !rounded-full !border !border-neutral-300 !px-4 !appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
          <Label htmlFor="caracteristicas" className="!text-sm !font-medium">
            Características (separe por vírgulas)
          </Label>
          <Textarea
            id="caracteristicas"
            rows={2}
            placeholder="Ex: Portão eletrônico, Quintal, Lavanderia, Área gourmet"
            className="!text-sm !w-full !rounded-2xl !border !border-neutral-300 !px-4 !py-2 focus:!ring-1 focus:!ring-red-500/40"
            style={{
              resize: "none",
              height: "6rem",
              overflowY: "hidden",
              maxHeight: "6rem",
              minHeight: "6rem",
            }}
            {...register("caracteristicas", {
              setValueAs: (val: unknown) =>
                typeof val === "string"
                  ? val
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : Array.isArray(val)
                    ? val.filter(Boolean)
                    : [],
            })}
          />
          {errors.caracteristicas && (
            <p className="!text-xs !text-red-600">
              {errors.caracteristicas.message}
            </p>
          )}
        </div>
        <div className="!space-y-1">
          <Label htmlFor="descricao" className="!text-sm !font-medium">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            rows={3}
            placeholder="Ex: Imóvel bem localizado, com ótima iluminação natural e próximo a comércios."
            className="!text-sm !w-full !rounded-2xl !border !border-neutral-300 !px-4 !py-2 focus:!ring-1 focus:!ring-red-500/40"
            style={{
              resize: "none",
              overflowY: "hidden",
              height: "6rem",
              maxHeight: "6rem",
              minHeight: "6rem",
            }}
            {...register("descricao")}
          />
        </div>
      </div>

      {/* Botões */}
      <div className="!flex !justify-end !gap-3 !pt-3 !border-t !border-neutral-200">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : mode === "edit"
              ? "Salvar alterações"
              : "Salvar Imóvel"}
        </Button>
        <Button type="button" onClick={() => window.history.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
