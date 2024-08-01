import { useRef, useState } from "react";

import { useOnClickOutside } from "usehooks-ts";

import LyricModal from "./LyricModal";
import DrumMachine from "../DrumMachine/DrumMachine";
import InstrumentTabs from "./InstrumentTabs";
import { useCurrentSongContext } from "@/contexts/currentsong-context";
import { useThemeContext } from "@/contexts/theme-context";
import TextEditor from "../TextEditor";

export default function Instrument({
  currentVersion,
  setCurrentVersion,
  instrumentObject,
}) {
  const { currentTheme } = useThemeContext();

  const { currentSong } = useCurrentSongContext();

  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
  const [showLyricModal, setShowLyricModal] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const currentInstrument = currentVersion[instrumentObject.instrument];

  function handleInstrumentChange(e) {
    setCurrentVersion((prevVersionData) => {
      return {
        ...prevVersionData,
        [instrumentObject.instrument]: {
          ...prevVersionData[instrumentObject.instrument],
          [e.target.name]: e.target.value,
        },
      };
    });
  }

  function handleDeleteInstrument() {
    const filteredVersion = Object.entries(currentVersion).filter(
      ([key, value]) => {
        if (key !== instrumentObject.instrument) {
          return [key, value];
        }
      }
    );
    const newVersionObject = Object.fromEntries(filteredVersion);
    setCurrentVersion(newVersionObject);
  }

  function handleLyricModal() {
    setShowLyricModal((prevState) => !prevState);
  }

  // useEffect(() => {
  //   if (modalRef) {
  //     modalRef.current?.scrollIntoView();
  //   }
  // });

  useOnClickOutside(modalRef, handleLyricModal);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <input
          type="text"
          className={
            "font-semibold w-fit border-none px-0.5 py-1 " +
            (currentTheme === "Light" ? "" : "bg-neutral-800")
          }
          name="label"
          value={currentInstrument.label}
          onChange={handleInstrumentChange}
        />
        <div className="flex gap-2 justify-center items-center">
          {showDeleteWarning && (
            <>
              <span className="text-sm font-semibold">
                Are you sure you want to delete this instrument?
              </span>
              <button
                onClick={handleDeleteInstrument}
                className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-2 py-1 font-semibold text-sm cursor-pointer`}
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteWarning(false)}
                className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-2 py-1 font-semibold text-sm cursor-pointer`}
              >
                No
              </button>
            </>
          )}

          <img
            src="./src/assets/SVG/cross.svg"
            alt=""
            className={
              "w-6 m-0 p-0" + (currentTheme === "Dark" && "grayscale invert")
            }
            onClick={() => {
              setShowDeleteWarning(true);
              setTimeout(() => {
                setShowDeleteWarning(false);
              }, 4000);
            }}
          />
        </div>
      </div>
      {/* <textarea
        value={currentInstrument.notes}
        onChange={handleInstrumentChange}
        name="notes"
        className={
          "resize-none border  rounded-lg p-2 text-sm focus:outline-2 focus:outline-gray-500 " +
          (currentTheme === "Light"
            ? "border-gray-300"
            : "border-neutral-600 bg-neutral-800")
        }
        rows={5}
        placeholder="Enter notes here..."
      /> */}

      <TextEditor
        objectKey={instrumentObject.instrument}
        noteToLoad={`${[instrumentObject.instrument]}.notes`}
      />

      {(currentInstrument.instrument === "Guitar" ||
        currentInstrument.instrument === "Bass") && (
        <InstrumentTabs instrumentToTab={currentInstrument.instrument} />
      )}

      {currentInstrument.instrument === "Vocals" && (
        <div className="relative flex">
          <textarea
            value={currentInstrument.lyrics}
            onChange={handleInstrumentChange}
            name="lyrics"
            className={
              "resize-none w-full border rounded-lg p-2 text-sm focus:outline-2 focus:outline-gray-500 " +
              (currentTheme === "Light"
                ? "border-gray-300"
                : "border-neutral-600 bg-neutral-800")
            }
            rows={8}
            placeholder="Enter lyrics here..."
          />
          <button
            onClick={handleLyricModal}
            className={`absolute right-5 bottom-4 text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
          >
            Suggest Lyrics...
          </button>
        </div>
      )}

      {showLyricModal && (
        <LyricModal
          modalRef={modalRef}
          handleLyricModal={handleLyricModal}
          setCurrentVersion={setCurrentVersion}
          instrumentObject={instrumentObject}
        />
      )}

      {currentInstrument.instrument === "Drums" &&
        currentSong &&
        currentVersion && (
          <DrumMachine instrumentToTab={currentInstrument.instrument} />
        )}
    </div>
  );
}
