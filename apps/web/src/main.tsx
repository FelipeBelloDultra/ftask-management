import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./main/index";

import "./presentation/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
