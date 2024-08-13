import { BrowserRouter } from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./providers/app-provider";
import { Router } from "./router";

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <Toaster />
    </AppProvider>
  );
}
