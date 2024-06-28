import { Dispatch, SetStateAction, useRef } from "react";
import SidebarSettings from "./SidebarSettings";
import { Song, Version } from "../../types";

interface SidebarProps {
  songs: Song[];
  setCurrentSong: Dispatch<SetStateAction<Song | undefined>>;
  currentSong: Song;
  setSongs: (newSongArray) => void;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
}

export default function Sidebar({
  songs,
  setCurrentSong,
  currentSong,
  setSongs,
  setCurrentVersion,
}: SidebarProps) {
  const songRef = useRef(new Map());

  const songList = songs.map((song) => (
    <button
      className={
        "text-left flex justify-between items-center text-xl " +
        (currentSong.id === song.id &&
          "bg-gray-100 rounded-2xl outline outline-4 outline-gray-100 font-semibold")
      }
      key={song.id}
      onClick={() => {
        setCurrentSong(() => songs.find((newSong) => song.id === newSong.id));
        setCurrentVersion(
          () =>
            Object.values(song).find(
              (value) =>
                typeof value === "object" && Array.isArray(value) === false
            ) as Version
        );
      }}
      ref={(el) => {
        if (el) {
          songRef.current.set(song.id, el);
        } else {
          songRef.current.delete(song.id);
        }
      }}
    >
      {song.title}
      {currentSong.id === song.id && (
        <img
          src="./src/assets/SVG/cross.svg"
          id="song-title-cross"
          alt=""
          className="w-6 m-0 p-0"
          onClick={handleDeleteSong}
        />
      )}
    </button>
  ));

  function handleDeleteSong() {
    const newSongArray = songs.filter((song) => song.id !== currentSong.id);

    localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
    setSongs(newSongArray);
    setCurrentSong(newSongArray[0]);
    setCurrentVersion(
      () =>
        Object.values(newSongArray[0]).find(
          (value) => typeof value === "object" && Array.isArray(value) === false
        ) as Version
    );
    // songRef.current.get(newSongArray[0].id).click();
    console.log(songRef.current?.get(newSongArray[0].id));
  }

  return (
    <div className="p-4 bg-white border-r flex flex-col border-gray-300 gap-4 fixed w-64 inset-y-0 z-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="font-medium text-2xl">MixNote</h1>
        <div className="flex">
          <img src="./src/assets/SVG/music-slider.svg" alt="" className="w-6" />
          <img
            src="./src/assets/SVG/hamburger.svg"
            className="w-6 inline lg:hidden"
            alt=""
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4">{songList}</div>
        <SidebarSettings setSongs={setSongs} />
      </div>
    </div>
  );
}
