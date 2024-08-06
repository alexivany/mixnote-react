import { useState } from "react";
import Instrument from "./Instrument";
import { useThemeContext } from "@/contexts/theme-context";

export default function InstrumentSection({
  currentVersion,
  setCurrentVersion,
}) {
  const { currentTheme } = useThemeContext();

  const [newInstrumentInput, setNewInstrumentInput] = useState<string>("");
  const [instrumentWarning, setInstrumentWarning] = useState<boolean>(false);
  const [instrumentWarningText, setInstrumentWarningText] =
    useState<string>("");

  function handleNewInstrument() {
    const duplicateCheck = Object.entries(currentVersion).find(
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

    if (
      newInstrumentInput === "" ||
      !/^[a-zA-Z0-9]+$/.test(newInstrumentInput)
    ) {
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

    newInstrumentInput === "Guitar" && (template = guitarTemplate);
    newInstrumentInput === "Bass" && (template = bassTemplate);

    setCurrentVersion((prevVersionData) => {
      if (newInstrumentInput === "Guitar" || newInstrumentInput === "Bass") {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
            tabs: template,
          },
        };
      } else if (newInstrumentInput === "Vocals") {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
            lyrics: "",
          },
        };
      } else {
        return {
          ...prevVersionData,
          [newInstrumentInput]: {
            instrument: newInstrumentInput,
            label: newInstrumentInput,
            notes: "",
          },
        };
      }
    });
    setNewInstrumentInput("");
  }

  const instrumentElements = Object.entries(currentVersion).map(
    ([key, value]) =>
      typeof value === "object" &&
      key !== "theme" && (
        <Instrument
          key={key}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
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
            "border rounded-lg p-2 " +
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
            `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-4 py-2 font-semibold text-sm lg:text-base cursor-pointer ` +
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
      </div>
      <div className="flex flex-col gap-4">{instrumentElements}</div>
    </>
  );
}
