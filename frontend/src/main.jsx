import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installPopup } from "./popup.jsx";
import "./styles.css";

installPopup();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
