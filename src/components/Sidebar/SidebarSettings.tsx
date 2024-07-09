import { useState, useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

import { useApiContext } from "../../contexts/api-context";

interface SidebarSettings {
  setSongs: (newSongArray) => void;
}

export default function SidebarSettings({ setSongs }: SidebarSettings) {
  const [showSongModal, setShowSongModal] = useState<boolean>(false);
  const [songModalInput, setSongModalInput] = useState<string>("");

  // const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const { apiKey, setApiKey } = useApiContext();

  const songModalRef = useRef(null);
  const settingsModalRef = useRef(null);

  function handleSongModal() {
    setShowSongModal((prevState) => !prevState);
    setSongModalInput("");
  }

  function handleSettingsModal() {
    setShowSettingsModal((prevState) => !prevState);
  }

  function addNewSong() {
    setSongs((prevSongs) => {
      return [
        ...prevSongs,
        {
          title: songModalInput,
          id: uuidv4(),
          ["Demo"]: {
            version: "Demo",
            generalNotes: "",
            theme: {
              activeColor: "text-black",
              bgColor: "bg-gray-100",
              borderColor: "border-gray-100",
              textColor: "text-black",
            },
          },
        },
      ];
    });
    handleSongModal();
  }

  useOnClickOutside(songModalRef, handleSongModal);
  useOnClickOutside(settingsModalRef, handleSettingsModal);
  return (
    <div className="absolute inset-x-4 text-lg bottom-0 pt-4 border-t border-gray-300 mb-4 flex flex-col gap-4">
      <button
        onClick={handleSongModal}
        className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50"
      >
        <img src="./src/assets/SVG/plus.svg" className="w-6" alt="" />
        New Song
      </button>
      <button
        onClick={handleSettingsModal}
        className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50"
      >
        <img src="./src/assets/SVG/settings.svg" className="w-6" alt="" />
        Preferences
      </button>
      <button className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50">
        <img src="./src/assets/SVG/info.svg" className="w-6" alt="" />
        About
      </button>
      {showSongModal && (
        <div
          ref={songModalRef}
          className="bg-white fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border border-gray-300 rounded-xl z-10 py-6 px-6"
        >
          <span className="text-xl">Enter new song name</span>
          <input
            autoFocus
            value={songModalInput}
            onChange={(e) => setSongModalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="text"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
          <div className="flex gap-4 justify-end">
            <button
              onClick={addNewSong}
              className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={handleSongModal}
              className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div
          ref={settingsModalRef}
          className="bg-white fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border border-gray-300 rounded-xl z-10 py-6 px-6"
        >
          <span className="text-xl">User OpenAI API Key</span>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="text"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleSettingsModal}
              className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
