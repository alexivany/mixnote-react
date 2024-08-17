import { useThemeContext } from "@/contexts/theme-context";
import { useCurrentSongContext } from "../../contexts/currentsong-context";

import { Song } from "../../types";

interface SidebarSongProps {
  song: Song;
  handleSongClick(song: Song): void;
  handleSongDeleteModal(): void;
}

export default function SidebarSong({
  song,
  handleSongClick,
  handleSongDeleteModal,
}: SidebarSongProps) {
  const { currentSong } = useCurrentSongContext();

  const { currentTheme } = useThemeContext();

  return (
    currentSong && (
      <button
        className={
          "text-left flex justify-between px-2 py-0.5 items-center text-xl " +
          (currentSong.id === song.id &&
            "bg-gray-100 rounded-2xl border-3 border-gray-100 font-semibold ") +
          (currentTheme === "Dark" && "text-black ") +
          (currentSong.id !== song.id &&
            " delay-75 rounded-2xl hover:outline hover:outline-gray-100")
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
            onClick={handleSongDeleteModal}
          />
        )}
      </button>
    )
  );
}
