import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Expose splash screen control globally so App can hide it when ready
declare global {
  interface Window {
    hideSplashScreen: () => void;
    splashScreenHidden: boolean;
  }
}

window.splashScreenHidden = false;

window.hideSplashScreen = () => {
  if (window.splashScreenHidden) return;
  window.splashScreenHidden = true;
  
  const splash = document.getElementById('splash-screen');
  if (splash) {
    requestAnimationFrame(() => {
      splash.classList.add('splash-hidden');
      setTimeout(() => {
        splash.remove();
      }, 500);
    });
  }
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
