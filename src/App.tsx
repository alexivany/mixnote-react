import { useEffect, useState, useMemo } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import SongView from "./components/SongView";

import { Song, Version } from "./types";

export default function App() {
  const [songs, setSongs] = useState<Song[]>();

  const [currentSong, setCurrentSong] = useState<Song>();

  const [currentVersion, setCurrentVersion] = useState<
    Version | null | undefined
  >();

  useEffect(() => {
    const localSongs = JSON.parse(
      localStorage.getItem("songapp-songs") as string
    );
    if (localSongs !== "" && localSongs) {
      setSongs(localSongs);
    } else {
      setSongs([
        {
          title: "My First Song",
          Demo: {
            version: "Demo",
          },
        },
      ]);
    }
  }, []);

  console.log(songs);

  useEffect(() => {
    if (songs && songs.length > 0) {
      setCurrentSong(songs[0]);

      const defaultVersion = Object.values(songs[0]).find(
        (value) => typeof value === "object" && Array.isArray(value) === false
      );

      setCurrentVersion(defaultVersion);
    }
  }, [songs]);

  console.log(currentSong);

  // const defaultVersion = useMemo(() => {
  //   if (currentSong) {
  //     Object.values(currentSong).find(
  //       (value) => typeof value === "object" && Array.isArray(value) === false
  //     );
  //   }
  // }, [currentSong]);

  // useEffect(() => {
  //   if (currentSong) {
  //     const defaultVersion = Object.values(currentSong).find(
  //       (value) => typeof value === "object" && Array.isArray(value) === false
  //     );

  //     setCurrentVersion(defaultVersion);
  //   }
  // }, [currentSong]);

  console.log(currentVersion);

  // TODO: Change currentSong, setCurrentSong, currentVersion, setCurrentVersion to context API

  // UPDATE SONG AND VERSION DATA USEEFFECTS

  // useEffect(() => {
  //   const date = new Date();
  //   if (currentSong && songs) {
  //     currentSong.updated = `${date.toDateString()} ${date.toLocaleTimeString()}`;

  //     const existingSong = songs.find((song) => song.id === currentSong.id);

  //     if (existingSong) {
  //       const existingIndex = songs.findIndex(
  //         (song) => song.id === currentSong.id
  //       );
  //       const newSongArray = songs.map((song, i) => {
  //         if (i === existingIndex) {
  //           return currentSong;
  //         } else {
  //           return song;
  //         }
  //       });
  //       newSongArray.sort((a, b) => {
  //         return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
  //       });
  //       setSongs(newSongArray);
  //     } else {
  //       setSongs([...songs, currentSong]);
  //     }
  //   }
  // }, [currentSong]);

  // useEffect(() => {
  //   if (currentVersion) {
  //     setCurrentSong((prevSongData) => {
  //       return {
  //         ...prevSongData,
  //         [currentVersion.version]: currentVersion,
  //       };
  //     });
  //   }
  // }, [currentVersion]);

  return (
    <div className="">
      <>
        {/* <Sidebar
          songs={songs}
          setCurrentSong={setCurrentSong}
          currentSong={currentSong}
          setSongs={setSongs}
        />
        <SongView
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        /> */}
      </>
    </div>
  );
}
