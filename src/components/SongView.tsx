import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";
import GeneralNotes from "./GeneralNotes";
import InstrumentSection from "./Instrument/InstrumentSection";

import { Song, Version } from "../types";
import { Dispatch, SetStateAction } from "react";
import { useThemeContext } from "@/contexts/theme-context";
// import NovelEditor from "./NovelEditor";

interface SongViewProps {
  currentSong: Song;
  setCurrentSong: Dispatch<SetStateAction<Song | undefined>>;
  currentVersion: Version;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
}

export default function SongView({
  currentSong,
  setCurrentSong,
  currentVersion,
  setCurrentVersion,
}: SongViewProps) {
  const { currentTheme } = useThemeContext();

  function handleSongChange(e) {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [e.target.name]: e.target.value,
      } as Song;
    });
  }
  // function handleVersionChange(e) {
  //   setCurrentVersion((prevVersionData) => {
  //     return {
  //       ...prevVersionData,
  //       [e.target.name]: e.target.value,
  //     } as Version;
  //   });
  // }
  return (
    <div
      className={
        "lg:absolute w-vw lg:ml-64 lg:left-0 lg:right-0 p-4 pt-1 lg:pt-4 h-max md:flex md:flex-col " +
        (currentTheme === "Light" ? "bg-white" : "bg-neutral-800 text-white")
      }
    >
      <SongHeader
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        handleChange={handleSongChange}
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
      <SongDetails
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        handleChange={handleSongChange}
        setCurrentVersion={setCurrentVersion}
      />
      {/* <NovelEditor /> */}
      <GeneralNotes />
      <InstrumentSection
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
    </div>
  );
}
