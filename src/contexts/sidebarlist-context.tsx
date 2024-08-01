import { createContext, useContext, useState } from "react";

const SidebarListContext = createContext<SidebarListContext | null>(null);

type SidebarListContext = {
  showSidebarList: boolean | undefined;
  setShowSidebarList: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export function SidebarListContextProvider({ children }) {
  const [showSidebarList, setShowSidebarList] = useState<boolean | undefined>(
    true
  );

  return (
    <SidebarListContext.Provider
      value={{ showSidebarList, setShowSidebarList }}
    >
      {children}
    </SidebarListContext.Provider>
  );
}

export function useSidebarListContext() {
  const context = useContext(SidebarListContext);
  if (!context) {
    throw new Error(
      "useSidebarListContext must be used within the SidebarListContextProvider"
    );
  }
  return context;
}
