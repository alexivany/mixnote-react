import { useState, useEffect, useRef } from "react";

import TabCell from "./TabCell";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";

import { v4 as uuidv4 } from "uuid";

export default function InstrumentTabs({ instrumentToTab }) {
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

  const tabsHTML = tabArray.map(([note, line]) => (
    <div key={uuidv4()}>
      <span id="#tab-cell">{note}</span>|
      {line.map((e, i) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/)) {
          return (
            <TabCell
              tabArray={tabArray}
              setTabArray={setTabArray}
              index={i}
              note={note}
              key={uuidv4()}
              value={e}
            />
          );
        } else return <span id="#tab-cell">{e}</span>;
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
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
        >
          Add Row
        </button>
        <button
          onClick={handleClearTab}
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
        >
          Clear
        </button>
        <a
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
        >
          Download
        </a>
      </div>
      <div
        ref={tabDivRef}
        className="border font-mono border-gray-300 rounded-lg p-2 text-sm whitespace-pre display-inline overflow-auto"
      >
        {tabsHTML}
      </div>
    </>
  );
}
