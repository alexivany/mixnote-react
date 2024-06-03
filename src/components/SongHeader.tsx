import { useState } from "react";

// import { Version } from "../types";

export default function SongHeader({
  currentSong,
  setCurrentSong,
  handleChange,
  currentVersion,
  setCurrentVersion,
}) {
  const [showCross, setShowCross] = useState(false);

  const versionElements = Object.entries(currentSong).map(
    ([key, value]) =>
      typeof value === "object" &&
      Array.isArray(value) === false && (
        <button
          className={
            "h-9 font-semibold p-2 rounded-t-2xl " +
            (currentVersion?.version === key
              ? "bg-hidden "
              : "border border-gray-100 bg-gray-100 ")
          }
          key={key}
          onClick={handleVersionChange}
          value={key}
        >
          {key}
        </button>
      )
  );

  function handleVersionChange(e) {
    const newVersion = Object.entries(currentSong).find(
      ([key]) => key === e.target.value
    );
    setCurrentVersion(newVersion[1]);
  }
  function handleTextFocus(e) {
    if (e.type === "blur") {
      if (currentSong.title === "") {
        e.target.focus();
      }
      setTimeout(() => {
        setShowCross((prevState) => !prevState);
      }, 200);
    } else {
      setShowCross((prevState) => !prevState);
    }
  }

  function handleClearTitle() {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        title: "",
      };
    });
  }

  return (
    <div className="flex gap-4 justify-between items-end">
      <div className="flex gap-1">
        <div className="flex">
          <input
            value={currentSong.title}
            onChange={handleChange}
            onFocus={handleTextFocus}
            onBlur={handleTextFocus}
            placeholder="Song Title"
            type="text"
            id="song-title"
            name="title"
            className="w-64 text-3xl font-semibold focus:outline-none focus:border-b-2 focus:border-black"
          />
          {showCross && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className="w-6"
              onClick={handleClearTitle}
            />
          )}
        </div>

        <div className="items-end flex gap-1">
          {versionElements}
          <button className="border border-gray-100 bg-gray-100 p-2 rounded-t-2xl h-9">
            <img src="./src/assets/SVG/plus.svg" alt="" className="w-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 font-2xl">
        <div className="flex justify-between gap-2 items-center font-semibold text-xs">
          <a
            className="font-bold bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer "
            id="download-button"
          >
            Download
          </a>
          <label
            className="font-bold bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            htmlFor="file-upload"
            id="file-upload-label"
          >
            <p>Upload</p>
          </label>
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            accept=".json"
            className="hidden"
          />
        </div>

        <p className="font-bold text-xs ml-2">{currentSong.updated}</p>
      </div>
    </div>
  );
}
