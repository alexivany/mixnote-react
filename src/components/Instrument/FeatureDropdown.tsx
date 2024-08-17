import { useThemeContext } from "@/contexts/theme-context";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function FeatureDropdown({ addInstrumentFeature }) {
  const selectRef = useRef<HTMLDivElement>(null);

  const { currentTheme } = useThemeContext();

  useOnClickOutside(selectRef, addInstrumentFeature);
  return (
    <div ref={selectRef}>
      <select
        autoFocus
        onChange={(e) => {
          addInstrumentFeature(e);
        }}
        name="instrument-features"
        id="instrument-features"
        className={
          "border rounded-lg p-2 " +
          (currentTheme === "Light"
            ? "border-gray-300 "
            : "bg-neutral-800 border-neutral-600")
        }
        defaultValue="disabled"
      >
        <option disabled value="disabled">
          Add features...
        </option>
        <option value="guitarTab">Guitar Tab</option>
        <option value="bassTab">Bass Tab</option>
        <option value="lyrics">Lyrics</option>
        <option value="drumMachine">Drum Machine</option>
      </select>
    </div>
  );
}
