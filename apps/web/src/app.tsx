import { RouterProvider } from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./providers/app-provider";
import { router } from "./router/router";

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}
