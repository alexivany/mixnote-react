import { useThemeContext } from "@/contexts/theme-context";
import { useCurrentSongContext } from "../../contexts/currentsong-context";

import { Song } from "../../types";
import { Dispatch, SetStateAction } from "react";

interface SidebarSongProps {
  song: Song;
  handleSongClick(song: Song): void;
  handleSongDeleteModal(): void;
  sidebarRenameToggle: boolean;
  setSidebarRenameToggle: Dispatch<SetStateAction<boolean>>;
  handleSongRename(
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement, Element>
  ): void;
}

export default function SidebarSong({
  song,
  handleSongClick,
  handleSongDeleteModal,
  sidebarRenameToggle,
  setSidebarRenameToggle,
  handleSongRename,
}: SidebarSongProps) {
  const { currentSong } = useCurrentSongContext();

  const { currentTheme } = useThemeContext();

  return (
    currentSong && (
      <button
        className={
          "text-left flex justify-between hover:scale-105 transition-transform  px-2 py-0.5 items-center text-xl " +
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
        {sidebarRenameToggle && currentSong.id === song.id ? (
          <input
            onKeyDown={(e) => e.key === "Enter" && handleSongRename(e)}
            onBlur={handleSongRename}
            className={"border-b-2 outline-none w-full bg-gray-100"}
            autoFocus
          />
        ) : (
          song.title
        )}
        <div className="flex">
          {currentSong.id === song.id && (
            <img
              src="./src/assets/SVG/pencil-fill.svg"
              id="song-title-edit"
              alt=""
              className={
                "w-4 ml-1 p-0 cursor-pointer hover:scale-125 transition-transform "
              }
              onClick={() => setSidebarRenameToggle((prevState) => !prevState)}
            />
          )}
          {currentSong.id === song.id && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className="w-6 m-0 p-0 hover:scale-125 transition-transform"
              onClick={handleSongDeleteModal}
            />
          )}
        </div>
      </button>
    )
  );
}
