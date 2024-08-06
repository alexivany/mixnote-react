import TextEditor from "./TextEditor/TextEditor";

export default function GeneralNotes() {
  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold" htmlFor="song-general">
        General Notes:
      </label>
      <TextEditor objectKey={"generalNotes"} noteToLoad={"generalNotes"} />
    </div>
  );
}
