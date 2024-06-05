import { Dispatch, SetStateAction, useRef } from "react";
import SidebarSettings from "./SidebarSettings";
import { Song } from "../../types";

interface SidebarProps {
  songs: Song[];
  setCurrentSong: Dispatch<SetStateAction<Song | undefined>>;
  currentSong: Song;
  setSongs: (newSongArray) => void;
}

export default function Sidebar({
  songs,
  setCurrentSong,
  currentSong,
  setSongs,
}: SidebarProps) {
  // const songRef = useRef<HTMLButtonElement>(null);

  const songList = songs.map((song) => (
    <button
      className={
        "text-left flex justify-between items-center text-xl " +
        (currentSong.id === song.id &&
          "bg-gray-100 rounded-2xl outline outline-4 outline-gray-100 font-semibold")
      }
      key={song.id}
      // ref={songRef[i]}
      onClick={() => {
        setCurrentSong(() => songs.find((newSong) => song.id === newSong.id));
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

    setSongs(newSongArray);
    // songRef[0].click();
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
