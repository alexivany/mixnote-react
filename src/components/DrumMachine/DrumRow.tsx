import DrumStep from "./DrumStep";

export default function DrumRow({ label, currentVersion }) {
  return (
    <div className="grid grid-cols-16 gap-1">
      <span className="col-span-1 font-semibold">{label}</span>
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
      <DrumStep currentVersion={currentVersion} />
    </div>
  );
}
