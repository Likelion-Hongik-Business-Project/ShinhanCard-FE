import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import ReactQueryProvider from "@/utils/ReactQueryProvider";

import App from "./App";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
);
