import { useState, useRef, Dispatch, SetStateAction, useEffect } from "react";

import { useOnClickOutside } from "usehooks-ts";

import { Song, Version } from "../types";
import { useThemeContext } from "@/contexts/theme-context";

import { v4 as uuidv4 } from "uuid";

interface SongHeaderProps {
  currentSong: Song;
  setCurrentSong: Dispatch<SetStateAction<Song | undefined>>;
  handleChange: (e) => void;
  currentVersion: Version;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
}

export default function SongHeader({
  currentSong,
  setCurrentSong,
  handleChange,
  currentVersion,
  setCurrentVersion,
}: SongHeaderProps) {
  const { currentTheme } = useThemeContext();

  const [titleWidth, setTitleWidth] = useState<number>(0);
  const [showTitleCross, setShowTitleCross] = useState<boolean>(false);

  const [emptyVersionWarning, setEmptyVersionWarning] =
    useState<boolean>(false);

  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [showDeleteVersionModal, setShowDeleteVersionModal] =
    useState<boolean>(false);
  // const [versionRenameToggle, setVersionRenameToggle] =
  //   useState<boolean>(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [versionModalInput, setVersionModalInput] = useState<string>("");

  const titleSpanRef = useRef<HTMLSpanElement>(null);
  const versionModalRef = useRef(null);
  const deleteVersionModalRef = useRef<HTMLDivElement>(null);

  const versionElements = Object.entries(currentSong).map(
    ([key, value]) =>
      typeof value === "object" &&
      Array.isArray(value) === false && (
        <div
          key={key}
          className={
            `h-9 font-semibold text-xs lg:text-base p-2 rounded-t-2xl flex justify-center items-center ` +
            (currentVersion?.version === value.version
              ? `bg-hidden pr-1 border-x-3 border-t-3 ${value?.theme?.borderColor} ${value?.theme?.activeColor} ` +
                (currentTheme === "Dark" &&
                  value?.theme?.textColor === "text-black" &&
                  "text-white")
              : `border ${value?.theme?.borderColor} ${value?.theme?.bgColor} ${value?.theme?.textColor} `)
          }
        >
          {/* {versionRenameToggle && currentVersion?.version === value.version ? (
            <input
              onKeyDown={(e) => e.key === "Enter" && handleVersionRename(e)}
              onBlur={handleVersionRename}
              className={
                "border-b-2 outline-none w-full " +
                (currentTheme === "Light"
                  ? "text-black bg-white"
                  : "bg-neutral-800 text-white")
              }
              autoFocus
            />
          ) : ( */}
          <button
            onClick={handleVersionChange}
            // onDoubleClick={() =>
            //   setVersionRenameToggle((prevState) => !prevState)
            // }
            value={key}
          >
            {value.version}
          </button>
          {/* )} */}

          {currentVersion?.version === value.version && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className={
                "w-6 m-0 p-0 cursor-pointer " +
                (currentTheme === "Dark" && "grayscale invert")
              }
              onClick={handleDeleteVersionModal}
            />
          )}
        </div>
      )
  );

  // function handleVersionRename(e) {
  //   setVersionRenameToggle(false);
  //   if (e.target.value === "" || e.target.value.match(/^\s*$/)) {
  //     // setRenameWarningText("Version must have a name!");
  //     // setRenameWarning(true);
  //     // setTimeout(() => {
  //     //   setRenameWarning(false);
  //     // }, 2000);
  //     return;
  //   }

  //   console.log(currentVersion);

  //   setCurrentVersion((prevVersionData) => {
  //     return {
  //       ...prevVersionData,
  //       version: e.target.value,
  //     } as Version;
  //   });
  // }

  function handleVersionChange(e) {
    const newVersion = Object.entries(currentSong).find(
      ([key]) => key === e.target.value
    );
    if (!newVersion) return;
    setCurrentVersion(newVersion[1] as Version);
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
      } as Song;
    });
  }

  function handleVersionModal() {
    setShowVersionModal((prevState) => !prevState);
    setVersionModalInput("");
  }

  function handleDeleteVersionModal() {
    setShowDeleteVersionModal((prevState) => !prevState);
  }

  function addNewVersion() {
    if (versionModalInput.match(/^\s*$/)) {
      setModalWarning(true);
      setTimeout(() => {
        setModalWarning(false);
      }, 2000);
      return;
    }
    setCurrentSong((prevSongData) => {
      return {
        ...prevSongData,
        [versionModalInput]: {
          version: versionModalInput,
          generalNotes: "",
          theme: {
            activeColor: "text-black",
            bgColor: "bg-gray-100",
            borderColor: "border-gray-100",
            textColor: "text-black",
          },
          versionId: uuidv4(),
        },
      } as Song;
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

    const newSongObject = Object.fromEntries(concatSong) as Song;

    if (filteredVersions.length >= 1) {
      setCurrentVersion(
        () =>
          Object.values(newSongObject).find(
            (value) =>
              typeof value === "object" && Array.isArray(value) === false
          ) as Version
      );
      setCurrentSong(newSongObject);
    } else {
      setEmptyVersionWarning(true);
      setTimeout(() => {
        setEmptyVersionWarning(false);
      }, 2000);
      return;
    }
    setShowDeleteVersionModal(false);
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

  useEffect(() => {
    if (titleSpanRef.current) {
      setTitleWidth(titleSpanRef.current.offsetWidth);
    }
  }, [currentSong.title]);
  useOnClickOutside(versionModalRef, handleVersionModal);

  useOnClickOutside(deleteVersionModalRef, handleDeleteVersionModal);

  return (
    <div className="flex flex-col lg:gap-4 gap-2 lg:flex-row lg:justify-between lg:items-center">
      <div className="flex flex-col-reverse gap-2 lg:flex-row gap-1">
        <div className="flex">
          <span
            ref={titleSpanRef}
            className="text-3xl font-semibold pr-2 absolute z-neg10	opacity-0 "
          >
            {currentSong.title}
          </span>
          <input
            value={currentSong.title}
            onChange={handleChange}
            onFocus={handleTextFocus}
            onBlur={handleTextFocus}
            placeholder="Song Title"
            type="text"
            id="song-title"
            name="title"
            style={{ width: titleWidth }}
            className={
              "text-3xl font-semibold focus:outline-none focus:border-b-2  " +
              (currentTheme === "Light"
                ? "bg-white focus:border-black "
                : "bg-neutral-800 focus:border-white ")
            }
          />
          {showTitleCross && (
            <img
              src="./src/assets/SVG/cross.svg"
              id="song-title-cross"
              alt=""
              className={
                "w-6 " + (currentTheme === "Dark" && "grayscale invert")
              }
              onClick={handleClearTitle}
            />
          )}
        </div>

        <div className="items-end flex gap-1 w-max">
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
                (currentVersion?.theme?.bgColor !== ("bg-gray-100" || "") &&
                  "invert")
              }
            />
          </button>
          {emptyVersionWarning && (
            <span className="ml-2 font-semibold">
              Can't delete only section!
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 font-2xl">
        <div className="flex justify-between gap-2 items-center font-semibold text-xs">
          <a
            onClick={handleSongDownload}
            className={
              `font-bold ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.bgColor} border-2 ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.hoverColor}  py-1 px-2 lg:py-2 lg:px-4 rounded-2xl cursor-pointer ` +
              (currentTheme === "Dark"
                ? " hover:bg-neutral-800 "
                : " hover:bg-white ") +
              (currentVersion?.theme?.textColor === "text-black" &&
                currentTheme === "Dark" &&
                " hover:text-white ")
            }
            id="download-button"
          >
            Download
          </a>
          <label
            className={
              `font-bold ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.bgColor} border-2 ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.hoverColor}  py-1 px-2 lg:py-2 lg:px-4 rounded-2xl cursor-pointer ` +
              (currentTheme === "Dark"
                ? " hover:bg-neutral-800 "
                : " hover:bg-white ") +
              (currentVersion?.theme?.textColor === "text-black" &&
                currentTheme === "Dark" &&
                " hover:text-white ")
            }
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

        <p className="font-bold whitespace-nowrap text-xs ml-2">
          {currentSong.updated}
        </p>
      </div>
      {showVersionModal && (
        <div
          ref={versionModalRef}
          className={
            "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
            (currentTheme === "Light"
              ? "bg-white text-black border-gray-300"
              : "bg-neutral-800 text-white border-neutral-600")
          }
        >
          <span className="text-xl">Enter new section name</span>
          <input
            autoFocus
            value={versionModalInput}
            onChange={(e) => setVersionModalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewVersion()}
            type="text"
            className={
              "max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg " +
              (currentTheme === "Light" ? "bg-white" : "bg-neutral-800")
            }
          ></input>
          <div className="flex gap-4 justify-end">
            {modalWarning && (
              <span className="font-semibold text-md ml-2">
                Section must have a name!
              </span>
            )}
            <button
              onClick={addNewVersion}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              OK
            </button>
            <button
              onClick={handleVersionModal}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteVersionModal && (
        <div
          ref={deleteVersionModalRef}
          className={
            "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border rounded-xl z-10 py-6 px-6 " +
            (currentTheme === "Light"
              ? "bg-white text-black border-gray-300"
              : "bg-neutral-800 text-white border-neutral-600")
          }
        >
          <span className="text-xl">
            Are you sure you want to delete the selected section?
          </span>
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleDeleteVersion}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Yes
            </button>
            <button
              onClick={handleDeleteVersionModal}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
