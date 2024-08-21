import { useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "usehooks-ts";

import LyricModal from "./LyricModal";
import DrumMachine from "../DrumMachine/DrumMachine";
import InstrumentTabs from "./InstrumentTabs";
import TextEditor from "../TextEditor/TextEditor";

import { useThemeContext } from "@/contexts/theme-context";
import FeatureDropdown from "./FeatureDropdown";
import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";
import { AnimatePresence } from "framer-motion";

export default function Instrument({ instrumentObject }) {
  const { currentTheme } = useThemeContext();

  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  const [showInstrumentNotes, setShowInstrumentNotes] = useState<boolean>(true);

  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false);
  const [showLyricModal, setShowLyricModal] = useState<boolean>(false);

  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);

  const [aiOptionType, setAiOptionType] = useState<"edit" | "auto">("auto");

  const [showFeatureSelect, setShowFeatureSelect] = useState<boolean>(false);
  const [addedFeatures, setAddedFeatures] = useState<string[]>([]);
  const [showFeatureWarning, setShowFeatureWarning] = useState<boolean>(false);
  const [featureWarningText, setFeatureWarningText] = useState<string>();

  const modalRef = useRef<HTMLDivElement>(null);

  const currentInstrument = currentVersion?.[instrumentObject.instrument];

  function handleInstrumentChange(e) {
    setCurrentVersion((prevVersionData) => {
      return {
        ...prevVersionData,
        [instrumentObject.instrument]: {
          ...prevVersionData?.[instrumentObject.instrument],
          [e.target.name]: e.target.value,
        },
      } as Version;
    });
  }

  function handleDeleteInstrument() {
    const filteredVersion = Object.entries(currentVersion as Version).filter(
      ([key, value]) => {
        if (key !== instrumentObject.instrument) {
          return [key, value];
        }
      }
    );
    const newVersionObject = Object.fromEntries(filteredVersion);
    setCurrentVersion(newVersionObject as Version);
  }

  // function deleteInstrumentFeature(e) {
  // }

  function addInstrumentFeature(e) {
    if (e.target.value) {
      if (!addedFeatures.includes(e.target.value)) {
        if (
          (e.target.value === "guitarTab" &&
            addedFeatures.includes("bassTab")) ||
          (e.target.value === "guitarTab" &&
            currentInstrument.instrument.match(/bass\s*(guitar)?/i)) ||
          (e.target.value === "guitarTab" &&
            addedFeatures.includes("guitarTab")) ||
          (e.target.value === "guitarTab" &&
            currentInstrument.instrument.match(
              /(electric|acoustic)?\s*guitar/i
            )) ||
          (e.target.value === "bassTab" &&
            addedFeatures.includes("guitarTab")) ||
          (e.target.value === "bassTab" &&
            currentInstrument.instrument.match(
              /(electric|acoustic)?\s*guitar/i
            )) ||
          (e.target.value === "bassTab" && addedFeatures.includes("bassTab")) ||
          (e.target.value === "bassTab" &&
            currentInstrument.instrument.match(/bass\s*(guitar)?/i))
        ) {
          setFeatureWarningText("Tabs already exist!");
          setShowFeatureWarning(true);
          setTimeout(() => {
            setShowFeatureWarning(false);
          }, 4000);
          return;
        } else if (
          e.target.value === "drumMachine" &&
          currentInstrument.instrument.match(/drums?/i)
        ) {
          setFeatureWarningText("Drums already exist!");
          setShowFeatureWarning(true);
          setTimeout(() => {
            setShowFeatureWarning(false);
          }, 4000);
          return;
        } else if (e.target.value === "drumMachine") {
          if (currentVersion) {
            const hasMatchingProperty = Object.keys(currentVersion).some(
              (property) => /drums?/i.test(property)
            );
            if (hasMatchingProperty) {
              setFeatureWarningText("Drums already exist!");
              setShowFeatureWarning(true);
              setTimeout(() => {
                setShowFeatureWarning(false);
              }, 4000);
              return;
            }
          }
        }
        setAddedFeatures((prevState) => [...prevState, e.target.value]);
      } else {
        if (e.target.value === "lyrics") {
          setFeatureWarningText("Lyrics already exist!");
          setShowFeatureWarning(true);
          setTimeout(() => {
            setShowFeatureWarning(false);
          }, 4000);
          return;
        } else if (e.target.value === "drumMachine") {
          setFeatureWarningText("Drums already exist!");
          setShowFeatureWarning(true);
          setTimeout(() => {
            setShowFeatureWarning(false);
          }, 4000);
          return;
        }
      }
    }

    setShowFeatureSelect((prevState) => !prevState);
  }

  function handleLyricModal() {
    setShowLyricModal((prevState) => !prevState);
  }

  useEffect(() => {
    if (currentVersion) {
      setCurrentVersion((prevVersionData) => {
        return {
          ...prevVersionData,
          [instrumentObject.instrument]: {
            ...prevVersionData?.[instrumentObject.instrument],
            addedFeatures: addedFeatures,
          },
        } as Version;
      });
    }
    if (addedFeatures.includes("lyrics")) {
      if (!currentVersion?.[instrumentObject.instrument].lyrics) {
        setCurrentVersion((prevVersionData) => {
          return {
            ...prevVersionData,
            [instrumentObject.instrument]: {
              ...prevVersionData?.[instrumentObject.instrument],
              lyrics: "",
            },
          } as Version;
        });
      }
    }
  }, [addedFeatures]);

  useEffect(() => {
    if (currentVersion) {
      if (currentVersion[instrumentObject.instrument].addedFeatures) {
        setAddedFeatures(
          currentVersion[instrumentObject.instrument].addedFeatures
        );
      }
    }
  }, []);

  useOnClickOutside(modalRef, handleLyricModal);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-8 justify-between">
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
        <div className="flex relative gap-2 justify-center items-center">
          {showDeleteWarning && (
            <>
              <span className="text-xs lg:text-sm whitespace-nowrap font-semibold">
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
          {showFeatureWarning && (
            <span className="text-sm font-semibold">{featureWarningText}</span>
          )}
          {showFeatureSelect ? (
            <FeatureDropdown addInstrumentFeature={addInstrumentFeature} />
          ) : (
            <img
              src="./src/assets/SVG/function-add-fill.svg"
              alt=""
              className={
                "w-6 m-0 p-0 cursor-pointer hover:scale-110 transition-transform " +
                (currentTheme === "Dark" && "grayscale invert")
              }
              onClick={(e) => {
                addInstrumentFeature(e);
              }}
            />
          )}

          <img
            src={
              showInstrumentNotes
                ? "./src/assets/SVG/arrow-drop-up-line.svg"
                : "./src/assets/SVG/arrow-drop-down-line.svg"
            }
            alt=""
            className={
              "transition-transform w-7 m-0 p-0 cursor-pointer hover:scale-125 " +
              (currentTheme === "Dark" && "grayscale invert")
            }
            onClick={() => {
              setShowInstrumentNotes((prevState) => !prevState);
            }}
          />

          <img
            src="./src/assets/SVG/cross.svg"
            alt=""
            className={
              "transition-transform w-6 m-0 p-0 cursor-pointer hover:scale-125 " +
              (currentTheme === "Dark" && "grayscale invert")
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

          {(currentInstrument.instrument.match(
            /(electric|acoustic)?\s*guitar/i
          ) ||
            currentInstrument.instrument.match(/bass\s*(guitar)?/i)) && (
            <InstrumentTabs
              instrumentToTab={currentInstrument.instrument}
              tabToLoad={currentInstrument.tabs}
            />
          )}

          {addedFeatures.includes("guitarTab") && (
            <InstrumentTabs
              instrumentToTab={currentInstrument.instrument}
              tabToLoad={currentInstrument.tabs}
            />
          )}

          {addedFeatures.includes("bassTab") && (
            <InstrumentTabs
              instrumentToTab={currentInstrument.instrument}
              tabToLoad={currentInstrument.tabs}
            />
          )}

          {(currentInstrument.instrument.match(/vocals?/i) ||
            addedFeatures.includes("lyrics")) && (
            <div className="relative flex">
              <TextEditor
                objectKey={instrumentObject.instrument}
                noteToLoad={`${[instrumentObject.instrument]}.lyrics`}
              />
              <div
                onMouseEnter={() => setShowAiOptions(true)}
                onMouseLeave={() => setShowAiOptions(false)}
                className={`absolute right-5 hover:scale-105 transition-transform  bottom-4 text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
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
          <AnimatePresence>
            {showLyricModal && (
              <LyricModal
                modalRef={modalRef}
                handleLyricModal={handleLyricModal}
                setCurrentVersion={setCurrentVersion}
                instrumentObject={instrumentObject}
                aiOptionType={aiOptionType}
              />
            )}
          </AnimatePresence>
          {(currentInstrument.instrument.match(/drums?/i) ||
            addedFeatures.includes("drumMachine")) && (
            <DrumMachine instrumentToTab={currentInstrument.instrument} />
          )}
        </>
      )}
    </div>
  );
}
