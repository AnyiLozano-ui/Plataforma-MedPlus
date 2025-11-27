import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import FormPage from "./FormPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import GalleryPage from "./GalleryPage";

// Asegurar que "root" existe
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);