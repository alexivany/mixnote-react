import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";
import GeneralNotes from "./GeneralNotes";

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
    <div className="absolute left-64 right-0 p-4">
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
      {/* <InstrumentInput />
      <InstrumentNotes /> */}
    </div>
  );
}
