import { useState, useEffect, useRef } from "react";

import TabCell from "./TabCell";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";

import { useThemeContext } from "@/contexts/theme-context";

export default function InstrumentTabs({ instrumentToTab }) {
  const { currentTheme } = useThemeContext();
  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  const [tabArray, setTabArray] = useState<[string, string[]][]>([]);

  const tabDivRef = useRef<HTMLDivElement>(null);

  const guitarTemplate = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

  const bassTemplate = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

  const tabsHTML = tabArray.map(([note, line], tabIndex) => (
    <div key={`tab-${tabIndex}`}>
      <span id="#tab-cell">{note}</span>
      {note !== "_" && "|"}
      {line.map((e, i) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/)) {
          return (
            <TabCell
              tabArray={tabArray}
              setTabArray={setTabArray}
              index={i}
              note={note}
              key={`tab-${tabIndex}-${i}`}
              value={e}
            />
          );
        } else
          return (
            <span id="#tab-cell" key={`span-${tabIndex}-${i}`}>
              {e}
            </span>
          );
      })}
    </div>
  ));

  function handleClearTab() {
    let newString;
    if (instrumentToTab === "Guitar") {
      newString = guitarTemplate;
    } else if (instrumentToTab === "Bass") {
      newString = bassTemplate;
    }

    const tabArrayRows = newString.trim().split("\n");
    const tabArrayToSet: [string, string[]][] = [];

    tabArrayRows.forEach((row) => {
      const columns = row.split("|").filter((column) => column.trim() !== "");
      const notes = columns[1].split("");

      const newArray: [string, string[]] = [columns[0], notes];

      tabArrayToSet.push(newArray);
    });

    setTabArray(tabArrayToSet);
  }

  function handleAddRow() {
    let newString;
    if (instrumentToTab === "Guitar") {
      newString = guitarTemplate;
    } else if (instrumentToTab === "Bass") {
      newString = bassTemplate;
    }

    const tabArrayRows = newString.trim().split("\n");
    // const tabArrayToSet: [string, string[]][] = [];
    const lineBreak = [..."_", Array.from({ length: 165 }, (_) => "_")] as [
      string,
      string[]
    ];

    setTabArray((prevState) => [...prevState, lineBreak]);

    tabArrayRows.forEach((row) => {
      const columns = row.split("|").filter((column) => column.trim() !== "");
      const notes = columns[1].split("");

      const newArray: [string, string[]] = [columns[0], notes];
      setTabArray((prevState) => [...prevState, newArray]);
    });
  }

  useEffect(() => {
    let newString;
    if (currentVersion) {
      newString = currentVersion?.[instrumentToTab].tabs;
    } else if (instrumentToTab === "Guitar") {
      newString = guitarTemplate;
    } else if (instrumentToTab === "Bass") {
      newString = guitarTemplate;
    }

    const tabArrayRows = newString.trim().split("\n");
    const tabArrayToSet: [string, string[]][] = [];

    tabArrayRows.forEach((row) => {
      const columns = row.split("|").filter((column) => column.trim() !== "");
      const notes = columns[1].split("");

      const newArray: [string, string[]] = [columns[0], notes];

      tabArrayToSet.push(newArray);
    });

    setTabArray(tabArrayToSet);
  }, []);

  useEffect(() => {
    const newRows = tabArray.map((subarray) => {
      const row = subarray[0] + "|";

      const notes = subarray[1].join("");

      return row.concat(notes + "\n");
    });
    const newTabString = newRows.join("");

    if (newTabString !== currentVersion?.[instrumentToTab].tabs) {
      setCurrentVersion((prevVersion) => {
        return {
          ...prevVersion,
          [instrumentToTab]: {
            ...prevVersion?.[instrumentToTab],
            tabs: newTabString,
          },
        } as Version;
      });
    }
  }, [tabArray]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          onClick={handleAddRow}
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold  text-sm lg:text-md cursor-pointer`}
        >
          Add Row
        </button>
        <button
          onClick={handleClearTab}
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold text-sm lg:text-md cursor-pointer`}
        >
          Clear
        </button>
        <a
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold text-sm lg:text-md cursor-pointer`}
        >
          Download
        </a>
      </div>
      <div
        ref={tabDivRef}
        id="tab-div"
        className={
          "border font-mono rounded-lg p-2 text-sm whitespace-pre display-inline overflow-auto " +
          (currentTheme === "Light"
            ? "border-gray-300 "
            : " border-neutral-600")
        }
      >
        {tabsHTML}
      </div>
    </>
  );
}
