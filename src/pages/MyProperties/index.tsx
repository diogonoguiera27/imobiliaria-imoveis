// src/pages/MyProperties.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

import {
  buscarMeusImoveis,
  deletarImovel,
  atualizarStatusImovel,
} from "@/service/propertyService";
import type { Imovel, TipoImovel, TipoNegocio } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";

import Filters, { AppliedFilters } from "@/components/MyProperties/Filters";
import PropertiesGrid from "@/components/MyProperties/PropertiesGrid";
import PropertiesList from "@/components/MyProperties/PropertiesList";

import CardPropertiesAdmin from "@/components/PropertyCard/CardPropertiesAdmin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type BackendError = { message?: string; error?: string };

const TIPO_IMOVEL_OPCOES: TipoImovel[] = [
  "Apartamento",
  "Condomínio",
  "Casa Residencial",
];
const TIPO_NEGOCIO_OPCOES: TipoNegocio[] = ["venda", "aluguel"];
const ITEMS_PER_PAGE = 8;

/* --- Carrossel de UMA linha (mobile, grid) --- */
function RowCarousel({
  items,
  onView,
  onEdit,
  onDelete,
  onToggleAtivo,
}: {
  items: Imovel[];
  onView: (identifier: string | number) => void;
  onEdit: (identifier: string | number) => void;
  onDelete: (id: number) => void;
  onToggleAtivo: (id: number, ativo: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  const next = () => setIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  if (items.length === 0) return null;

  return (
    <div className="!w-[90%] !flex !flex-col !items-center !mb-8">
      <CardPropertiesAdmin
        item={items[index]}
        onView={() => onView(items[index].uuid ?? items[index].id)}
        onEdit={() => onEdit(items[index].uuid ?? items[index].id)}
        onDelete={() => onDelete(items[index].id)}
        onToggleAtivo={(novo) => onToggleAtivo(items[index].id, novo)}
      />

      <div className="!flex !items-center !justify-center !gap-6 !mt-3">
        <button
          onClick={prev}
          className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
        >
          <ChevronLeft className="!w-5 !h-5" />
        </button>
        <button
          onClick={next}
          className="!bg-white !rounded-full !shadow-md !p-2 hover:!bg-gray-200"
        >
          <ChevronRight className="!w-5 !h-5" />
        </button>
      </div>

      <div className="!flex !gap-2 !mt-3">
        {items.map((_, i) => (
          <span
            key={i}
            className={`!w-2 !h-2 !rounded-full ${
              i === index ? "!bg-red-500" : "!bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="!w-full !rounded-2xl !bg-white !shadow-sm !ring-1 !ring-neutral-200 !px-8 !py-12 !flex !flex-col !items-center !justify-center !text-center">
      <div className="!text-2xl !font-semibold">
        Você ainda não cadastrou imóveis
      </div>
      <p className="!mt-2 !text-neutral-500">
        Assim que cadastrar, eles aparecerão aqui para você gerenciar.
      </p>
      <Button
        className="!mt-6 !h-10 !rounded-lg !bg-red-600 hover:!opacity-95 !px-4 !font-medium !text-white"
        onClick={onCreate}
      >
        <Plus className="!mr-2 !h-4 !w-4" />
        Cadastrar Imóvel
      </Button>
    </div>
  );
}

function NoResults() {
  return (
    <div className="!w-full !rounded-2xl !bg-white !shadow-sm !ring-1 !ring-neutral-200 !px-8 !py-12 !text-center">
      <p className="!text-base !text-neutral-600">
        Nenhum imóvel encontrado com os filtros aplicados.
      </p>
    </div>
  );
}

export default function MyProperties() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cidade, setCidade] = useState<string | undefined>();
  const [tipo, setTipo] = useState<TipoImovel | undefined>();
  const [negocio, setNegocio] = useState<TipoNegocio | undefined>();

  const [applied, setApplied] = useState<AppliedFilters>({
    q: "",
    cidade: undefined,
    tipo: undefined,
    negocio: undefined,
    ativo: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const createdId = useMemo(() => Number(params.get("createdId")), [params]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await buscarMeusImoveis();
        if (mounted) setItems(list);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401) {
            toast.error("Sessão expirada. Faça login novamente.");
            navigate("/login");
          } else {
            const data = err.response?.data as BackendError | undefined;
            toast.error(
              data?.message || data?.error || "Erro ao carregar seus imóveis."
            );
          }
        } else {
          toast.error("Erro inesperado ao carregar seus imóveis.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    const status = params.get("status");
    setApplied((prev) => ({
      ...prev,
      ativo:
        status === "inactive" ? false : status === "active" ? true : undefined,
    }));
  }, [params]);

  const filtered = useMemo(() => {
    const txt = (applied.q || "").trim().toLowerCase();
    let list = [...items];

    if (txt)
      list = list.filter((p) =>
        `${p.bairro} ${p.cidade ?? ""}`.toLowerCase().includes(txt)
      );

    if (applied.cidade)
      list = list.filter(
        (p) => (p.cidade ?? "").toLowerCase() === applied.cidade?.toLowerCase()
      );

    if (applied.tipo) list = list.filter((p) => p.tipo === applied.tipo);

    if (applied.negocio)
      list = list.filter(
        (p) => p.tipoNegocio.toLowerCase() === applied.negocio?.toLowerCase()
      );

    if (typeof applied.ativo === "boolean")
      list = list.filter((p) => p.ativo === applied.ativo);

    return list;
  }, [items, applied]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, endIndex);

  const handleView = (identifier: string | number) =>
    navigate(`/imovel/${identifier}`);
  const handleEdit = (identifier: string | number) =>
    navigate(`/imovel/editar/${identifier}`);

  const handleDelete = async (id: number) => {
    try {
      await deletarImovel(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Imóvel excluído com sucesso!");
    } catch {
      toast.error("Não foi possível excluir o imóvel.");
    }
  };

  const handleToggleAtivo = async (id: number, novoAtivo: boolean) => {
    try {
      await atualizarStatusImovel(id, novoAtivo);
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ativo: novoAtivo } : p))
      );
      toast.success(novoAtivo ? "Imóvel ativado." : "Imóvel desativado.");
    } catch {
      toast.error("Não foi possível atualizar o status do imóvel.");
    }
  };

  const handleApplyFilters = () => {
    setApplied({ q, cidade, tipo, negocio, ativo: applied.ativo });
    setCurrentPage(1);

    const count = (() => {
      const txt = (q || "").trim().toLowerCase();
      let list = [...items];

      if (txt)
        list = list.filter((p) =>
          `${p.bairro} ${p.cidade ?? ""}`.toLowerCase().includes(txt)
        );

      if (cidade)
        list = list.filter(
          (p) => (p.cidade ?? "").toLowerCase() === cidade.toLowerCase()
        );

      if (tipo) list = list.filter((p) => p.tipo === tipo);

      if (negocio)
        list = list.filter(
          (p) => p.tipoNegocio.toLowerCase() === negocio.toLowerCase()
        );

      if (typeof applied.ativo === "boolean")
        list = list.filter((p) => p.ativo === applied.ativo);

      return list.length;
    })();

    if (count === 0)
      toast.info("Nenhum imóvel encontrado com os filtros aplicados.");
    else toast.success(`${count} imóvel(is) encontrado(s).`);
  };

  const hasAnyItem = items.length > 0;
  const row1 = currentItems.slice(0, 4);
  const row2 = currentItems.slice(4, 8);

  return (
    <SidebarProvider>
      <div className="!w-screen !flex !flex-col !overflow-x-hidden">
        <main className="!flex-1">
          <SidebarTrigger />
          <section className="!pt-[72px] !w-full">
            <div className="!w-full !max-w-6xl !mx-auto !px-6 md:!px-10">
              {!loading && !hasAnyItem ? (
                <div className="!mt-6">
                  <EmptyState onCreate={() => navigate("/imovel/novo")} />
                </div>
              ) : (
                <>
                  {/* Cabeçalho */}
                  <div className="hidden md:flex !items-center !justify-between !pb-3">
                    <div>
                      <h1 className="!text-2xl !font-semibold !mb-0.5">
                        Meus Imóveis
                      </h1>
                      <p className="!text-sm !text-neutral-500 !mt-0">
                        Gerencie seus anúncios
                      </p>
                    </div>
                    <div className="!flex !items-center !gap-2">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`!p-2 !rounded ${
                          viewMode === "grid"
                            ? "!bg-red-600 !text-white"
                            : "!bg-gray-200"
                        }`}
                      >
                        <LayoutGrid className="!w-5 !h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`!p-2 !rounded ${
                          viewMode === "list"
                            ? "!bg-red-600 !text-white"
                            : "!bg-gray-200"
                        }`}
                      >
                        <ListIcon className="!w-5 !h-5" />
                      </button>
                      <Button
                        className="!h-10 !rounded-lg !bg-red-600 hover:!opacity-95 !px-4 !font-medium !text-white"
                        onClick={() => navigate("/imovel/novo")}
                      >
                        <Plus className="!mr-2 !h-4 !w-4" />
                        Cadastrar Imóvel
                      </Button>
                    </div>
                  </div>

                  {/* Mobile header */}
                  <div className="flex md:hidden !flex-col !gap-3 !pb-3 !items-center">
                    <div className="!flex !flex-col !md:flex-row !items-center !justify-between !pb-3">
                      <div>
                        <h1 className="!text-2xl !font-semibold !leading-tight">
                          Meus Imóveis
                        </h1>
                        <p className="!text-sm !text-neutral-500 !mt-1">
                          Gerencie seus anúncios
                        </p>
                      </div>
                      <div className="!flex !gap-2 !mt-3 !md:mt-0">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`!p-2 !rounded ${
                            viewMode === "grid"
                              ? "!bg-red-600 !text-white"
                              : "!bg-gray-200"
                          }`}
                        >
                          <LayoutGrid className="!w-5 !h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`!p-2 !rounded ${
                            viewMode === "list"
                              ? "!bg-red-600 !text-white"
                              : "!bg-gray-200"
                          }`}
                        >
                          <ListIcon className="!w-5 !h-5" />
                        </button>
                      </div>
                    </div>
                    <Button
                      className="!h-10 !w-[285px] !rounded-lg !bg-red-600 hover:!opacity-95 !px-4 !font-medium !text-white"
                      onClick={() => navigate("/imovel/novo")}
                    >
                      <Plus className="!mr-2 !h-4 !w-4" />
                      Cadastrar Imóvel
                    </Button>
                  </div>

                  
                  <div className="!mt-4 flex !justify-center">
                    <Filters
                      q={q}
                      setQ={setQ}
                      cidade={cidade}
                      setCidade={setCidade}
                      tipo={tipo}
                      setTipo={setTipo}
                      negocio={negocio}
                      setNegocio={setNegocio}
                      applied={applied}
                      setApplied={setApplied}
                      items={items}
                      onApply={handleApplyFilters}
                      TIPO_IMOVEL_OPCOES={TIPO_IMOVEL_OPCOES}
                      TIPO_NEGOCIO_OPCOES={TIPO_NEGOCIO_OPCOES}
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="!mt-6">
                    {!loading && hasAnyItem && currentItems.length === 0 ? (
                      <NoResults />
                    ) : (
                      <>
                        {/* Desktop */}
                        <div className="hidden md:block">
                          {viewMode === "grid" ? (
                            <PropertiesGrid
                              loading={loading}
                              items={currentItems}
                              createdId={createdId}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                              onView={(identifier) =>
                                handleView(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onEdit={(identifier) =>
                                handleEdit(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onDelete={handleDelete}
                              onToggleAtivo={handleToggleAtivo}
                            />
                          ) : (
                            <PropertiesList
                              loading={loading}
                              items={currentItems}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                              onView={(identifier) =>
                                handleView(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onEdit={(identifier) =>
                                handleEdit(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onDelete={handleDelete}
                              onToggleAtivo={handleToggleAtivo}
                            />
                          )}
                        </div>

                        
                        <div className="flex md:hidden !flex-col !items-center ">
                          {viewMode === "grid" ? (
                            loading ? (
                              <>
                                <div className="!w-[90%] !flex !flex-col !items-center !mb-8">
                                  <CardPropertiesAdmin loading />
                                </div>
                                <div className="!w-[90%] !flex !flex-col !items-center !mb-8">
                                  <CardPropertiesAdmin loading />
                                </div>
                              </>
                            ) : (
                              <>
                                <RowCarousel
                                  items={row1}
                                  onView={handleView}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onToggleAtivo={handleToggleAtivo}
                                />
                                <RowCarousel
                                  items={row2}
                                  onView={handleView}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onToggleAtivo={handleToggleAtivo}
                                />

                                {totalPages > 1 && (
                                  <div className="!flex !justify-center !mt-4 !gap-2">
                                    <button
                                      onClick={() =>
                                        setCurrentPage((p) =>
                                          Math.max(1, p - 1)
                                        )
                                      }
                                      className="!px-3 !py-1 !bg-gray-200 !rounded hover:!bg-gray-300"
                                    >
                                      Anterior
                                    </button>
                                    <span className="!px-2 !py-1 !text-sm">
                                      Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setCurrentPage((p) =>
                                          Math.min(totalPages, p + 1)
                                        )
                                      }
                                      className="!px-3 !py-1 !bg-gray-200 !rounded hover:!bg-gray-300"
                                    >
                                      Próximo
                                    </button>
                                  </div>
                                )}
                              </>
                            )
                          ) : loading ? (
                            <div className="!w-[285px] !mx-auto !flex !flex-col !gap-6">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <CardPropertiesAdmin key={i} loading />
                              ))}
                            </div>
                          ) : (
                            <PropertiesList
                              loading={loading}
                              items={currentItems}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                              onView={(identifier) =>
                                handleView(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onEdit={(identifier) =>
                                handleEdit(
                                  currentItems.find(
                                    (p) => p.id === identifier
                                  )?.uuid ?? identifier
                                )
                              }
                              onDelete={handleDelete}
                              onToggleAtivo={handleToggleAtivo}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <div className="!mt-4">
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </SidebarProvider>
  );
}
