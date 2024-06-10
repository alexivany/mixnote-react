import { useState } from "react";

export default function TabCell({ setTabString, value }) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [tabValue, setTabValue] = useState(value);

  function handleMouseDown(e) {
    e.preventDefault();
  }

  function handleClick() {
    setShowInput(true);
  }

  function handleInputBlur(b) {
    setTabString();
    setTabValue(b.target.value);
    setShowInput(false);
  }
  return (
    <span
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className="cursor: pointer"
      id="#tab-cell"
    >
      {!showInput ? (
        tabValue
      ) : (
        <input
          onBlur={handleInputBlur}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInputBlur(e)}
          autoFocus
          className="h-3.5 w-3.5 outline-1 outline-bg-black focus:outline-1 focus:border-0"
        />
      )}
    </span>
  );
}
