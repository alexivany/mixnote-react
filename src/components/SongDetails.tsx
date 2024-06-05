import { useState } from "react";

import Tag from "./Tag";

import { Song, Version } from "../types";

interface SongDetailsProps {
  currentSong: Song;
  setCurrentSong: (prevSongData: Song | object) => void;
  handleChange: (e) => void;
  setCurrentVersion: (prevVersionData: Version | object) => void;
}

export default function SongDetails({
  currentSong,
  setCurrentSong,
  handleChange,
  setCurrentVersion,
}: SongDetailsProps) {
  const [tagInputToggle, setTagInputToggle] = useState(false);
  const [duplicateTagWarning, setDuplicateTagWarning] = useState(false);

  function handleTagKeyPress(e) {
    if (e.key === "Enter") {
      if (currentSong.tags) {
        const duplicateCheck = currentSong.tags.some(
          (tag) => tag === e.target.value
        );
        if (duplicateCheck) {
          setDuplicateTagWarning(true);
          return;
        }
        setCurrentSong((prevSongData) => {
          return {
            ...prevSongData,
            tags: [...prevSongData.tags, e.target.value],
          };
        });
      } else {
        setCurrentSong((prevSongData) => {
          return {
            ...prevSongData,
            tags: [e.target.value],
          };
        });
      }
      e.target.value = "";
    }
  }

  function handleTagInput() {
    setTagInputToggle((prevState) => !prevState);
    setDuplicateTagWarning(false);
  }

  const tagElements = currentSong.tags?.map((tag, i) => (
    <Tag
      tag={tag}
      i={i}
      setCurrentSong={setCurrentSong}
      currentSong={currentSong}
    />
  ));

  function handleColorChange(e) {
    setCurrentVersion((prevVersionData) => {
      return {
        ...prevVersionData,
        theme: {
          bgColor: e.target.dataset.bgcolor,
          textColor: e.target.dataset.textcolor,
          borderColor: e.target.dataset.bordercolor,
          activeColor: e.target.dataset.activecolor,
        },
      };
    });
  }

  return (
    <div className="flex justify-between my-2">
      <div className="flex items-center">
        <div className="flex">{tagElements}</div>
        <button
          onClick={handleTagInput}
          id="tag-add-button"
          className="border-2 border-gray-100 rounded-2xl py-1 px-2 text-xs font-semibold text-gray-400 cursor-pointer"
        >
          {tagInputToggle ? (
            "Add Tags..."
          ) : (
            <input
              onKeyDown={handleTagKeyPress}
              onBlur={handleTagInput}
              className="text-black border-b-2 outline-none"
              autoFocus
            />
          )}
        </button>
        {duplicateTagWarning && (
          <span className="font-semibold text-sm ml-2">
            Tag already exists!
          </span>
        )}
      </div>
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-2">
          <div>
            <input
              value={currentSong.key}
              onChange={handleChange}
              type="text"
              name="key"
              id="key"
              placeholder="Key"
              maxLength={8}
              className="text-gray-400 border-0 w-16 font-semibold focus:outline-none focus:border-b-2 focus:border-gray-400"
            />
          </div>
          <div>
            <input
              value={currentSong.bpm}
              onChange={handleChange}
              type="number"
              name="bpm"
              id="bpm"
              placeholder="BPM"
              maxLength={6}
              className="text-gray-400 border-0 w-12 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-b-2 focus:border-gray-400"
            />
          </div>
        </div>
        <div className="flex">
          <img
            id="red-blob"
            src="./src/assets/SVG/blobs/red-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-red-500"
            data-textcolor="text-white"
            data-activecolor="text-red-500"
            data-bordercolor="border-red-500"
            onClick={handleColorChange}
          />
          <img
            id="orange-blob"
            src="./src/assets/SVG/blobs/orange-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-orange-500"
            data-textcolor="text-white"
            data-activecolor="text-orange-500"
            data-bordercolor="border-orange-500"
            onClick={handleColorChange}
          />
          <img
            id="yellow-blob"
            src="./src/assets/SVG/blobs/yellow-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-yellow-400"
            data-textcolor="text-white"
            data-activecolor="text-yellow-400"
            data-bordercolor="border-yellow-400"
            onClick={handleColorChange}
          />
          <img
            id="green-blob"
            src="./src/assets/SVG/blobs/green-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-green-500"
            data-textcolor="text-white"
            data-activecolor="text-green-500"
            data-bordercolor="border-green-500"
            onClick={handleColorChange}
          />
          <img
            id="teal-blob"
            src="./src/assets/SVG/blobs/teal-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-teal-500"
            data-textcolor="text-white"
            data-activecolor="text-teal-500"
            data-bordercolor="border-teal-500"
            onClick={handleColorChange}
          />
          <img
            id="cyan-blob"
            src="./src/assets/SVG/blobs/cyan-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-cyan-500"
            data-textcolor="text-white"
            data-activecolor="text-cyan-500"
            data-bordercolor="border-cyan-500"
            onClick={handleColorChange}
          />
          <img
            id="blue-blob"
            src="./src/assets/SVG/blobs/blue-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-blue-500"
            data-textcolor="text-white"
            data-activecolor="text-blue-500"
            data-bordercolor="border-blue-500"
            onClick={handleColorChange}
          />
          <img
            id="purple-blob"
            src="./src/assets/SVG/blobs/purple-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-purple-500"
            data-textcolor="text-white"
            data-activecolor="text-purple-500"
            data-bordercolor="border-purple-500"
            onClick={handleColorChange}
          />
          <img
            id="pink-blob"
            src="./src/assets/SVG/blobs/pink-blob.svg"
            alt=""
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            data-bgcolor="bg-pink-500"
            data-textcolor="text-white"
            data-activecolor="text-pink-500"
            data-bordercolor="border-pink-500"
            onClick={handleColorChange}
          />
          <img
            id="grey-blob"
            src="./src/assets/SVG/blobs/grey-blob.svg"
            alt=""
            data-bgcolor="bg-gray-100"
            data-textcolor="text-black"
            data-activecolor="text-black"
            data-bordercolor="border-gray-100"
            className="w-6 cursor-pointer transition-width duration-200 hover:w-7"
            onClick={handleColorChange}
          />
        </div>
      </div>
    </div>
  );
}
