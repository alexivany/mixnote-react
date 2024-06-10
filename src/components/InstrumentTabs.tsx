import { useState, useEffect, useRef } from "react";

import TabCell from "./TabCell";

export default function InstrumentTabs({
  instrumentToTab,
  currentVersion,
  setCurrentVersion,
}) {
  const [tabString, setTabString] = useState(
    currentVersion?.[instrumentToTab].tabs
  );
  const [tabChange, setTabChange] = useState(false);

  const tabDivRef = useRef<HTMLDivElement>(null);

  const guitarTemplate = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|`;

  const tabsHTML = tabString.split("").map((e) => {
    if (e === "-" || e.match(/[0-9+a-gA-G]/))
      return <TabCell setTabString={setTabString} value={e} />;
    return <span id="#tab-cell">{e}</span>;
  });

  // 2D Array, target id array

  function handleClearTab() {}
  // setCurrentVersion((prevVersionData) => {
  //   return {
  //     ...prevVersionData,
  //     [instrumentToTab]: {
  //       ...prevVersionData[instrumentToTab],
  //       tabs: guitarTemplate,
  //     },
  //   };
  // });
  // setTabString(guitarTemplate);

  // useEffect(() => {
  //   console.log(tabString);
  //   console.log(tabDivRef?.current?.innerText);
  // }, [tabString]);

  // useEffect(() => {
  //   setTabString(tabDivRef.current?.innerText);
  // }, [tabChange]);

  // useEffect(() => {
  //   setCurrentVersion((prevVersionData) => {
  //     return {
  //       ...prevVersionData,
  //       [instrumentToTab]: {
  //         ...prevVersionData[instrumentToTab],
  //         tabs: tabString,
  //       },
  //     };
  //   });
  // }, [tabString, instrumentToTab]);

  // useEffect(() => {
  //   setCurrentVersion((prevVersionData) => {
  //     return {
  //       ...prevVersionData,
  //       [instrumentToTab]: {
  //         ...prevVersionData[instrumentToTab],
  //         tabs: tabDivRef.current?.innerText,
  //       },
  //     };
  //   });

  //   console.log(tabDivRef.current?.innerText);
  // }, [tabChange]);
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
