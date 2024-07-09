import { createContext, useContext, useState } from "react";
import { Version } from "../types";

const CurrentVersionContext = createContext<CurrentVersionContext | null>(null);

type CurrentVersionContext = {
  currentVersion: Version | undefined;
  setCurrentVersion: React.Dispatch<React.SetStateAction<Version | undefined>>;
};

export function CurrentVersionContextProvider({ children }) {
  const [currentVersion, setCurrentVersion] = useState<Version | undefined>(
    undefined
  );

  return (
    <CurrentVersionContext.Provider
      value={{ currentVersion, setCurrentVersion }}
    >
      {children}
    </CurrentVersionContext.Provider>
  );
}

export function useCurrentVersionContext() {
  const context = useContext(CurrentVersionContext);
  if (!context) {
    throw new Error(
      "useCurrentVersionContext must be used within the CurrentVersionContextProvider"
    );
  }
  return context;
}
