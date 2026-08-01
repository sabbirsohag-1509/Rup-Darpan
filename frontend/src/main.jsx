import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./router/Router";
import "./index.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider >
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #C9A227",
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>,
);
