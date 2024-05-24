export default function SongHeader() {
  return (
    <div className="song-header">
      <div className="song-header--container">
        <div className="song-header--title">
          <input placeholder="Song Title" type="text" id="song-title" />
          <img src="./src/assets/SVG/cross.svg" id="song-title-cross" alt="" />
        </div>

        <div className="song-tabs">
          <button className="song-tabs--add">
            <img src="./src/assets/SVG/plus.svg" alt="" />
          </button>
        </div>
      </div>
      <div className="song-header--right-container">
        <div className="song-header--import-export">
          <a id="download-button">Download</a>
          <label htmlFor="file-upload" id="file-upload-label">
            <p>Upload</p>
          </label>
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            accept=".json"
          />
        </div>

        <p className="song-header--time"></p>
      </div>
    </div>
  );
}
