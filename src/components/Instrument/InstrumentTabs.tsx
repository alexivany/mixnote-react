import { useState, useEffect, useRef } from "react";

import TabCell from "./TabCell";

import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { Version } from "@/types";

import { v4 as uuidv4 } from "uuid";

import { useThemeContext } from "@/contexts/theme-context";

export default function InstrumentTabs({ instrumentToTab, tabToLoad }) {
  const { currentTheme } = useThemeContext();
  const { currentVersion, setCurrentVersion } = useCurrentVersionContext();

  const [tabArray, setTabArray] = useState<[string, string[]][]>([]);

  // const [showDelete, setShowDelete] = useState<boolean>(false);

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
    <div key={`tab-${tabIndex}-${uuidv4()}`}>
      <span id="#tab-cell">{note}</span>
      {note !== "_" && "|"}
      {line.map((e, i) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/)) {
          return (
            <TabCell
              tabArray={tabArray}
              setTabArray={setTabArray}
              index={i}
              lineIndex={tabIndex}
              note={note}
              key={`tab-${tabIndex}-${i}-${uuidv4()}`}
              value={e}
            />
          );
        } else
          return (
            <span id="#tab-cell" key={`span-${tabIndex}-${i}-${uuidv4()}`}>
              {e}
            </span>
          );
      })}
    </div>
  ));

  function handleClearTab() {
    let newString;
    if (
      instrumentToTab.match(/bass\s*(guitar)?/i) ||
      currentVersion?.[instrumentToTab]?.addedFeatures?.includes("bassTab")
    ) {
      newString = bassTemplate;
    } else if (
      instrumentToTab.match(/(electric|acoustic)?\s*guitar/i) ||
      currentVersion?.[instrumentToTab]?.addedFeatures?.includes("guitarTab")
    ) {
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
  }

  function handleAddRow() {
    let newString;
    if (
      instrumentToTab.match(/bass\s*(guitar)?/i) ||
      currentVersion?.[instrumentToTab]?.addedFeatures?.includes("bassTab")
    ) {
      newString = bassTemplate;
    } else if (
      instrumentToTab.match(/(electric|acoustic)?\s*guitar/i) ||
      currentVersion?.[instrumentToTab]?.addedFeatures?.includes("guitarTab")
    ) {
      newString = guitarTemplate;
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
      if (tabToLoad) {
        newString = tabToLoad;
      } else if (currentVersion?.[instrumentToTab].tabs) {
        if (currentVersion?.[instrumentToTab].tabs.match(/^\s*$/)) {
          if (instrumentToTab.match(/(electric|acoustic)?\s*guitar/i)) {
            newString = guitarTemplate;
          } else if (instrumentToTab.match(/bass\s*(guitar)?/i)) {
            newString = bassTemplate;
          }
        } else {
          newString = currentVersion?.[instrumentToTab].tabs;
        }
      } else if (instrumentToTab.match(/bass\s*(guitar)?/i)) {
        console.log("setting bass");
        newString = bassTemplate;
      } else if (instrumentToTab.match(/(electric|acoustic)?\s*guitar/i)) {
        console.log("setting guitar");
        newString = guitarTemplate;
      } else if (
        currentVersion?.[instrumentToTab]?.addedFeatures?.includes("guitarTab")
      ) {
        newString = guitarTemplate;
      } else if (
        currentVersion?.[instrumentToTab]?.addedFeatures?.includes("bassTab")
      ) {
        newString = bassTemplate;
      }

      if (newString) {
        const tabArrayRows = newString.trim().split("\n");
        const tabArrayToSet: [string, string[]][] = [];

        tabArrayRows.forEach((row) => {
          const columns = row
            .split("|")
            .filter((column) => column.trim() !== "");
          const notes = columns[1].split("");

          const newArray: [string, string[]] = [columns[0], notes];

          tabArrayToSet.push(newArray);
        });

        setTabArray(tabArrayToSet);
      }
    }
  }, [currentVersion?.[instrumentToTab].addedFeatures]);

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
          className={
            `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor}  ${currentVersion?.theme?.hoverColor} px-4 py-2 font-semibold  text-sm lg:text-md cursor-pointer ` +
            (currentTheme === "Dark"
              ? " hover:bg-neutral-800 "
              : " hover:bg-white ") +
            (currentVersion?.theme?.textColor === "text-black" &&
              currentTheme === "Dark" &&
              " hover:text-white ")
          }
        >
          Add Row
        </button>
        <button
          onClick={handleClearTab}
          className={
            `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-4 py-2 font-semibold text-sm lg:text-md cursor-pointer ` +
            (currentTheme === "Dark"
              ? " hover:bg-neutral-800 "
              : " hover:bg-white ") +
            (currentVersion?.theme?.textColor === "text-black" &&
              currentTheme === "Dark" &&
              " hover:text-white ")
          }
        >
          Clear
        </button>
        <a
          className={
            `border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} ${currentVersion?.theme?.hoverColor} px-4 py-2 font-semibold text-sm lg:text-md cursor-pointer ` +
            (currentTheme === "Dark"
              ? " hover:bg-neutral-800 "
              : " hover:bg-white ") +
            (currentVersion?.theme?.textColor === "text-black" &&
              currentTheme === "Dark" &&
              " hover:text-white ")
          }
        >
          Download
        </a>
      </div>
      <div
        // onMouseEnter={() => setShowDelete(true)}
        // onMouseLeave={() => setShowDelete(false)}
        ref={tabDivRef}
        id="tab-div"
        className={
          "border font-mono relative rounded-lg p-2 text-sm whitespace-pre display-inline overflow-auto " +
          (currentTheme === "Light"
            ? "border-gray-300 "
            : " border-neutral-600")
        }
      >
        {tabsHTML}
        {/* {showDelete && (
          <button
            className={`absolute right-2 top-2 text-sm lg:text-md rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-1 py-0.5 font-semibold cursor-pointer`}
          >
            <img
              src="./src/assets/SVG/cross.svg"
              alt=""
              className={
                "w-6 m-0 p-0 grayscale invert " +
                (currentVersion?.theme?.bgColor === "bg-gray-100" &&
                  "invert-0 ")
              }
            />
          </button>
        )} */}
      </div>
    </>
  );
}
