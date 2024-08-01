import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<ThemeContext | null>(null);

type ThemeContext = {
  currentTheme: string | undefined;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export function ThemeContextProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within the ThemeContextProvider"
    );
  }
  return context;
}
