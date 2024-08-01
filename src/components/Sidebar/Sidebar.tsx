import { Dispatch, SetStateAction, useEffect } from "react";

import SidebarSettings from "./SidebarSettings";
import SidebarSong from "./SidebarSong";

import { Song, Version } from "../../types";

import { useCurrentSongContext } from "../../contexts/currentsong-context";
import { useCurrentTagContext } from "@/contexts/tag-context";
import { useThemeContext } from "@/contexts/theme-context";
import { useSidebarListContext } from "@/contexts/sidebarlist-context";

interface SidebarProps {
  songs: Song[];
  setSongs: (newSongArray) => void;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
}

export default function Sidebar({
  songs,
  setSongs,
  setCurrentVersion,
}: SidebarProps) {
  const { currentSong, setCurrentSong } = useCurrentSongContext();

  const { currentTheme } = useThemeContext();

  const { currentTag, showSearch } = useCurrentTagContext();

  const { showSidebarList, setShowSidebarList } = useSidebarListContext();

  function handleSongClick(song) {
    setCurrentSong(() => songs.find((newSong) => song.id === newSong.id));
    setCurrentVersion(
      () =>
        Object.values(song).find(
          (value) => typeof value === "object" && Array.isArray(value) === false
        ) as Version
    );
  }

  function handleDeleteSong() {
    if (currentSong) {
      const newSongArray = songs.filter((song) => song.id !== currentSong.id);

      localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
      setSongs(newSongArray);
    }
  }

  useEffect(() => {
    if (currentSong) {
      const existingSong = songs.find((song) => song.id === currentSong.id);
      if (songs && songs.length > 0 && existingSong) {
        return;
      } else if (songs && songs.length > 0) {
        handleSongClick(songs[0]);
      }
    }
  }, [songs]);

  return (
    <div
      className={
        "p-4 border-r flex flex-col border-gray-300 gap-4 lg:fixed lg:w-64 lg:inset-y-0 lg:z-10 " +
        (currentTheme === "Light"
          ? "bg-white border-gray-300"
          : "bg-neutral-800 text-white border-neutral-600")
      }
    >
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="font-medium text-2xl">MixNote</h1>
        <div className="flex">
          <img
            src="./src/assets/SVG/music-slider.svg"
            alt=""
            className={"w-6 " + (currentTheme === "Dark" && "grayscale invert")}
          />
          <img
            src="./src/assets/SVG/hamburger.svg"
            className={
              "w-6 inline lg:hidden " +
              (currentTheme === "Dark" && "grayscale invert")
            }
            onClick={() => setShowSidebarList((prevState) => !prevState)}
            alt=""
          />
        </div>
      </div>
      {showSidebarList && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {!showSearch &&
              songs.map((song) => (
                <SidebarSong
                  key={song.id}
                  song={song}
                  handleSongClick={handleSongClick}
                  handleDeleteSong={handleDeleteSong}
                />
              ))}
            {showSearch && (
              <span>
                Searched for <span className="font-semibold">{currentTag}</span>
              </span>
            )}
            {showSearch &&
              currentTag &&
              songs
                .filter((song) => song?.tags?.includes(currentTag))
                .map((filteredSong) => (
                  <SidebarSong
                    key={filteredSong.id}
                    song={filteredSong}
                    handleSongClick={handleSongClick}
                    handleDeleteSong={handleDeleteSong}
                  />
                ))}
          </div>
          <SidebarSettings setSongs={setSongs} />
        </div>
      )}
    </div>
  );
}
