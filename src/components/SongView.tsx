import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";

export default function SongView() {
  return (
    <div className="song-view">
      <SongHeader />
      <SongDetails />
      {/* <GeneralNotes />
      <InstrumentInput />
      <InstrumentNotes /> */}
    </div>
  );
}
