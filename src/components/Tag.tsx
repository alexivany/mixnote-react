import { Dispatch, SetStateAction, useState } from "react";

import { Song } from "../types";
import { useCurrentTagContext } from "@/contexts/tag-context";

interface TagProps {
  currentSong: Song;
  setCurrentSong: Dispatch<SetStateAction<Song | undefined>>;
  tag: string;
  i: number;
}

export default function Tag({ tag, i, setCurrentSong, currentSong }: TagProps) {
  const { setCurrentTag, setShowSearch } = useCurrentTagContext();

  const [tagCrossToggle, setTagCrossToggle] = useState<boolean>(false);

  function handleTagSelection(e) {
    setTagCrossToggle(true);
    setCurrentTag(e.target.innerText.slice(1));
    setShowSearch(true);
  }

  function handleDeleteTag(tag: string) {
    const tagArray = Object.entries(currentSong).find(
      ([key]) => key === "tags"
    );

    if (!tagArray) return;

    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        tags: (tagArray[1] as string[]).filter((prevTag) => prevTag !== tag),
      } as Song;
    });
  }

  return (
    <button
      name={tag}
      key={i}
      className="border-2 flex items-center border-gray-400 mr-2 rounded-2xl py-1 px-2 text-xs font-semibold text-black cursor-pointer"
      onClick={handleTagSelection}
      onBlur={() => {
        setTagCrossToggle(false);
        setShowSearch(false);
        setCurrentTag(undefined);
      }}
    >
      #{tag}
      {tagCrossToggle && (
        <img
          src="./src/assets/SVG/cross.svg"
          alt=""
          className="w-4"
          onClick={() => handleDeleteTag(tag)}
        />
      )}
    </button>
  );
}
