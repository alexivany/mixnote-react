import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CurrentSongContextProvider } from "./contexts/currentsong-context.tsx";
import { CurrentVersionContextProvider } from "./contexts/currentversion-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CurrentSongContextProvider>
      <CurrentVersionContextProvider>
        <App />
      </CurrentVersionContextProvider>
    </CurrentSongContextProvider>
  </React.StrictMode>
);
