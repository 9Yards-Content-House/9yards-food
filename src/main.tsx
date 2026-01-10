import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Hide splash screen once app is ready
const hideSplashScreen = () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Add a small delay to ensure smooth transition
    requestAnimationFrame(() => {
      splash.classList.add('splash-hidden');
      // Remove from DOM after animation completes
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

// Hide splash after initial render
hideSplashScreen();
