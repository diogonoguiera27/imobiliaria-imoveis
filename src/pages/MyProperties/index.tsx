// src/pages/MyProperties.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

import { buscarMeusImoveis, deletarImovel } from "@/service/propertyService";
import type { Imovel, TipoImovel, TipoNegocio } from "@/types";

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

// Card administrativo
import CardPropertiesAdmin from "@/components/PropertyCard/CardPropertiesAdmin";

type BackendError = { message?: string; error?: string };

// opções fixas
const TIPO_IMOVEL_OPCOES: TipoImovel[] = [
  "Apartamento",
  "Condomínio",
  "Casa Residencial",
];

const TIPO_NEGOCIO_OPCOES: TipoNegocio[] = ["venda", "aluguel"];

export default function MyProperties() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cidade, setCidade] = useState<string | undefined>();
  const [tipo, setTipo] = useState<TipoImovel | undefined>();
  const [negocio, setNegocio] = useState<TipoNegocio | undefined>();

  const [applied, setApplied] = useState({
    q: "",
    cidade: undefined as string | undefined,
    tipo: undefined as TipoImovel | undefined,
    negocio: undefined as TipoNegocio | undefined,
  });

  const createdId = useMemo(() => Number(params.get("createdId")), [params]);

  // carregar imóveis do usuário
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

  // filtros
  const filtered = useMemo(() => {
    const txt = (applied.q || "").trim().toLowerCase();
    let list = [...items];

    if (txt) {
      list = list.filter((p) =>
        `${p.bairro} ${p.cidade}`.toLowerCase().includes(txt)
      );
    }

    if (applied.cidade) {
      list = list.filter(
        (p) => p.cidade.toLowerCase() === applied.cidade?.toLowerCase()
      );
    }

    if (applied.tipo) {
      list = list.filter((p) => p.tipo === applied.tipo);
    }

    if (applied.negocio) {
      list = list.filter(
        (p) => p.tipoNegocio.toLowerCase() === applied.negocio?.toLowerCase()
      );
    }

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

  // handlers
  const handleView = (id: number) => navigate(`/imovel/${id}`);
  const handleEdit = (id: number) => navigate(`/imovel/editar/${id}`);
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este imóvel?")) return;
    try {
      await deletarImovel(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Não foi possível excluir o imóvel.");
    }
  };

  // filtros UI
  const Filters = (
    <div className="!grid !grid-cols-1 md:!grid-cols-[1fr_180px_180px_180px_150px] !gap-4">
      {/* Buscar */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">Buscar</label>
        <Input
          placeholder="Bairro ou cidade"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm focus:!ring-2 focus:!ring-blue-500/30"
        />
      </div>

      {/* Cidade */}
      <div className="!flex !flex-col !gap-1">
        <label className="!text-xs !font-medium !text-neutral-600">Cidade</label>
        <Select value={cidade} onValueChange={setCidade}>
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {TIPO_IMOVEL_OPCOES.map((t) => (
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
        <label className="!text-xs !font-medium !text-neutral-600">Negócio</label>
        <Select value={negocio} onValueChange={setNegocio}>
          <SelectTrigger className="!h-10 !px-3 !rounded-lg !border !border-neutral-300 !bg-white !text-sm">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {TIPO_NEGOCIO_OPCOES.map((n) => (
              <SelectItem
                key={n}
                value={n}
                className="!px-3 !py-2 !text-sm !rounded-md hover:!bg-neutral-100"
              >
                {n === "venda" ? "Venda" : "Aluguel"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aplicar */}
      <div className="!flex !flex-col !gap-1">
        <label className="invisible">Filtro</label>
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
          <SidebarTrigger />
          <section className="!pt-[72px] !w-full">
            <div className="!w-full !max-w-6xl !mx-auto !px-6 md:!px-10">
              <div className="!pb-3 !flex !items-start !justify-between">
                <div>
                  <h1 className="!text-2xl !font-semibold">Meus Imóveis</h1>
                  <p className="!text-sm !text-neutral-500">Gerencie seus anúncios</p>
                </div>
                <Button
                  className="!h-10 !rounded-lg !bg-red-600 hover:!opacity-95 !px-4 !font-medium !text-white md:!mt-0 !mt-3"
                  onClick={() => navigate("/imovel/novo")}
                >
                  <Plus className="!mr-2 !h-4 !w-4" />
                  Cadastrar Imóvel
                </Button>
              </div>

              {createdId ? (
                <div className="!rounded-xl !border !border-green-300 !bg-green-50 !p-4 !text-green-800">
                  ✅ Imóvel cadastrado com sucesso (ID: {createdId}).
                </div>
              ) : null}

              <div className="!mt-4">{Filters}</div>

              <div className="!mt-6">
                {/* Grid atualizado */}
                <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-24">
                  {filtered.map((it) => {
                    if (!it) return null; // segurança contra undefined
                    const highlight = Boolean(createdId && it.id === createdId);

                    return (
                      <div
                        key={it.id}
                        className={`${highlight ? "!ring-2 !ring-green-400 !rounded-2xl" : ""}`}
                      >
                        <CardPropertiesAdmin
                          item={it}
                          onView={() => handleView(it.id)}
                          onEdit={() => handleEdit(it.id)}
                          onDelete={() => handleDelete(it.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
