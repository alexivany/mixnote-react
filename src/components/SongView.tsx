import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";
import GeneralNotes from "./GeneralNotes";
import InstrumentSection from "./InstrumentSection";

import { Song, Version } from "../types";
import { Dispatch, SetStateAction } from "react";
import NovelEditor from "./NovelEditor";

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
  function handleSongChange(e) {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [e.target.name]: e.target.value,
      } as Song;
    });
  }
  function handleVersionChange(e) {
    setCurrentVersion((prevVersionData) => {
      return {
        ...prevVersionData,
        [e.target.name]: e.target.value,
      } as Version;
    });
  }
  return (
    <div className="absolute w-vw ml-64 left-0 right-0 p-4">
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
      <GeneralNotes
        handleChange={handleVersionChange}
        currentVersion={currentVersion}
      />
      <InstrumentSection
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
    </div>
  );
}
