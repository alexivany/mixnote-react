import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import TextEditor from "./TextEditor";

export default function GeneralNotes() {
  const { currentVersion } = useCurrentVersionContext();
  return (
    <div className="flex flex-col gap-4">
      <label className="font-semibold" htmlFor="song-general">
        General Notes:
      </label>
      <TextEditor objectKey={"generalNotes"} noteToLoad={"generalNotes"} />
    </div>
  );
}
