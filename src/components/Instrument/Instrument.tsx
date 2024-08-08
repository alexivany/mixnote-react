import { useRef, useState } from "react";

import { useOnClickOutside } from "usehooks-ts";

import LyricModal from "./LyricModal";
import DrumMachine from "../DrumMachine/DrumMachine";
import InstrumentTabs from "./InstrumentTabs";
import { useCurrentSongContext } from "@/contexts/currentsong-context";
import { useThemeContext } from "@/contexts/theme-context";
import TextEditor from "../TextEditor/TextEditor";

export default function Instrument({
  currentVersion,
  setCurrentVersion,
  instrumentObject,
}) {
  const { currentTheme } = useThemeContext();

  const { currentSong } = useCurrentSongContext();

  const [showInstrumentNotes, setShowInstrumentNotes] = useState<boolean>(true);

  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
  const [showLyricModal, setShowLyricModal] = useState<boolean>(false);

  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);

  const [aiOptionType, setAiOptionType] = useState<"edit" | "auto">("auto");

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
                className={
                  `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-2 py-1 font-semibold text-sm cursor-pointer ` +
                  (currentTheme === "Dark"
                    ? " hover:bg-neutral-800 "
                    : " hover:bg-white ") +
                  (currentVersion?.theme?.textColor === "text-black" &&
                    currentTheme === "Dark" &&
                    " hover:text-white ")
                }
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteWarning(false)}
                className={
                  `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-2 py-1 font-semibold text-sm cursor-pointer ` +
                  (currentTheme === "Dark"
                    ? " hover:bg-neutral-800 "
                    : " hover:bg-white ") +
                  (currentVersion?.theme?.textColor === "text-black" &&
                    currentTheme === "Dark" &&
                    " hover:text-white ")
                }
              >
                No
              </button>
            </>
          )}

          <img
            src="./src/assets/SVG/function-add-fill.svg"
            alt=""
            className={
              "w-6 m-0 p-0 " + (currentTheme === "Dark" && "grayscale invert")
            }
            onClick={() => {}}
          />

          <img
            src={
              showInstrumentNotes
                ? "./src/assets/SVG/arrow-drop-up-line.svg"
                : "./src/assets/SVG/arrow-drop-down-line.svg"
            }
            alt=""
            className={
              "w-7 m-0 p-0  " + (currentTheme === "Dark" && "grayscale invert")
            }
            onClick={() => {
              setShowInstrumentNotes((prevState) => !prevState);
            }}
          />

          <img
            src="./src/assets/SVG/cross.svg"
            alt=""
            className={
              "w-6 m-0 p-0 " + (currentTheme === "Dark" && "grayscale invert")
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
      {showInstrumentNotes && (
        <>
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
              {/* <textarea
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
              /> */}
              <TextEditor
                objectKey={instrumentObject.instrument}
                noteToLoad={`${[instrumentObject.instrument]}.lyrics`}
              />
              <div
                onMouseEnter={() => setShowAiOptions(true)}
                onMouseLeave={() => setShowAiOptions(false)}
                className={`absolute right-5 bottom-4 text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
              >
                {showAiOptions ? (
                  <>
                    <button
                      onClick={() => {
                        handleLyricModal();
                        setAiOptionType("auto");
                      }}
                      className={
                        `border-2 rounded-xl px-2  ${currentVersion?.theme?.hoverColor} ` +
                        (currentVersion?.theme?.bgColor === "bg-gray-100"
                          ? "border-black  hover:bg-neutral-800 hover:text-gray-100"
                          : "border-white hover:bg-white")
                      }
                    >
                      Auto-AI
                    </button>
                    {" | "}
                    <button
                      onClick={() => {
                        handleLyricModal();
                        setAiOptionType("edit");
                      }}
                      className={
                        `border-2 rounded-xl px-2  ${currentVersion?.theme?.hoverColor} ` +
                        (currentVersion?.theme?.bgColor === "bg-gray-100"
                          ? "border-black  hover:bg-neutral-800 hover:text-gray-100"
                          : "border-white hover:bg-white")
                      }
                    >
                      Suggest Lyrics
                    </button>
                  </>
                ) : (
                  <img
                    src="./src/assets/SVG/magic-fill.svg"
                    alt=""
                    className={
                      "w-5 m-0 p-0 grayscale invert " +
                      (currentVersion?.theme?.bgColor === "bg-gray-100" &&
                        "invert-0 ")
                    }
                  />
                )}
              </div>
            </div>
          )}

          {showLyricModal && (
            <LyricModal
              modalRef={modalRef}
              handleLyricModal={handleLyricModal}
              setCurrentVersion={setCurrentVersion}
              instrumentObject={instrumentObject}
              aiOptionType={aiOptionType}
            />
          )}

          {currentInstrument.instrument === "Drums" &&
            currentSong &&
            currentVersion && (
              <DrumMachine instrumentToTab={currentInstrument.instrument} />
            )}
        </>
      )}
    </div>
  );
}
