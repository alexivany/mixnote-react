import { useState } from "react";

import { Song } from "../types";

interface TagProps {
  currentSong: Song;
  setCurrentSong: (prevSongData: Song | object) => void;
  tag: string;
  i: number;
}

export default function Tag({ tag, i, setCurrentSong, currentSong }: TagProps) {
  const [tagCrossToggle, setTagCrossToggle] = useState(false);

  function handleTagCrossToggle() {
    setTagCrossToggle((prevState) => !prevState);
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
      };
    });
  }

  return (
    <button
      name={tag}
      key={i}
      className="border-2 flex items-center border-gray-400 mr-2 rounded-2xl py-1 px-2 text-xs font-semibold text-black cursor-pointer"
      onClick={handleTagCrossToggle}
      onBlur={handleTagCrossToggle}
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
