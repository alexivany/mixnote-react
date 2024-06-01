import SidebarSettings from "./SidebarSettings";

type Song = {
  [key: string]: never;
};

interface SidebarProps {
  songs: Song[];
  setCurrentSong: (song: Song) => void;
  currentSong: Song;
}

export default function Sidebar({
  songs,
  setCurrentSong,
  currentSong,
}: SidebarProps) {
  const songList = songs.map((song) => (
    <button
      className={
        "text-left text-xl " +
        (currentSong.id === song.id &&
          "bg-gray-100 rounded-2xl outline outline-4 outline-gray-100 font-semibold")
      }
      key={song.id}
      onClick={() =>
        setCurrentSong(() => songs.find((newSong) => song.id === newSong.id))
      }
    >
      {song.title}
    </button>
  ));

  return (
    <div className="p-4 border-r flex flex-col border-gray-300 gap-4 w-64 fixed inset-y-0 z-10">
      <div className="flex justify-between items-center border-b border-gray-300">
        <h1 className="font-medium text-2xl">MixNote</h1>
        <div className="flex">
          <img src="./src/assets/SVG/music-slider.svg" alt="" className="w-6" />
          <img
            src="./src/assets/SVG/hamburger.svg"
            className="w-6 inline lg:hidden"
            alt=""
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4">{songList}</div>
        <SidebarSettings />
      </div>
    </div>
  );
}
