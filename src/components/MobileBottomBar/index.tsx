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
  Briefcase,
  MessageCircleMore,
} from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import ContactInfoModal from "@/components/ContactInfoModal";
import ChatModal from "@/components/ChatModal";
import { useChat } from "@/hooks/usechat";
import { useState } from "react";

export default function MobileBottomBar() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { contatosComMensagens } = useChat(); // contador real global
  const role = user?.role;

  const [openChat, setOpenChat] = useState(false);

  if (!role) return null;

  const ensureAuth = (path: string) => {
    if (!token) {
      navigate("/login", { state: { redirectTo: path } });
      return;
    }
    navigate(path);
  };

  const goHome = () => navigate("/home");

  return (
    <>
      {/* ========================= FOOTER MOBILE ========================= */}
      <div
        className="
          !fixed !bottom-0 !left-0 !w-full
          !bg-gradient-to-r from-red-400 to-red-700
          !shadow-[0_-2px_8px_rgba(0,0,0,0.2)]
          !flex !justify-between !items-center
          md:!hidden z-[60]
          !px-4 !py-2
        "
      >
        {/* ====== MENU ADMIN / CORRETOR ====== */}
        {(role === "ADMIN" || role === "CORRETOR") && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="!text-white hover:!opacity-80"
                title={role === "ADMIN" ? "Menu Administrativo" : "Painel do Corretor"}
              >
                {role === "ADMIN" ? (
                  <LayoutDashboard className="!w-6 !h-6" />
                ) : (
                  <Briefcase className="!w-6 !h-6" />
                )}
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
              <h3 className="!uppercase !text-xs !text-red-200 !mb-3 !font-semibold">
                {role === "ADMIN" ? "Administração" : "Painel do Corretor"}
              </h3>

              <nav className="!flex !flex-col !gap-2 !font-semibold">
                {role === "ADMIN" && (
                  <>
                    <button
                      onClick={() => ensureAuth("/dashboard")}
                      className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md"
                    >
                      <LayoutDashboard className="!w-5 !h-5" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => ensureAuth("/admin/users")}
                      className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md"
                    >
                      <Users className="!w-5 !h-5" />
                      Gerenciar Usuários
                    </button>
                  </>
                )}

                <button
                  onClick={() => ensureAuth("/meus-imoveis")}
                  className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md"
                >
                  <Building2 className="!w-5 !h-5" />
                  Meus Imóveis
                </button>

                <button
                  onClick={() => ensureAuth("/imovel/novo")}
                  className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md"
                >
                  <PlusSquare className="!w-5 !h-5" />
                  Cadastrar Imóveis
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* ====== MENU (CHAT + USER) ====== */}
        <div className="!flex !items-center !gap-6 !ml-auto">
          
          {/* === BOTÃO DO CHAT — AGORA AO LADO DO USUÁRIO === */}
          <button
            onClick={() => setOpenChat(true)}
            className="!relative !text-white hover:!opacity-80"
            title="Conversas"
          >
            <MessageCircleMore className="!w-7 !h-7" />

            {/* 🔥 Badge Verde */}
            {contatosComMensagens > 0 && (
              <span
                className="
                  !absolute !-top-1 !-right-2
                  !bg-green-500 !text-white
                  !text-[10px] !font-bold
                  !rounded-full
                  !w-5 !h-5
                  !flex !items-center !justify-center
                "
              >
                {contatosComMensagens > 99 ? "99+" : contatosComMensagens}
              </span>
            )}
          </button>

          {/* === BOTÃO DO USUÁRIO === */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="!text-white hover:!opacity-80"
                title="Menu do Usuário"
              >
                <User className="!w-6 !h-6" />
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
              <h3 className="!uppercase !text-xs !text-red-200 !mb-3 !font-semibold">
                Menu Geral
              </h3>

              <nav className="!flex !flex-col !gap-2 !font-semibold">
                <button
                  onClick={goHome}
                  className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md"
                >
                  <Home className="!w-5 !h-5" />
                  Home
                </button>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="!flex !items-center !gap-3 !px-3 !py-3 hover:!bg-white/10 !rounded-md">
                      <Phone className="!w-5 !h-5" />
                      Contato
                    </button>
                  </DialogTrigger>

                  <DialogContent className="!max-w-lg !z-[9999]">
                    <ContactInfoModal />
                  </DialogContent>
                </Dialog>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* MODAL DO CHAT */}
      {openChat && <ChatModal open={openChat} onOpenChange={setOpenChat} />}
    </>
  );
}
