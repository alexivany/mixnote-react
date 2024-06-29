import { Dispatch, SetStateAction, useState } from "react";

import OpenAI from "openai";

import { Modal, Version, InstrumentData } from "../types";

interface LyricModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  handleLyricModal: () => void;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
  instrumentObject: InstrumentData;
}

export default function LyricModal({
  modalRef,
  handleLyricModal,
  setCurrentVersion,
  instrumentObject,
}: LyricModalProps) {
  const [lyricModalInput, setLyricModalInput] = useState<Modal>({
    about: "",
    lines: 1,
    section: "",
    mood: "",
    poetic: 0,
  });

  function handleModalInputChange(e) {
    setLyricModalInput((prevModalData) => {
      return {
        ...prevModalData,
        [e.target.name]: e.target.value,
      };
    });
  }

  // const openai = new OpenAI({ apiKey: key });

  // async function generateLyrics() {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       {
  //         role: "system",
  //         content: `You are an award-winning songwriter helping me write my next big hit. You will be provided with the specific section of the song you will write. You will also be provided with the exact amount of lines to generate, as well the topic that the song is about, and the general mood and feeling of the song. You should write lyrics poetically, determined by a number between 0 and 10, with 10 being the most poetic and 0 being the least poetic. Your current poetic level is ${lyricModalInput.poetic}. You will only respond with lyrics.`,
  //       },
  //       {
  //         role: "user",
  //         content: `Write me a ${lyricModalInput.section} section of a song, that is ${lyricModalInput.lines} lines long and about ${lyricModalInput.about}, with the general feeling of ${lyricModalInput.mood}`,
  //       },
  //     ],
  //   });

  //   setCurrentVersion((prevVersionData) => {
  //     return {
  //       ...prevVersionData,
  //       [instrumentObject.instrument]: {
  //         ...prevVersionData[instrumentObject.instrument],
  //         lyrics: response,
  //       },
  //     } as Version;
  //   });
  // }

  return (
    <div
      ref={modalRef}
      className="bg-white absolute  left-0 gap-4 font-semibold m-auto right-0 w-4/5 flex flex-col justify-between border border-gray-300 rounded-xl z-10 py-6 px-6"
    >
      <span className="text-xl">What is your song about?</span>
      <input
        autoFocus
        value={lyricModalInput.about}
        onChange={handleModalInputChange}
        // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
        type="text"
        name="about"
        className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
      ></input>
      <div className="grid grid-cols-4 grid-rows-1 gap-6 items-end">
        <div className="flex flex-col gap-2">
          <span className="text-md">How many lines do you want generated?</span>
          <input
            value={lyricModalInput.lines}
            onChange={handleModalInputChange}
            // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="number"
            name="lines"
            min="1"
            max="99"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-md">
            What section of your song is this for?
          </span>
          <input
            value={lyricModalInput.section}
            onChange={handleModalInputChange}
            // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="text"
            list="sections"
            name="section"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-md">
            What is the feeling or mood of the song?
          </span>
          <input
            value={lyricModalInput.mood}
            onChange={handleModalInputChange}
            // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="text"
            name="mood"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-md">
            How poetic should the lyrics be? (10 being the most poetic)
          </span>
          <input
            value={lyricModalInput.poetic}
            onChange={handleModalInputChange}
            // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="number"
            name="poetic"
            min="0"
            max="10"
            className="max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg"
          ></input>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          // onClick={generateLyrics}
          className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
        >
          Generate
        </button>
        <button
          onClick={handleLyricModal}
          className="bg-gray-100 border-2  border-gray-100 py-2 px-4 rounded-2xl cursor-pointer"
        >
          Cancel
        </button>
      </div>
      <datalist id="sections">
        <option value="Verse"></option>
        <option value="Pre-chorus"></option>
        <option value="Chorus"></option>
        <option value="Post-chorus"></option>
        <option value="Bridge"></option>
      </datalist>
    </div>
  );
}
