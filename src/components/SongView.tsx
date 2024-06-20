import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";
import GeneralNotes from "./GeneralNotes";
import InstrumentSection from "./InstrumentSection";

import { Song, Version } from "../types";

interface SongViewProps {
  currentSong: Song;
  setCurrentSong: (prevSongData: Song | object) => void;
  currentVersion: Version;
  setCurrentVersion: (prevVersionData: Version | object) => void;
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
      };
    });
  }
  function handleVersionChange(e) {
    setCurrentVersion((prevVersionData) => {
      return {
        ...prevVersionData,
        [e.target.name]: e.target.value,
      };
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
      <GeneralNotes
        handleChange={handleVersionChange}
        currentVersion={currentVersion}
      />
      {/* <InstrumentSection
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}

      /> */}
    </div>
  );
}
