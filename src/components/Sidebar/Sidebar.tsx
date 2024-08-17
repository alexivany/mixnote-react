import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import SidebarSettings from "./SidebarSettings";
import SidebarSong from "./SidebarSong";

import { Song, Version } from "../../types";

import { useCurrentSongContext } from "../../contexts/currentsong-context";
import { useCurrentTagContext } from "@/contexts/tag-context";
import { useThemeContext } from "@/contexts/theme-context";
import { useSidebarListContext } from "@/contexts/sidebarlist-context";
import { useOnClickOutside } from "usehooks-ts";

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

  const [showSongDeleteModal, setShowSongDeleteModal] =
    useState<boolean>(false);

  const deleteSongModalRef = useRef<HTMLDivElement>(null);

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

      if (newSongArray.length >= 1) {
        localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
        setSongs(newSongArray);
      } else {
        console.log("cant delete songs");
        return;
      }
    }
    setShowSongDeleteModal(false);
  }

  function handleSongDeleteModal() {
    setShowSongDeleteModal((prevState) => !prevState);
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

  useOnClickOutside(deleteSongModalRef, handleSongDeleteModal);

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
                  handleSongDeleteModal={handleSongDeleteModal}
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
                    handleSongDeleteModal={handleSongDeleteModal}
                  />
                ))}
          </div>
          <SidebarSettings setSongs={setSongs} />
        </div>
      )}
      {showSongDeleteModal && (
        <div
          ref={deleteSongModalRef}
          className={
            "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
            (currentTheme === "Light"
              ? "bg-white text-black border-gray-300"
              : "bg-neutral-800 text-white border-neutral-600")
          }
        >
          <span className="text-xl">
            Are you sure you want to delete the selected song?
          </span>
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleDeleteSong}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Yes
            </button>
            <button
              onClick={handleSongDeleteModal}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
