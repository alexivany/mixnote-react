export default function SongHeader({ currentSong }) {
  return (
    <div className="flex gap-4 justify-between items-end">
      <div className="flex gap-1">
        <div className="flex">
          <input
            value={currentSong.title}
            placeholder="Song Title"
            type="text"
            id="song-title"
            className="w-64 text-3xl font-semibold focus:outline-none focus:border-b-2 focus:border-black"
          />
          <img
            src="./src/assets/SVG/cross.svg"
            id="song-title-cross"
            alt=""
            className="w-6"
          />
        </div>

        <div className="song-tabs">
          <button className="border border-gray-100 bg-gray-100 p-2 rounded-t-2xl">
            <img src="./src/assets/SVG/plus.svg" alt="" className="w-4" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2 font-2xl">
        <div className="flex justify-between gap-2 items-center font-semibold text-xs">
          <a id="download-button">Download</a>
          <label htmlFor="file-upload" id="file-upload-label">
            <p>Upload</p>
          </label>
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            accept=".json"
            className="hidden"
          />
        </div>

        <p className="song-header--time">{currentSong.updated}</p>
      </div>
    </div>
  );
}
