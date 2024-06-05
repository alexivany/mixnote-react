import { useState } from "react";
import Instrument from "./Instrument";

export default function InstrumentSection({
  currentVersion,
  setCurrentVersion,
}) {
  const [newInstrumentInput, setNewInstrumentInput] = useState("");
  const [duplicateInstrumentWarning, setDuplicateInstrumentWarning] =
    useState(false);

  function handleNewInstrument() {
    const duplicateCheck = Object.entries(currentVersion).find(
      ([key]) => key === newInstrumentInput
    );

    if (duplicateCheck) {
      setDuplicateInstrumentWarning(true);
      setTimeout(() => {
        setDuplicateInstrumentWarning(false);
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
          className="border border-gray-300 rounded-lg p-2"
          list="instruments"
          id="add-instrument-input"
          name="add-instrument-input"
        />
        <button
          onClick={handleNewInstrument}
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
        >
          Add Instrument
        </button>
        {duplicateInstrumentWarning && (
          <span className="font-semibold text-md ml-2">
            Instrument already exists!
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
