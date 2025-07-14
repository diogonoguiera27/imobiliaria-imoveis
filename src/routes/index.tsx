import React from "react";
import { Route, Routes } from "react-router-dom";
import NoMatch from "@/pages/NoMatch";
import { Home } from "@/pages/Home";
import { ListaImoveisVenda } from "@/pages/PropertiesForSale";
import { ImovelDetalhes } from "@/pages/propertyDetails"; // IMPORTA a nova página
import Login from "@/pages/Login";



export const Rotas: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/imoveis-venda" element={<ListaImoveisVenda />} />
    <Route path="/imovel/:id" element={<ImovelDetalhes />} /> 
    <Route path="/Login" element={<Login/>} /> 
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
