import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import NoMatch from "@/pages/NoMatch";
import { Home } from "@/pages/Home";
import { ListaImoveisVenda } from "@/pages/PropertiesForSale";
import { ImovelDetalhes } from "@/pages/propertyDetails";
import Login from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ProfilePreview from "@/pages/Profile/ProfilePreview";
import MinhaConta from "@/pages/MinhaConta";

export const Rotas: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} /> {/* redireciona para login inicialmente */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/home" element={<Home />} />
    <Route path="/imoveis-venda" element={<ListaImoveisVenda />} />
    <Route path="/imovel/:id" element={<ImovelDetalhes />} />
    <Route path="/profile" element={<ProfilePreview />} />
    <Route path="/minha-conta" element={<MinhaConta />} />
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
