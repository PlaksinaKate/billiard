import ReactDOM from "react-dom/client";
import "./index.css";
import React from "react";
import { HomePage } from "../pages/home";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
