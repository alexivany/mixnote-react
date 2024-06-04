import { useState, useEffect } from "react";

export default function GeneralNotes({ handleChange, currentVersion }) {
  const [generalNotesValue, setGeneralNotesValue] = useState("");

  useEffect(() => {
    const newNotes = currentVersion.generalNotes
      ? currentVersion.generalNotes
      : "";
    setGeneralNotesValue(newNotes);
  }, [currentVersion]);
  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold" htmlFor="song-general">
        General Notes:
      </label>
      <textarea
        onChange={handleChange}
        value={generalNotesValue}
        className="resize-none border border-gray-300 rounded-lg p-2 text-sm focus:outline-2 focus:outline-gray-500"
        name="generalNotes"
        id="song-general"
        cols={100}
        rows={10}
        placeholder="Enter notes here..."
      ></textarea>
    </div>
  );
}
