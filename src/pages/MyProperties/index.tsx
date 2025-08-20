import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buscarMeusImoveis } from "@/service/propertyService";
import type { Imovel } from "@/types";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function MyProperties() {
  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const createdId = useMemo(() => Number(params.get("createdId")), [params]);

 type BackendError = { message?: string; error?: string };

useEffect(() => {
  let isMounted = true;

  (async () => {
    try {
      const list = await buscarMeusImoveis();
      if (isMounted) setItems(list);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          navigate("/login");
        } else {
          const data = err.response?.data as BackendError | undefined;
          const msg = data?.message || data?.error || "Erro ao carregar seus imóveis.";
          alert(msg);
        }
      } else {
        console.error("Erro inesperado:", err);
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

  if (loading) return <div className="p-6">Carregando...</div>;

  if (items.length === 0) {
    return (
      <div className="!p-6">
        <div className="!mb-4 !rounded-xl !border !border-neutral-200 !p-4 !bg-white">
          <h2 className="!text-lg !font-semibold">Meus Imóveis</h2>
          <p className="!text-sm !text-neutral-600">Você ainda não cadastrou nenhum imóvel.</p>
        </div>
        <Button className="!rounded-xl" onClick={() => navigate("/imovel/novo")}>
          Cadastrar primeiro imóvel
        </Button>
      </div>
    );
  }

  return (
    <div className="!p-6 !space-y-4">
      {createdId ? (
        <div className="!rounded-xl !border !border-green-300 !bg-green-50 p-4 !text-green-800">
          Imóvel cadastrado com sucesso (ID: {createdId}).
        </div>
      ) : null}

      <h2 className="!text-lg !font-semibold">Meus Imóveis</h2>

      <ul className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
        {items.map((it) => {
          const highlight = createdId && it.id === createdId;
          return (
            <li
              key={it.id}
              className={`!rounded-xl !border !p-4 !bg-white ${
                highlight ? "!border-green-500 !ring-1 !ring-green-400" : "!border-neutral-200"
              }`}
            >
              <div className="!flex !items-center !gap-3">
                <img
                  src={it.imagem}
                  alt={it.endereco}
                  className="!w-20 !h-20 !object-cover !rounded-lg !border"
                />
                <div className="!flex-1">
                  <div className="!font-medium">{it.endereco}</div>
                  <div className="!text-sm text-neutral-600">
                    {it.bairro} • {it.cidade}
                  </div>
                  <div className="!text-sm">
                    {it.tipo} • {it.tipoNegocio} • R$ {it.preco.toLocaleString("pt-BR")}
                  </div>
                </div>
                <div className="!flex !flex-col !gap-2">
                  <Button
                    className="!rounded-lg"
                    onClick={() => navigate(`/imovel/${it.id}`)}
                  >
                    Ver
                  </Button>
                  {/* futuros: editar/excluir */}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
