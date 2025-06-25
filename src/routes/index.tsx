import React from "react";
import { Route, Routes } from "react-router-dom";
import NoMatch from "@/pages/NoMatch";
import { Home } from "@/pages/Home";
import { ListaImoveisVenda } from "@/pages/ImoveisVenda/ImoveisVenda";
import { ImovelDetalhes } from "@/pages/ImovelDetalhes/ImovelDetalhes"; // IMPORTA a nova página


export const Rotas: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/imoveis-venda" element={<ListaImoveisVenda />} />
    <Route path="/imovel/:id" element={<ImovelDetalhes />} /> 
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
