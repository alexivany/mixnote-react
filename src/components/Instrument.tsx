// import { useState, useEffect } from "react";

// import InstrumentTabs from "./InstrumentTabs";

export default function Instrument({
  currentVersion,
  setCurrentVersion,
  instrumentObject,
}) {
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
        key !== instrumentObject.instrument;
        console.log(value);
      }
    );

    const newVersionObject = Object.fromEntries(filteredVersion);

    setCurrentVersion(newVersionObject);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <input
          type="text"
          className="font-semibold w-fit border-none px-0.5 py-1"
          name="label"
          value={currentInstrument.label}
          onChange={handleInstrumentChange}
        />
        <img
          src="./src/assets/SVG/cross.svg"
          alt=""
          className="w-6 m-0 p-0"
          onClick={handleDeleteInstrument}
        />
      </div>
      <textarea
        value={currentInstrument.notes}
        onChange={handleInstrumentChange}
        name="notes"
        className="resize-none border border-gray-300 rounded-lg p-2 text-sm focus:outline-2 focus:outline-gray-500"
        rows={5}
        placeholder="Enter notes here..."
      />

      {/* {(currentInstrument.instrument === "Guitar" ||
        currentInstrument.instrument === "Bass") && (
        <InstrumentTabs
          instrumentToTab={currentInstrument.instrument}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        />
      )} */}

      {currentInstrument.instrument === "Vocals" && (
        <div className="relative flex">
          <textarea
            value={currentInstrument.lyrics}
            onChange={handleInstrumentChange}
            name="lyrics"
            className="resize-none w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-2 focus:outline-gray-500"
            rows={8}
            placeholder="Enter lyrics here..."
          />
          <button
            className={`absolute right-5 bottom-4 text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
          >
            Suggest Lyrics...
          </button>
        </div>
      )}
    </div>
  );
}
