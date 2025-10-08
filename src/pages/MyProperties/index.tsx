// ✅ src/pages/MyProperties.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/Footer";

import {
  buscarMeusImoveis,
  atualizarStatusImovel,
  PaginatedProperties,
  buscarCidadesDoUsuario,
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

import FiltersMyProperty, {
  AppliedFilters,
} from "@/components/FiltersMyProperty";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertiesGridMyProperty from "@/components/PropertiesGridMyProperty";
import PropertiesListMyPorperty from "@/components/PropertiesListMyPorperty";
import CardPropertiesAdmin from "@/components/CardPropertiesAdmin";

type BackendError = { message?: string; error?: string };

const TIPO_IMOVEL_OPCOES: TipoImovel[] = [
  "Apartamento",
  "Condomínio",
  "Casa Residencial",
];
const TIPO_NEGOCIO_OPCOES: TipoNegocio[] = ["venda", "aluguel"];
const ITEMS_PER_PAGE = 8;

function RowCarousel({
  items,
  onView,
  onEdit,
  onToggleAtivo,
}: {
  items: Imovel[];
  onView: (identifier: string | number) => void;
  onEdit: (identifier: string | number) => void;
  onToggleAtivo: (id: number, ativo: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  const next = () => setIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  if (!items || items.length === 0) return null;

  return (
    <div className="!w-[90%] !flex !flex-col !items-center !mb-8">
      <CardPropertiesAdmin
        item={items[index]}
        onView={() => onView(items[index].uuid ?? items[index].id)}
        onEdit={() => onEdit(items[index].uuid ?? items[index].id)}
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
  const [allCities, setAllCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState<AppliedFilters>({
    q: "",
    cidade: undefined,
    tipo: undefined,
    negocio: undefined,
    ativo: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const createdId = useMemo(() => Number(params.get("createdId")), [params]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const carregarMeusImoveis = useCallback(
    async (page = 1, filtros: Partial<AppliedFilters> = {}) => {
      try {
        setLoading(true);
        const response: PaginatedProperties = await buscarMeusImoveis({
          page,
          take: ITEMS_PER_PAGE,
          cidade: filtros.cidade,
          tipo: filtros.tipo,
          negocio: filtros.negocio,
          ativo: filtros.ativo,
        });

        const safeData = Array.isArray(response?.data) ? response.data : [];
        setItems(safeData);
        setTotalPages(response?.pagination?.totalPages ?? 1);
        setCurrentPage(response?.pagination?.page ?? 1);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const status: number | undefined = err.response?.status;
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
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    carregarMeusImoveis(1);
    (async () => {
      try {
        const cidades = await buscarCidadesDoUsuario();
        setAllCities(cidades);
      } catch {
        setAllCities([]);
      }
    })();
  }, [carregarMeusImoveis]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    carregarMeusImoveis(1, applied);
  };

  const handleView = (identifier: string | number) =>
    navigate(`/imovel/${identifier}`);
  const handleEdit = (identifier: string | number) =>
    navigate(`/imovel/editar/${identifier}`);

  const handleToggleAtivo = async (id: number, novoAtivo: boolean) => {
    try {
      await atualizarStatusImovel(id, novoAtivo);
      toast.success(novoAtivo ? "Imóvel ativado." : "Imóvel desativado.");
      carregarMeusImoveis(currentPage, applied);
    } catch {
      toast.error("Não foi possível atualizar o status do imóvel.");
    }
  };

  const hasAnyItem = Array.isArray(items) && items.length > 0;
  const row1 = hasAnyItem ? items.slice(0, 4) : [];
  const row2 = hasAnyItem ? items.slice(4, 8) : [];

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
                  
                  <div className="!flex md:!hidden !flex-col !items-center !justify-center !pb-4">
                    <div className="!w-full !flex !flex-col !items-start">
                      {/* Título e ícones */}
                      <div className="!w-full !flex !items-center !justify-between !mb-3 !max-w-[380px] !mx-auto !px-4">
                        <div>
                          <h1 className="!text-lg !font-semibold !text-gray-900 !leading-tight">
                            Meus Imóveis
                          </h1>
                          <p className="!text-sm !text-neutral-500 !mt-0">
                            Gerencie seus anúncios
                          </p>
                        </div>

                        <div className="!flex !items-center !gap-2  ">
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

                      {/* 🔹 Botão com largura igual ao filtro */}
                      <div className="!w-full !flex !justify-center">
                        <div className="!w-full !max-w-[90%] sm:!max-w-[380px] !mx-auto">
                          <Button
                            className="!w-full !h-11 !rounded-lg !bg-red-600 hover:!opacity-95 !font-semibold !text-white !text-base"
                            onClick={() => navigate("/imovel/novo")}
                          >
                            <Plus className="!mr-2 !h-5 !w-5" />
                            Cadastrar Imóvel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cabeçalho - DESKTOP */}
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

                  {/* 🔹 Filtros com alinhamento responsivo */}
                  <div className="!mt-4 !flex !justify-center">
                    <div className="!w-full !max-w-[90%] sm:!max-w-[380px] md:!max-w-none !mx-auto">
                      <FiltersMyProperty
                        q={applied.q || ""}
                        setQ={(q) => setApplied((p) => ({ ...p, q }))}
                        cidade={applied.cidade}
                        setCidade={(cidade) =>
                          setApplied((p) => ({ ...p, cidade }))
                        }
                        tipo={applied.tipo}
                        setTipo={(tipo) => setApplied((p) => ({ ...p, tipo }))}
                        negocio={applied.negocio}
                        setNegocio={(negocio) =>
                          setApplied((p) => ({ ...p, negocio }))
                        }
                        applied={applied}
                        setApplied={setApplied}
                        items={items}
                        allCities={allCities}
                        onApply={handleApplyFilters}
                        TIPO_IMOVEL_OPCOES={TIPO_IMOVEL_OPCOES}
                        TIPO_NEGOCIO_OPCOES={TIPO_NEGOCIO_OPCOES}
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="!mt-6">
                    {!loading && hasAnyItem && items.length === 0 ? (
                      <NoResults />
                    ) : (
                      <>
                        {/* Desktop */}
                        <div className="hidden md:block">
                          {viewMode === "grid" ? (
                            <PropertiesGridMyProperty
                              loading={loading}
                              items={items}
                              createdId={createdId}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) =>
                                carregarMeusImoveis(page, applied)
                              }
                              onView={handleView}
                              onEdit={handleEdit}
                              onToggleAtivo={handleToggleAtivo}
                            />
                          ) : (
                            <PropertiesListMyPorperty
                              loading={loading}
                              items={items}
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) =>
                                carregarMeusImoveis(page, applied)
                              }
                              onView={handleView}
                              onEdit={handleEdit}
                              onToggleAtivo={handleToggleAtivo}
                            />
                          )}
                        </div>

                        {/* 🔹 MOBILE VIEW */}
<div className="!flex md:!hidden !flex-col !items-center !justify-center">
  {/* 🔸 Container com mesma largura do filtro */}
  <div className="!w-full !max-w-[90%] sm:!max-w-[380px] !mx-auto">
    {viewMode === "grid" ? (
      loading ? (
        <>
          {/* Skeletons alinhados */}
          <div className="!w-full !max-w-[380px] !mx-auto !flex !flex-col !items-center !mb-8">
            <CardPropertiesAdmin loading />
          </div>
          <div className="!w-full !max-w-[380px] !mx-auto !flex !flex-col !items-center !mb-8">
            <CardPropertiesAdmin loading />
          </div>
        </>
      ) : (
        <>
          {/* 🔸 Cards centralizados e alinhados ao filtro */}
          <div className="!w-full !max-w-[380px] !mx-auto">
            <RowCarousel
              items={row1}
              onView={handleView}
              onEdit={handleEdit}
              onToggleAtivo={handleToggleAtivo}
            />
            <RowCarousel
              items={row2}
              onView={handleView}
              onEdit={handleEdit}
              onToggleAtivo={handleToggleAtivo}
            />
          </div>

          {/* 🔹 Paginação */}
          {totalPages > 1 && (
            <div className="!flex !justify-center !mt-4 !gap-2">
              <button
                onClick={() =>
                  carregarMeusImoveis(Math.max(1, currentPage - 1), applied)
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
                  carregarMeusImoveis(
                    Math.min(totalPages, currentPage + 1),
                    applied
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
    ) : (
      <PropertiesListMyPorperty
        loading={loading}
        items={items}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => carregarMeusImoveis(page, applied)}
        onView={handleView}
        onEdit={handleEdit}
        onToggleAtivo={handleToggleAtivo}
      />
    )}
  </div>
</div>

                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <div className="!mt-4 !mb-12">
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </SidebarProvider>
  );
}
