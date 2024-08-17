import { useThemeContext } from "@/contexts/theme-context";
import { Dispatch, SetStateAction, useState } from "react";

interface TabCellProps {
  tabArray: [string, string[]][];
  setTabArray: Dispatch<SetStateAction<[string, string[]][]>>;
  value: string;
  index: number;
  note: string;
  lineIndex: number;
}

export default function TabCell({
  tabArray,
  setTabArray,
  value,
  index,
  note,
  lineIndex,
}: TabCellProps) {
  const { currentTheme } = useThemeContext();
  const [showInput, setShowInput] = useState<boolean>(false);

  const [tabValue, setTabValue] = useState<string>(value);

  function handleMouseDown(e) {
    e.preventDefault();
  }

  function handleClick() {
    setShowInput(true);
  }

  function handleInputBlur(b) {
    if (b.target.value !== "" && b.target.value !== "-") {
      const newValue = b.target.value.replace(/[\s-]/g, "");
      const newArray = tabArray.map((subarray, i) => {
        if (subarray[0] === note && i === lineIndex) {
          if (subarray[1]) {
            subarray[1] = subarray[1].map((t, i) => {
              if (i === index) {
                return newValue;
              } else {
                return t;
              }
            });
          }
        }
        return subarray;
      });

      if (!/^\s*$/.test(b.target.value)) {
        setTabValue(newValue);
      } else {
        setTabValue("-");
      }
      setTabArray(newArray);
    }
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
          onKeyDown={(e) => e.key === "Enter" && handleInputBlur(e)}
          autoFocus
          className={
            `h-3.5 w-3.5 outline-1 outline-bg-black focus:outline-1 focus:border-0 ` +
            (currentTheme === "Dark" && `text-black`)
          }
        />
      )}
    </span>
  );
}
