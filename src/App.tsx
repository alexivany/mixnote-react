import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import SongView from "./components/SongView";

import { v4 as uuidv4 } from "uuid";

import { Song, Version } from "./types";

import { ApiContextProvider } from "./contexts/api-context";
import {
  CurrentVersionContextProvider,
  useCurrentVersionContext,
} from "./contexts/currentversion-context";
import {
  CurrentSongContextProvider,
  useCurrentSongContext,
} from "./contexts/currentsong-context";

const PLACEHOLDER_LOCAL_SONGS: Song[] = [
  {
    id: uuidv4(),
    title: "My First Song",
    Demo: {
      version: "Demo",
      generalNotes: "",
      theme: {
        activeColor: "text-black",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-100",
        textColor: "text-black",
      },
    },
  },
];
export default function App() {
  const [songs, setSongs] = useState<Song[]>();

  // const [currentSong, setCurrentSong] = useState<Song>();

  const { currentSong, setCurrentSong } = useCurrentSongContext();

  // const [currentVersion, setCurrentVersion] = useState<Version | undefined>();

  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  useEffect(() => {
    const localSongs = JSON.parse(
      localStorage.getItem("songapp-songs") as string
    );
    if (localSongs !== "" && localSongs) {
      setSongs(localSongs);
      if (localSongs && localSongs.length > 0) {
        setCurrentSong(localSongs[0]);
      }
    } else {
      setSongs(PLACEHOLDER_LOCAL_SONGS);
    }

    const defaultVersion = Object.values(localSongs[0]).find(
      (value) => typeof value === "object" && Array.isArray(value) === false
    ) as Version | undefined;

    if (defaultVersion) {
      setCurrentVersion(defaultVersion);
    }
  }, []);

  // const defaultVersion = useMemo(() => {
  //   if (currentSong) {
  //     Object.values(currentSong).find(
  //       (value) => typeof value === "object" && Array.isArray(value) === false
  //     );
  //   }
  // }, [currentSong]);

  // TODO: Change currentSong, setCurrentSong, currentVersion, setCurrentVersion to context API

  useEffect(() => {
    const date = new Date();
    if (currentSong && songs) {
      const existingSong = songs.find((song) => song.id === currentSong.id);

      if (existingSong && currentSong !== existingSong) {
        currentSong.updated = `${date.toDateString()} ${date.toLocaleTimeString()}`;
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
        newSongArray.sort((a, b) => {
          const dateA = new Date(a.updated ?? "Mon Jan 1 2000 12:00:00 AM");
          const dateB = new Date(b.updated ?? "Mon Jan 1 2000 12:00:00 AM");
          return dateA > dateB ? -1 : 1;
        });
        console.log("SETTING SONGS");
        setSongs(newSongArray);
        localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
      }
    }
  }, [currentSong, songs]);

  useEffect(() => {
    if (currentSong && currentVersion && currentVersion.version) {
      if (
        !currentSong[currentVersion.version] ||
        currentSong[currentVersion.version] !== currentVersion
      ) {
        setCurrentSong((prevSongData) => {
          if (!prevSongData) {
            return prevSongData;
          }

          return {
            ...prevSongData,
            [currentVersion.version]: currentVersion,
          };
        });
      }
    }
  }, [currentVersion, currentSong, setCurrentSong]);

  return (
    <div className="">
      {songs && currentSong && currentVersion && (
        <>
          <ApiContextProvider>
            <Sidebar
              songs={songs}
              setSongs={setSongs}
              setCurrentVersion={setCurrentVersion}
            />
            <SongView
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              currentVersion={currentVersion}
              setCurrentVersion={setCurrentVersion}
            />
          </ApiContextProvider>
        </>
      )}
    </div>
  );
}
