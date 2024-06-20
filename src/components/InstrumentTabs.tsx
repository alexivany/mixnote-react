import { useState, useEffect, useRef } from "react";

import TabCell from "./TabCell";

export default function InstrumentTabs({
  instrumentToTab,
  currentVersion,
  setCurrentVersion,
}) {
  const guitarTemplate = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

  const [tabString, setTabString] = useState(
    currentVersion?.[instrumentToTab].tabs
    // guitarTemplate
  );

  useEffect(() => {
    setTabString(currentVersion?.[instrumentToTab].tabs);
  }, [currentSong]);

  const [tabArray, setTabArray] = useState([]);

  const tabDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabArrayRows = tabString.trim().split("\n");
    const tabArrayToSet = [];

    tabArrayRows.forEach((row) => {
      const columns = row.split("|").filter((column) => column.trim() !== "");
      const notes = columns[1].split("");

      const newArray = [columns[0], notes];

      tabArrayToSet.push(newArray);
    });

    setTabArray(tabArrayToSet);
  }, [tabString]);

  useEffect(() => {
    const newString = tabDivRef?.current?.innerText;

    setCurrentVersion((prevVersion) => {
      return {
        ...prevVersion,
        Guitar: {
          ...prevVersion.Guitar,
          tabs: newString,
        },
      };
    });
  }, [tabArray]);

  // const tabsHTML = tabString.split("").map((e, i) => {
  //   if (e === "-" || e.match(/[0-9+a-gA-G]/))
  //     return <TabCell setTabString={setTabString} index={i} value={e} />;
  //   return <span id="#tab-cell">{e}</span>;
  // });

  // console.log(tabArray.map(([note, line], i) => `${note}|${line}`));

  // console.log(tabArray);

  const tabsHTML = tabArray.map(([note, line]) => (
    <div>
      <span id="#tab-cell">{note}</span>|
      {line.map((e, i) => {
        if (e === "-" || e.match(/[0-9+a-gA-G]/))
          return (
            <TabCell
              tabArray={tabArray}
              setTabArray={setTabArray}
              index={i}
              key={i}
              value={e}
              row={note}
            />
          );
        return <span id="#tab-cell">{e}</span>;
      })}
    </div>
  ));

  // 2D Array, target id array

  function handleClearTab() {
    // const tabArrayRows = guitarTemplate.trim().split("\n");
    // const tabArrayToSet = [];
    // tabArrayRows.forEach((row) => {
    //   const columns = row.split("|").filter((column) => column.trim() !== "");
    //   const notes = columns[1].split("");
    //   const newArray = [columns[0], notes];
    //   tabArrayToSet.push(newArray);
    // });
    // setTabArray(tabArrayToSet);

    setCurrentVersion((prevVersion) => {
      return {
        ...prevVersion,
        Guitar: {
          ...prevVersion.Guitar,
          tabs: guitarTemplate,
        },
      };
    });

    // setTabString(guitarTemplate);
  }

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
