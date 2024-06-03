import { useState } from "react";

export default function Tag({ tag, i, setCurrentSong, currentSong }) {
  const [tagCrossToggle, setTagCrossToggle] = useState(false);

  function handleDeleteTag(tag) {
    const tagArray = Object.entries(currentSong).find(
      ([key]) => key === "tags"
    );
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [tagArray[0]]: tagArray[1].filter((prevTag) => prevTag !== tag),
      };
    });
  }

  return (
    <button
      name={tag}
      key={i}
      className="border-2 flex items-center border-gray-400 mr-2 rounded-2xl py-1 px-2 text-xs font-semibold text-black cursor-pointer"
      onClick={() => setTagCrossToggle((prevState) => !prevState)}
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
