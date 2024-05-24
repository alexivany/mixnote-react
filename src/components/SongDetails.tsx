export default function SongDetails() {
  return (
    <div className="song-details">
      <div className="song-details--tags">
        <div className="song-details--tags-container"></div>
        <button id="tag-add-button">Add Tags...</button>
      </div>
      <div className="song-details--key-bpm">
        <div className="key-bpm--container">
          <div className="key-details">
            <input
              type="text"
              name="key"
              id="key"
              placeholder="Key"
              maxLength={8}
            />
          </div>
          <div className="bpm-details">
            <input
              type="text"
              name="bpm"
              id="bpm"
              placeholder="BPM"
              maxLength={6}
            />
          </div>
        </div>
        <div className="theme-icon--container">
          <img id="red-blob" src="./src/assets/SVG/blobs/red-blob.svg" alt="" />
          <img
            id="orange-blob"
            src="./src/assets/SVG/blobs/orange-blob.svg"
            alt=""
          />
          <img
            id="yellow-blob"
            src="./src/assets/SVG/blobs/yellow-blob.svg"
            alt=""
          />
          <img
            id="green-blob"
            src="./src/assets/SVG/blobs/green-blob.svg"
            alt=""
          />
          <img
            id="teal-blob"
            src="./src/assets/SVG/blobs/teal-blob.svg"
            alt=""
          />
          <img
            id="cyan-blob"
            src="./src/assets/SVG/blobs/cyan-blob.svg"
            alt=""
          />
          <img
            id="blue-blob"
            src="./src/assets/SVG/blobs/blue-blob.svg"
            alt=""
          />
          <img
            id="purple-blob"
            src="./src/assets/SVG/blobs/purple-blob.svg"
            alt=""
          />
          <img
            id="pink-blob"
            src="./src/assets/SVG/blobs/pink-blob.svg"
            alt=""
          />
          <img
            id="grey-blob"
            src="./src/assets/SVG/blobs/grey-blob.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
