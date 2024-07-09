import { Dispatch, SetStateAction, useRef } from "react";

import SidebarSettings from "./SidebarSettings";
import SidebarSong from "./SidebarSong";

import { Song, Version } from "../../types";

import { useCurrentSongContext } from "../../contexts/currentsong-context";

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

  const songRef = useRef(new Map());

  function handleSongClick(song) {
    setCurrentSong(() => songs.find((newSong) => song.id === newSong.id));
    setCurrentVersion(
      () =>
        Object.values(song).find(
          (value) => typeof value === "object" && Array.isArray(value) === false
        ) as Version
    );
  }

  const songList = songs.map((song) => (
    <SidebarSong
      key={song.id}
      song={song}
      songRef={songRef}
      handleSongClick={handleSongClick}
      handleDeleteSong={handleDeleteSong}
    />
  ));

  function handleDeleteSong() {
    if (currentSong) {
      const newSongArray = songs.filter((song) => song.id !== currentSong.id);

      console.log(newSongArray);
      console.log(songs);
      localStorage.setItem("songapp-songs", JSON.stringify(newSongArray));
      setSongs(newSongArray);
      console.log(newSongArray[0].id);
      setCurrentSong(newSongArray[0]);
      // setCurrentVersion(
      //   () =>
      //     Object.values(newSongArray[0]).find(
      //       (value) => typeof value === "object" && Array.isArray(value) === false
      //     ) as Version
      // );

      // songRef.current.get(newSongArray[0].id).click();
      const selectedSong = songRef.current.get(newSongArray[0].id);
      console.log(selectedSong);
      selectedSong.click();
      // selectedSong.dispatchEvent(new Event("click"));
      // songRef.current.get(newSongArray[0].id).click();
      // console.log(songRef.current?.get(newSongArray[0].id));
    }
  }

  console.log(currentSong);

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
