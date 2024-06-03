import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import SongView from "./components/SongView";

import { Song, Version } from "./types";

export default function App() {
  const [songs, setSongs] = useState(
    JSON.parse(localStorage.getItem("songapp-songs") as string) || []
  );

  const [currentSong, setCurrentSong] = useState<Song>(songs[0] || {});

  const [currentVersion, setCurrentVersion] = useState<Version>({});

  const defaultVersion = Object.values(currentSong).find(
    (value) => typeof value === "object" && Array.isArray(value) === false
  );

  useEffect(() => {
    setCurrentVersion(defaultVersion);
  }, []);

  useEffect(() => {
    localStorage.setItem("songapp-songs", JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    const existingSong = songs.find((song) => song.id === currentSong.id);

    if (existingSong) {
      const existingIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const newSongArray = songs.map((song, i) => {
        if (i === existingIndex) {
          return currentSong;
        } else {
          return song;
        }
      });
      setSongs(newSongArray);
    } else {
      setSongs([...songs, currentSong]);
    }
  }, [currentSong]);

  useEffect(() => {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [currentVersion.version]: currentVersion,
      };
    });
  }, [currentVersion]);

  return (
    <>
      <Sidebar
        songs={songs}
        setCurrentSong={setCurrentSong}
        currentSong={currentSong}
      />
      <SongView
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        currentVersion={currentVersion}
        setCurrentVersion={setCurrentVersion}
      />
    </>
  );
}
