import React from "react";
import { Route, Routes } from "react-router-dom";
import NoMatch from "@/pages/NoMatch";
import { Home } from "@/pages/Home";

export const Rotas: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
