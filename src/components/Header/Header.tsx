import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-purple-700">Imobiliária</h1>
      <nav className="space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-purple-700 transition-colors">Home</Link>
        <Link to="/contato" className="hover:text-purple-700 transition-colors">Contato</Link>
      </nav>
    </header>
  );
};
