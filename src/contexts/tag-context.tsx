import { createContext, useContext, useState } from "react";

const CurrentTagContext = createContext<CurrentTagContext | null>(null);

type CurrentTagContext = {
  currentTag: string | undefined;
  setCurrentTag: React.Dispatch<React.SetStateAction<string | undefined>>;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CurrentTagContextProvider({ children }) {
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  return (
    <CurrentTagContext.Provider
      value={{ currentTag, setCurrentTag, showSearch, setShowSearch }}
    >
      {children}
    </CurrentTagContext.Provider>
  );
}

export function useCurrentTagContext() {
  const context = useContext(CurrentTagContext);
  if (!context) {
    throw new Error(
      "useCurrentTagContext must be used within the CurrentTagContextProvider"
    );
  }
  return context;
}
