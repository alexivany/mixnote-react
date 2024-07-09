import { useState } from "react";

export default function DrumStep({ currentVersion }) {
  const [stepToggle, setStepToggle] = useState<boolean>(false);

  function handleToggle() {
    setStepToggle((prevState) => !prevState);
  }
  return (
    <div
      className={
        `border-2 rounded-lg ${currentVersion?.theme?.borderColor} ` +
        (stepToggle && `${currentVersion?.theme?.bgColor}`)
      }
      onClick={handleToggle}
    ></div>
  );
}
