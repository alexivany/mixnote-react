import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";

import { Song, Version } from "../types";

interface SongViewProps {
  currentSong: Song;
  setCurrentSong: () => void;
  currentVersion: Version;
  setCurrentVersion: () => void;
}

export default function SongView({
  currentSong,
  setCurrentSong,
  currentVersion,
  setCurrentVersion,
}: SongViewProps) {
  function handleChange(e) {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <div className="absolute left-64 right-0 p-4">
      <SongHeader
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        handleChange={handleChange}
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
      <SongDetails
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        handleChange={handleChange}
      />
      {/* <GeneralNotes />
      <InstrumentInput />
      <InstrumentNotes /> */}
    </div>
  );
}
