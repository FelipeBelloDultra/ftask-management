import { RouterProvider } from "react-router-dom";

import { Toaster } from "./components/ui/toaster";
import { router } from "./router/router";

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
