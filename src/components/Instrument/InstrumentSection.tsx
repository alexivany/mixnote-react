import { useState } from "react";
import Instrument from "./Instrument";
import { useThemeContext } from "@/contexts/theme-context";
import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";
import { AnimatePresence } from "framer-motion";
import InstrumentModal from "./InstrumentModal";

export default function InstrumentSection() {
  const { currentTheme } = useThemeContext();

  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  const [showInstrumentModal, setShowInstrumentModal] =
    useState<boolean>(false);

  const [newInstrumentInput, setNewInstrumentInput] = useState<string>("");
  const [instrumentWarning, setInstrumentWarning] = useState<boolean>(false);
  const [instrumentWarningText, setInstrumentWarningText] =
    useState<string>("");

  function handleInstrumentModal() {
    setShowInstrumentModal((prevState) => !prevState);
  }

  function handleNewInstrument() {
    const duplicateCheck = Object.entries(currentVersion as Version).find(
      ([key]) => key === newInstrumentInput
    );

    if (duplicateCheck) {
      setInstrumentWarningText("Instrument already exists!");
      setInstrumentWarning(true);
      setTimeout(() => {
        setInstrumentWarning(false);
      }, 2000);
      return;
    }

    if (newInstrumentInput === "" || newInstrumentInput.match(/^\s*$/)) {
      setInstrumentWarningText("Instrument must have a name!");
      setInstrumentWarning(true);
      setTimeout(() => {
        setInstrumentWarning(false);
      }, 2000);
      return;
    }

    const guitarTemplate = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

    const bassTemplate = `G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

    let template;

    newInstrumentInput.match(/bass\s*(guitar)?/i) && (template = bassTemplate);
    newInstrumentInput.match(/(electric|acoustic)?\s*guitar/i) &&
      (template = guitarTemplate);

    setCurrentVersion((prevVersionData) => {
      if (
        newInstrumentInput.match(/bass\s*(guitar)?/i) ||
        newInstrumentInput.match(/(electric|acoustic)?\s*guitar/i)
      ) {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
            tabs: template,
          },
        } as Version;
      } else if (newInstrumentInput.match(/vocals?/i)) {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
            lyrics: "",
          },
        } as Version;
      } else {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
          },
        } as Version;
      }
    });
    setNewInstrumentInput("");
  }

  const instrumentElements = Object.entries(currentVersion as Version).map(
    ([key, value]) =>
      typeof value === "object" &&
      key !== "theme" && (
        <Instrument
          key={`${key}-${currentVersion?.versionId}`}
          instrumentObject={value}
        />
      )
  );

  return (
    <>
      <div className="flex gap-4 items-center my-4">
        <input
          value={newInstrumentInput}
          onChange={(e) => setNewInstrumentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleNewInstrument()}
          className={
            "border rounded-lg p-2 w-full md:w-auto " +
            (currentTheme === "Light"
              ? "border-gray-300 "
              : "bg-neutral-800 border-neutral-600")
          }
          list="instruments"
          id="add-instrument-input"
          name="add-instrument-input"
        />
        <button
          onClick={handleNewInstrument}
          className={
            `border-2 rounded-2xl hover:scale-105 transition-transform whitespace-nowrap ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-4 py-2 font-semibold text-sm lg:text-base cursor-pointer ` +
            (currentTheme === "Dark"
              ? " hover:bg-neutral-800 "
              : " hover:bg-white ") +
            (currentVersion?.theme?.textColor === "text-black" &&
              currentTheme === "Dark" &&
              " hover:text-white ")
          }
        >
          Add Instrument
        </button>
        <button
          onClick={handleInstrumentModal}
          className={`hover:scale-110 hover:brightness-90 transition-transform text-sm lg:text-md border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold`}
        >
          <img
            src="/SVG/magic-fill.svg"
            alt=""
            className={
              "w-6 m-0 p-0 grayscale invert " +
              (currentVersion?.theme?.bgColor === "bg-gray-100" && "invert-0 ")
            }
          />
        </button>
        {instrumentWarning && (
          <span className="font-semibold text-md ml-2">
            {instrumentWarningText}
          </span>
        )}
        <datalist id="instruments">
          <option value="Guitar"></option>
          <option value="Bass"></option>
          <option value="Keys"></option>
          <option value="Drums"></option>
          <option value="Vocals"></option>
        </datalist>
        <AnimatePresence>
          {showInstrumentModal && (
            <InstrumentModal handleInstrumentModal={handleInstrumentModal} />
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-4">{instrumentElements}</div>
    </>
  );
}
