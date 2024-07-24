import { useEffect, useState } from "react";
import DrumStep from "./DrumStep";

import { v4 as uuidv4 } from "uuid";

export default function DrumRow({ label, drumSeqArray, setDrumSeqArray }) {
  const [rowLabel, setRowLabel] = useState<string>();

  useEffect(() => {
    if (label === 0) {
      setRowLabel("Kick");
    } else if (label === 1) {
      setRowLabel("Snare");
    } else if (label === 2) {
      setRowLabel("Hi-Hat");
    } else if (label === 3) {
      setRowLabel("Crash");
    }
  }, [label]);

  return (
    <div className="grid grid-cols-16 gap-1">
      <span className="col-span-1 font-semibold">{rowLabel}</span>
      {drumSeqArray &&
        drumSeqArray.map((rows, rowIndex) => {
          if (label === rowIndex) {
            return rows.map((step, i) => (
              <DrumStep
                key={`${label}-${i}`}
                index={i}
                soundRow={rowIndex}
                setDrumSeqArray={setDrumSeqArray}
                active={step.isActive}
              />
            ));
          }
        })}
    </div>
  );
}
