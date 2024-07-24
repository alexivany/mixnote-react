import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { useEffect, useMemo, useState } from "react";

export default function DrumStep({ index, soundRow, setDrumSeqArray, active }) {
  const { currentVersion } = useCurrentVersionContext();
  const [stepActive, setStepActive] = useState<boolean>(false);

  function handleToggle() {
    setStepActive((prevState) => !prevState);
  }

  useMemo(() => {
    setStepActive(active);
  }, [active]);

  useEffect(() => {
    setDrumSeqArray((prevState) => {
      const newState = [...prevState];

      newState[soundRow][index].isActive = stepActive;

      return newState;
    });
  }, [stepActive]);

  return (
    <button
      className={
        `border-2 rounded-lg ${currentVersion?.theme?.borderColor} ` +
        (stepActive && `${currentVersion?.theme?.bgColor}`)
      }
      onClick={handleToggle}
    ></button>
  );
}
