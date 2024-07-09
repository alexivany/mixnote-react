import { createContext, useContext, useState } from "react";
import { Song } from "../types";

const CurrentSongContext = createContext<CurrentSongContext | null>(null);

type CurrentSongContext = {
  currentSong: Song | undefined;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
};

export function CurrentSongContextProvider({ children }) {
  const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);

  return (
    <CurrentSongContext.Provider value={{ currentSong, setCurrentSong }}>
      {children}
    </CurrentSongContext.Provider>
  );
}

export function useCurrentSongContext() {
  const context = useContext(CurrentSongContext);
  if (!context) {
    throw new Error(
      "useCurrentSongContext must be used within the CurrentSongContextProvider"
    );
  }
  return context;
}
