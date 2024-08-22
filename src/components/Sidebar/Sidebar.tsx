import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import SidebarSettings from "./SidebarSettings";
import SidebarSong from "./SidebarSong";

import { Song, Version } from "../../types";

import { useCurrentSongContext } from "../../contexts/currentsong-context";
import { useCurrentTagContext } from "@/contexts/tag-context";
import { useThemeContext } from "@/contexts/theme-context";
import { useSidebarListContext } from "@/contexts/sidebarlist-context";
import { useOnClickOutside } from "usehooks-ts";

import { AnimatePresence, motion } from "framer-motion";

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

  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [warningText, setWarningText] = useState<string>();

  const { showSidebarList, setShowSidebarList } = useSidebarListContext();

  const [sidebarRenameToggle, setSidebarRenameToggle] =
    useState<boolean>(false);

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

  function handleSongRename(e) {
    setSidebarRenameToggle(false);
    if (e.target.value === "" || e.target.value.match(/^\s*$/)) {
      setWarningText("Song must have a name!");
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 2000);
      return;
    }

    if (currentSong) {
      const newSongArray = songs.filter((song) => song.id !== currentSong.id);

      const renamedSong = {
        ...currentSong,
        title: e.target.value,
      };

      const concatSongArray = [...newSongArray, renamedSong];

      console.log(concatSongArray);

      localStorage.setItem("songapp-songs", JSON.stringify(concatSongArray));
      setSongs(concatSongArray);
      setCurrentSong(renamedSong as Song);
    }
  }

  function handleDeleteSong() {
    if (currentSong) {
      const newSongArray = songs.filter((song) => song.id !== currentSong.id);

      if (newSongArray.length >= 1) {
        localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
        setSongs(newSongArray);
      } else {
        setWarningText("Can't delete only song!");
        setShowWarning(true);
        setTimeout(() => {
          setShowWarning(false);
        }, 2000);
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
        <div className="flex gap-2">
          <h1 className="font-medium text-2xl">MixNote</h1>
          <img
            src="/SVG/music-slider.svg"
            alt=""
            className={"w-6 " + (currentTheme === "Dark" && "grayscale invert")}
          />
        </div>
        <img
          src="/SVG/hamburger.svg"
          className={
            "w-6 inline lg:hidden cursor-pointer hover:scale-125 transition-transform  " +
            (currentTheme === "Dark" && "grayscale invert")
          }
          onClick={() => setShowSidebarList((prevState) => !prevState)}
          alt=""
        />
      </div>
      {showWarning && <span className="ml-2 font-semibold">{warningText}</span>}
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
                  sidebarRenameToggle={sidebarRenameToggle}
                  setSidebarRenameToggle={setSidebarRenameToggle}
                  handleSongRename={handleSongRename}
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
                    sidebarRenameToggle={sidebarRenameToggle}
                    setSidebarRenameToggle={setSidebarRenameToggle}
                    handleSongRename={handleSongRename}
                  />
                ))}
          </div>
          <SidebarSettings setSongs={setSongs} />
        </div>
      )}
      <AnimatePresence>
        {showSongDeleteModal && (
          <>
            <motion.div
              onClick={handleSongDeleteModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              key="song-delete-backdrop"
              className="fixed top-0 left-0 z-10 h-full w-full bg-neutral-900"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -400 }}
              // ref={deleteSongModalRef}
              className={
                "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 lg:w-2/5 w-4/5 flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
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
                    "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
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
                    "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                    (currentTheme === "Light"
                      ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                      : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
                  }
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
