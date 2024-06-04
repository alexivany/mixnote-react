import { useState, useRef } from "react";

import { Song, Version } from "../types";

interface SongHeaderProps {
  currentSong: Song;
  setCurrentSong: (prevSongData: Song | object) => void;
  handleChange: (e) => void;
  currentVersion: Version;
  setCurrentVersion: (version: Version) => void;
}

export default function SongHeader({
  currentSong,
  setCurrentSong,
  handleChange,
  currentVersion,
  setCurrentVersion,
}: SongHeaderProps) {
  const [showTitleCross, setShowTitleCross] = useState(false);

  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionModalInput, setVersionModalInput] = useState("");

  const versionRef = useRef<HTMLButtonElement>(null);

  const versionElements = Object.entries(currentSong).map(
    ([key, value]) =>
      typeof value === "object" &&
      Array.isArray(value) === false && (
        <div
          className={
            "h-9 font-semibold p-2 rounded-t-2xl flex justify-center items-start " +
            (currentVersion?.version === key
              ? "bg-hidden pr-1 border-x-2 border-t-2 border-gray-300 "
              : `border border-gray-100 bg-gray-100`)
          }
        >
          <button
            ref={versionRef}
            key={key}
            onClick={handleVersionChange}
            value={key}
          >
            {key}
          </button>
          {currentVersion?.version === key && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className="w-6 m-0 p-0"
              onClick={handleDeleteVersion}
            />
          )}
        </div>
      )
  );

  function handleVersionChange(e) {
    const newVersion = Object.entries<Version>(currentSong).find(
      ([key]) => key === e.target.value
    );
    if (!newVersion) return;
    setCurrentVersion(newVersion[1]);
  }
  function handleTextFocus(e) {
    if (e.type === "blur") {
      if (currentSong.title === "") {
        e.target.focus();
      }
      setTimeout(() => {
        setShowTitleCross((prevState) => !prevState);
      }, 200);
    } else {
      setShowTitleCross((prevState) => !prevState);
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

  function handleVersionModal() {
    setShowVersionModal((prevState) => !prevState);
    setVersionModalInput("");
  }

  function addNewVersion() {
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [versionModalInput]: {
          version: versionModalInput,
        },
      };
    });
    handleVersionModal();
  }

  function handleDeleteVersion() {
    const filteredVersions = Object.entries(currentSong).filter(
      ([key, value]) =>
        typeof value === "object" &&
        Array.isArray(value) === false &&
        key !== currentVersion.version
    );
    const filteredSong = Object.entries(currentSong).filter(
      ([key, value]) =>
        typeof value !== "object" || Array.isArray(value) === true
    );
    const concatSong = filteredSong.concat(filteredVersions);

    const newSongObject = Object.fromEntries(concatSong);

    setCurrentSong(newSongObject);

    versionRef.current?.click();

    // setCurrentVersion(newVersion[1]);

    // versionRef[1].click();
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
          {showTitleCross && (
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
          <button
            onClick={handleVersionModal}
            className="border border-gray-100 bg-gray-100 p-2 rounded-t-2xl h-9"
          >
            <img src="./src/assets/SVG/plus.svg" alt="" className="w-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 font-2xl">
        <div className="flex justify-between gap-2 items-center font-semibold text-xs">
          <a
            className={`font-bold bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer `}
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
      {showVersionModal && (
        <div className="bg-white fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border border-gray-300 rounded-xl z-10 py-6 px-6">
          <span className="text-xl">Enter new version name</span>
          <input
            autoFocus
            value={versionModalInput}
            onChange={(e) => setVersionModalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewVersion()}
            type="text"
            className="max-w-full mb-2 border border-gray-300 rounded-lg"
          ></input>
          <div className="flex gap-4 justify-end">
            <button
              onClick={addNewVersion}
              className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={handleVersionModal}
              className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
