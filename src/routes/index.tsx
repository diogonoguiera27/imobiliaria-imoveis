import { Route, Routes, Navigate } from "react-router-dom";

import NoMatch from "@/pages/NoMatch";
import { Home } from "@/pages/Home";
import { ImovelDetalhes } from "@/pages/propertyDetails";
import Login from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import ProfilePreview from "@/pages/Profile";
import MinhaConta from "@/pages/MyAccount";
import Favorites from "@/pages/Favorites";
import CreateProperty from "@/pages/CreateProperty";
import MyProperties from "@/pages/MyProperties";
import EditProperty from "@/pages/EditProperty";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import ListaImoveisVenda from "@/pages/PropertiesForSale";
import ProtectedLoginRoute from "@/components/ProtectedLoginRoute";



export const Rotas: React.FC = () => (
  <Routes>

    {/* Redireciona raiz para login */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* 🔥 Rota LOGIN protegida */}
    <Route
      path="/login"
      element={
        <ProtectedLoginRoute>
          <Login />
        </ProtectedLoginRoute>
      }
    />

    {/* Cadastro é sempre público */}
    <Route path="/register" element={<RegisterPage />} />

    {/* Rotas da aplicação */}
    <Route path="/home" element={<Home />} />
    <Route path="/imoveis-venda" element={<ListaImoveisVenda />} />
    <Route path="/imovel/:id" element={<ImovelDetalhes />} />
    <Route path="/imovel/novo" element={<CreateProperty />} />
    <Route path="/meus-imoveis" element={<MyProperties />} />
    <Route path="/imovel/editar/:id" element={<EditProperty />} />
    <Route path="/profile" element={<ProfilePreview />} />
    <Route path="/minha-conta" element={<MinhaConta />} />
    <Route path="/favoritos" element={<Favorites />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin/users" element={<UserManagement />} />

    {/* Página 404 */}
    <Route path="*" element={<NoMatch />} />
  </Routes>
);
