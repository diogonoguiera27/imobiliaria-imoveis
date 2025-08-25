import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

import { buscarMeusImoveis } from "@/service/propertyService";
import type { Imovel } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import PropertyCard from "@/components/PropertyCard/CardProperties";

type BackendError = { message?: string; error?: string };

export default function MyProperties() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cidade, setCidade] = useState<string | undefined>();
  const [tipo, setTipo] = useState<string | undefined>();
  const [negocio, setNegocio] = useState<string | undefined>();

  const [applied, setApplied] = useState({
    q: "",
    cidade: undefined as string | undefined,
    tipo: undefined as string | undefined,
    negocio: undefined as string | undefined,
  });

  const createdId = useMemo(() => Number(params.get("createdId")), [params]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await buscarMeusImoveis();
        if (isMounted) setItems(list);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) navigate("/login");
          else {
            const data = err.response?.data as BackendError | undefined;
            alert(
              data?.message || data?.error || "Erro ao carregar seus imóveis."
            );
          }
        } else {
          alert("Erro ao carregar seus imóveis.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const filtered = useMemo(() => {
    const txt = (applied.q || "").trim().toLowerCase();
    let list = [...items];
    if (txt)
      list = list.filter((p) =>
        `${p.endereco} ${p.bairro} ${p.cidade}`.toLowerCase().includes(txt)
      );
    if (applied.cidade) list = list.filter((p) => p.cidade === applied.cidade);
    if (applied.tipo) list = list.filter((p) => p.tipo === applied.tipo);
    if (applied.negocio)
      list = list.filter((p) => p.tipoNegocio === applied.negocio);
    return list;
  }, [items, applied]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="!min-h-screen !flex !flex-col !overflow-x-hidden">
          <main className="!flex-1">
            <SidebarTrigger />
            <div className="!pt-[72px] !w-full">
              <div className="!max-w-6xl !mx-auto !px-6 md:!px-10 !py-6">
                Carregando...
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  const Filters = (
    <div className="!grid !grid-cols-1 md:!grid-cols-[1fr_180px_180px_180px_150px] !gap-4">
      {/* Buscar */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">
          Buscar
        </label>
        <Input
          placeholder="Endereço ou cidade"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30"
        />
      </div>

      {/* Cidade */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">
          Cidade
        </label>
        <Select value={cidade} onValueChange={setCidade}>
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="!rounded-lg !border !border-neutral-200 !bg-white !shadow-lg !p-1 !space-y-1">
            {Array.from(new Set(items.map((i) => i.cidade))).map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100"
              >
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tipo */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">Tipo</label>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="!rounded-lg !border !border-neutral-200 !bg-white !shadow-lg !p-1 !space-y-1">
            {Array.from(new Set(items.map((i) => i.tipo))).map((t) => (
              <SelectItem
                key={t}
                value={t}
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100"
              >
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Negócio */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">
          Negócio
        </label>
        <Select value={negocio} onValueChange={setNegocio}>
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent className="!rounded-lg !border !border-neutral-200 !bg-white !shadow-lg !p-1 !space-y-1">
            <SelectItem
              value="venda"
              className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100"
            >
              Venda
            </SelectItem>
            <SelectItem
              value="aluguel"
              className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100"
            >
              Aluga-se
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aplicar */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600 invisible">
          Filtro
        </label>
        <Button
          className="!h-10 !rounded-lg !bg-blue-600 hover:!bg-blue-700"
          onClick={() => setApplied({ q, cidade, tipo, negocio })}
        >
          Aplicar filtros
        </Button>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col !overflow-x-hidden">
        <main className="!flex-1">
          {/* Header fixo */}
          <SidebarTrigger />

          {/* Conteúdo central alinhado com o header */}
          <section className="!pt-[72px] !w-full">
            {/* 🔑 ÚNICO CONTAINER — tudo dentro dele compartilha o mesmo alinhamento */}
            <div className="!w-full !max-w-6xl !mx-auto !px-6 md:!px-10">
              {/* Título + CTA */}
              <div className="!pb-3 !flex !items-start !justify-between">
                <div>
                  <h1 className="!text-2xl !font-semibold">Meus Imóveis</h1>
                  <p className="!text-sm !text-neutral-500">
                    Gerencie seus anúncios
                  </p>
                </div>
                <Button
                  className="!h-10 !rounded-lg !bg-red-600 hover:!opacity-95 !px-4 !font-medium !text-white md:!mt-0 !mt-3"
                  onClick={() => navigate("/imovel/novo")}
                >
                  <Plus className="!mr-2 !h-4 !w-4" />
                  Cadastrar Imóvel
                </Button>
              </div>

              {/* Alerta de sucesso */}
              {createdId ? (
                <div className="!rounded-xl !border !border-green-300 !bg-green-50 !p-4 !text-green-800">
                  ✅ Imóvel cadastrado com sucesso (ID: {createdId}).
                </div>
              ) : null}

              {/* Filtros */}
              <div className="!mt-4">{Filters}</div>

              {/* Cards — flex-wrap para alinhar com o botão/contêiner */}
              <div className="!mt-6">
                <div className="!flex !flex-wrap !gap-5 xl:!justify-between !justify-start">
                  {filtered.map((it) => {
                    const highlight = Boolean(createdId && it.id === createdId);
                    const isFav =
                      "isFavorited" in it &&
                      typeof (it as Imovel & { isFavorited?: unknown })
                        .isFavorited === "boolean"
                        ? (it as Imovel & { isFavorited?: boolean })
                            .isFavorited === true
                        : false;

                    return (
                      <div
                        key={it.id}
                        className={`!w-auto ${highlight ? "!ring-2 !ring-green-400 !rounded-2xl" : ""}`}
                      >
                        <PropertyCard
                          item={it}
                          onOpenContactModal={() =>
                            console.log("Mensagem →", it.id)
                          }
                          onOpenPhoneModal={() =>
                            console.log("Telefone →", it.id)
                          }
                          variant="default" // mantém largura fixa do card
                          isFavoritedInitially={isFav}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>

        <div className="!mt-4">
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
