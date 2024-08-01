import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrentSongContextProvider } from "./contexts/currentsong-context.tsx";
import { CurrentVersionContextProvider } from "./contexts/currentversion-context.tsx";
import { ThemeContextProvider } from "./contexts/theme-context.tsx";
import { SidebarListContextProvider } from "./contexts/sidebarlist-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CurrentSongContextProvider>
      <CurrentVersionContextProvider>
        <ThemeContextProvider>
          <SidebarListContextProvider>
            <App />
          </SidebarListContextProvider>
        </ThemeContextProvider>
      </CurrentVersionContextProvider>
    </CurrentSongContextProvider>
  </React.StrictMode>
);
