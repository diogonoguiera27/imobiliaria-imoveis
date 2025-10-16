import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  LayoutDashboard,
  User,
  Building2,
  PlusSquare,
  Home,
  Phone,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import ContactInfoModal from "@/components/ContactInfoModal";

export default function MobileBottomBar() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isUser = user?.role === "USER";

  if (!isAdmin && !isUser) return null; // só exibe se logado

  const ensureAuth = (path: string) => {
    if (!token) {
      navigate("/login", { state: { redirectTo: path } });
      return;
    }
    navigate(path);
  };

  const goHome = () => navigate("/home");

  return (
    <div
      className="
        !fixed !bottom-0 !left-0 !w-full
        !bg-gradient-to-r from-red-400 to-red-700
        !shadow-[0_-2px_8px_rgba(0,0,0,0.2)]
        !flex !justify-between md:!hidden z-[60]
        !px-4 !py-2
      "
    >
      {/* ====== MENU ADMIN (lado esquerdo) ====== */}
      {isAdmin && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="!text-white hover:!opacity-80"
              title="Menu Administrativo"
            >
              <LayoutDashboard className="!w-6 !h-6 sm:!w-7 sm:!h-7" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="
              !p-6 !w-[80%] !max-w-xs !h-full
              !flex !flex-col
              !bg-gradient-to-b from-red-500 to-red-700
              !text-white !shadow-xl
            "
          >
            <h3 className="!uppercase !text-xs !text-red-200 !mb-3 !font-semibold !tracking-wider">
              Administração
            </h3>
            <nav className="!flex !flex-col !gap-2 !font-semibold">
              <button
                onClick={() => ensureAuth("/dashboard")}
                className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition"
              >
                <LayoutDashboard className="!w-5 !h-5" />
                Dashboard
              </button>
              <button
                onClick={() => ensureAuth("/admin/users")}
                className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition"
              >
                <Users className="!w-5 !h-5" />
                Gerenciar Usuários
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      )}

      {/* ====== MENU USUÁRIO (lado direito) ====== */}
      {(isUser || isAdmin) && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="!text-white hover:!opacity-80 !ml-auto"
              title="Menu do Usuário"
            >
              <User className="!w-6 !h-6 sm:!w-7 sm:!h-7" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="
              !p-6 !w-[80%] !max-w-xs !h-full
              !flex !flex-col
              !bg-gradient-to-b from-red-500 to-red-700
              !text-white !shadow-xl
            "
          >
            <h3 className="!uppercase !text-xs !text-red-200 !mb-3 !font-semibold !tracking-wider">
              Menu do Usuário
            </h3>
            <nav className="!flex !flex-col !gap-2 !font-semibold">
              <button
                onClick={goHome}
                className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition"
              >
                <Home className="!w-5 !h-5" />
                Home
              </button>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition">
                    <Phone className="!w-5 !h-5" />
                    Contato
                  </button>
                </DialogTrigger>
                <DialogContent className="!max-w-lg !z-[9999]">
                  <ContactInfoModal />
                </DialogContent>
              </Dialog>

              

              <button
                onClick={() => ensureAuth("/meus-imoveis")}
                className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition"
              >
                <Building2 className="!w-5 !h-5" />
                Meus Imóveis
              </button>

              <button
                onClick={() => ensureAuth("/imovel/novo")}
                className="!flex !items-center !gap-3 !px-3 !py-3 !rounded-md hover:!bg-white/10 !transition"
              >
                <PlusSquare className="!w-5 !h-5" />
                Cadastrar Imóveis
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
