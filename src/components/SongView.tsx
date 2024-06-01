import SongHeader from "./SongHeader";
import SongDetails from "./SongDetails";

export default function SongView({ currentSong }) {
  return (
    <div className="absolute left-64 right-0 p-4">
      <SongHeader currentSong={currentSong} />
      <SongDetails currentSong={currentSong} />
      {/* <GeneralNotes />
      <InstrumentInput />
      <InstrumentNotes /> */}
    </div>
  );
}
