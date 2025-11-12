import { BrowserRouter } from "react-router-dom";
import AppProvider from "./hooks";
import { Rotas } from "./routes";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>p
    </AppProvider>
  );
}

export default App;
