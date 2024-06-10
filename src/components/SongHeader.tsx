import { useState, useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";

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

  const versionModalRef = useRef(null);

  const versionElements = Object.entries(currentSong).map(
    ([key, value]) =>
      typeof value === "object" &&
      Array.isArray(value) === false && (
        <div
          key={key}
          className={
            `h-9 font-semibold p-2 rounded-t-2xl flex justify-center items-start ` +
            (currentVersion?.version === key
              ? `bg-hidden pr-1 border-x-3 border-t-3 ${value?.theme?.borderColor} ${value?.theme?.activeColor}`
              : `border ${value?.theme?.borderColor} ${value?.theme?.bgColor} ${value?.theme?.textColor}`)
          }
        >
          <button onClick={handleVersionChange} value={key}>
            {key}
          </button>
          {currentVersion?.version === key && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className="w-6 m-0 p-0 "
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
      ([_, value]) => typeof value !== "object" || Array.isArray(value) === true
    );
    const concatSong = filteredSong.concat(filteredVersions);

    const newSongObject = Object.fromEntries(concatSong);

    setCurrentSong(newSongObject);
  }

  function handleSongDownload(e) {
    const filename = `${currentSong.title}.json`;
    const jsonStr = JSON.stringify(currentSong);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    e.target.href = url;
    e.target.download = filename;
  }

  function handleSongImport(e) {
    // const url = URL.createObjectURL(e.target.files[0]);

    const reader = new FileReader();

    reader.readAsText(e.target.files[0]);

    reader.addEventListener("load", () => {
      setCurrentSong(JSON.parse(reader.result as string));
    });
  }

  useOnClickOutside(versionModalRef, handleVersionModal);

  return (
    <div className="flex gap-4 justify-between items-center">
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
            className={`border ${currentVersion?.theme?.borderColor} p-2 rounded-t-2xl h-9 ${currentVersion?.theme?.bgColor}`}
          >
            <img
              src="./src/assets/SVG/plus.svg"
              alt=""
              className={
                "w-5 " +
                (currentVersion?.theme?.bgColor !== "bg-gray-100" && "invert")
              }
            />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 font-2xl">
        <div className="flex justify-between gap-2 items-center font-semibold text-xs">
          <a
            onClick={handleSongDownload}
            className={`font-bold ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.bgColor} border-2 ${currentVersion?.theme?.borderColor} py-2 px-4 rounded-2xl cursor-pointer`}
            id="download-button"
          >
            Download
          </a>
          <label
            className={`font-bold ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.bgColor} border-2 ${currentVersion?.theme?.borderColor} py-2 px-4 rounded-2xl cursor-pointer`}
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
            onChange={handleSongImport}
          />
        </div>

        <p className="font-bold text-xs ml-2">{currentSong.updated}</p>
      </div>
      {showVersionModal && (
        <div
          ref={versionModalRef}
          className="bg-white fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border border-gray-300 rounded-xl z-10 py-6 px-6"
        >
          <span className="text-xl">Enter new version name</span>
          <input
            autoFocus
            value={versionModalInput}
            onChange={(e) => setVersionModalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewVersion()}
            type="text"
            className="max-w-full mb-2 px-2 font-normal border border-gray-300 rounded-lg"
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
