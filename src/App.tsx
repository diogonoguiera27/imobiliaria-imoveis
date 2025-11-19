import { BrowserRouter } from "react-router-dom";
import AppProvider from "./hooks";
import { Rotas } from "./routes";

import ChatFloatingButton from "@/components/ChatFloatingButton";
import { ChatProvider } from "@/context/chatProvider";
import useAuth from "@/hooks/auth/useAuth";

/**
 * 🚀 App principal
 * - useAuth SÓ pode rodar dentro do AppProvider
 */
function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}

function InnerApp() {
  // 🟢 Agora SIM: Dentro do AuthProvider
  const { user } = useAuth();

  return (
    <ChatProvider userId={user?.id}>
      <BrowserRouter>
        <Rotas />
        <ChatFloatingButton />
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
