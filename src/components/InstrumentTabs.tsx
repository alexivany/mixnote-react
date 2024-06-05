import { useState } from "react";

import TabCell from "./TabCell";

export default function InstrumentTabs({
  instrumentToTab,
  currentVersion,
  setCurrentVersion,
}) {
  const tabsHTML = currentVersion?.[instrumentToTab].tabs.split("").map((e) => {
    if (e === "-" || e.match(/[0-9+a-gA-G]/)) return <TabCell value={e} />;
    return <span id="#tab-cell">{e}</span>;
  });

  return (
    <>
      <div className="flex gap-2 items-center">
        <button
          className={`border-2 rounded-2xl ${currentVersion?.theme?.borderColor} ${currentVersion?.theme?.bgColor} ${currentVersion?.theme?.textColor} px-4 py-2 font-semibold cursor-pointer`}
        >
          Add Row
        </button>
        <button
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
      <div className="border font-mono border-gray-300 rounded-lg p-2 text-sm whitespace-pre display-inline overflow-auto">
        {tabsHTML}
      </div>
    </>
  );
}
