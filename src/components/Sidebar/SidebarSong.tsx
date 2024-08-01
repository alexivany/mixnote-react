import { useThemeContext } from "@/contexts/theme-context";
import { useCurrentSongContext } from "../../contexts/currentsong-context";

import { Song } from "../../types";

interface SidebarSongProps {
  song: Song;
  handleSongClick(song: Song): void;
  handleDeleteSong(): void;
}

export default function SidebarSong({
  song,
  handleSongClick,
  handleDeleteSong,
}: SidebarSongProps) {
  const { currentSong } = useCurrentSongContext();

  const { currentTheme } = useThemeContext();

  return (
    currentSong && (
      <button
        className={
          "text-left flex justify-between items-center text-xl " +
          (currentSong.id === song.id &&
            "bg-gray-100 rounded-2xl outline outline-4 outline-gray-100 font-semibold ") +
          (currentTheme === "Dark" && "text-black")
        }
        onClick={() => {
          handleSongClick(song);
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
    )
  );
}
