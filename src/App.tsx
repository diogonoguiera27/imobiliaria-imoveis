import { BrowserRouter } from "react-router-dom";
import AppProvider from "./hooks";
import { Rotas } from "./routes";
import { useChatSocket } from "./hooks/useChatSocket";
import { useEffect } from "react";

function App() {
  const { isConnected, sendMessage } = useChatSocket();

  // 🔍 Teste automático no console
  useEffect(() => {
    if (isConnected) {
      console.log("🟢 Frontend conectado ao WebSocket!");
      // Teste opcional de envio automático
      sendMessage("Conexão WebSocket verificada com sucesso!");
    }
  }, [isConnected, sendMessage]);

  return (
    <AppProvider>
      <BrowserRouter>
        <Rotas />
        {/* Teste visual temporário */}
        <div
          style={{
            position: "fixed",
            bottom: 10,
            right: 10,
            background: isConnected ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "sans-serif",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {isConnected ? "🟢 WebSocket Conectado" : "🔴 Desconectado"}
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
