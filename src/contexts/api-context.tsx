import { createContext, useContext, useState } from "react";

export const ApiContext = createContext<ApiContext | null>(null);

type ApiContext = {
  apiKey: string | undefined;
  setApiKey: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function ApiContextProvider({ children }) {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);

  return (
    <ApiContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within the ApiContextProvider");
  }
  return context;
}
