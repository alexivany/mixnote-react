import { Dispatch, SetStateAction, useState } from "react";

// import { wrapOpenAI } from "langsmith/wrappers";
import OpenAI from "openai";

import { Modal, Version, InstrumentData } from "../../types";
import { useApiContext } from "../../contexts/api-context";
import { useThemeContext } from "@/contexts/theme-context";

interface LyricModalProps {
  modalRef: React.RefObject<HTMLDivElement>;
  handleLyricModal: () => void;
  setCurrentVersion: Dispatch<SetStateAction<Version | undefined>>;
  instrumentObject: InstrumentData;
  aiOptionType: "edit" | "auto";
}

export default function LyricModal({
  modalRef,
  handleLyricModal,
  setCurrentVersion,
  instrumentObject,
  aiOptionType,
}: LyricModalProps) {
  const { currentTheme } = useThemeContext();

  const [lyricModalInput, setLyricModalInput] = useState<Modal>({
    about: "",
    lines: 1,
    section: "",
    mood: "",
    poetic: 0,
  });

  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [modalWarningText, setModalWarningText] = useState<string>();

  const { apiKey, setApiKey } = useApiContext();

  function handleModalInputChange(e) {
    setLyricModalInput((prevModalData) => {
      return {
        ...prevModalData,
        [e.target.name]: e.target.value,
      };
    });
  }

  const generateLyrics = async (e) => {
    e.preventDefault();
    console.log(e);
    if (
      lyricModalInput.about !== "" &&
      lyricModalInput.section !== "" &&
      lyricModalInput.mood !== ""
    ) {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      setModalWarningText("Generating lyrics...");
      setModalWarning(true);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 1,
        max_tokens: 256,
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are an award-winning songwriter helping me write my next big hit. You will be provided with the specific section of the song you will write. You will also be provided with the exact amount of lines to generate, as well the topic that the song is about, and the general mood and feeling of the song. You should write lyrics poetically, determined by a number between 0 and 10, with 10 being the most poetic and 0 being the least poetic. Your current poetic level is ${lyricModalInput.poetic}. You will only respond with lyrics.`,
          },
          {
            role: "user",
            content: `Write me a ${lyricModalInput.section} section of a song, that is ${lyricModalInput.lines} lines long and about ${lyricModalInput.about}, with the general feeling of ${lyricModalInput.mood}`,
          },
        ],
      });
      handleLyricModal();
      setModalWarning(false);
      for await (const chunk of response) {
        setCurrentVersion((prevVersionData) => {
          if (prevVersionData) {
            if (!chunk.choices[0]?.delta?.content) {
              return {
                ...prevVersionData,
                [instrumentObject.instrument]: {
                  ...prevVersionData[instrumentObject.instrument],
                  lyrics: `${
                    prevVersionData[instrumentObject.instrument].lyrics
                  }`,
                },
              } as Version;
            }
            if (!chunk.choices[0]?.delta?.content.match(/[.,]/)) {
              return {
                ...prevVersionData,
                [instrumentObject.instrument]: {
                  ...prevVersionData[instrumentObject.instrument],
                  lyrics:
                    `${prevVersionData[instrumentObject.instrument].lyrics}` +
                    `${chunk.choices[0]?.delta?.content}`,
                },
              } as Version;
            }
            return {
              ...prevVersionData,
              [instrumentObject.instrument]: {
                ...prevVersionData[instrumentObject.instrument],
                lyrics:
                  `${prevVersionData[instrumentObject.instrument].lyrics}` +
                  `${chunk.choices[0]?.delta?.content?.trimEnd()}`,
              },
            } as Version;
          }
        });
      }
      if (!response) {
        setModalWarningText("One or more inputs are empty!");
        setModalWarning(true);
        setTimeout(() => {
          setModalWarning(false);
        }, 2000);
        return;
      }
    }
  };

  return (
    <div
      ref={modalRef}
      className={
        "absolute top-1/2 gap-4  self-center font-semibold m-auto w-4/5 flex flex-col justify-between border rounded-xl z-10 p-6 " +
        (currentTheme === "Light"
          ? "border-gray-300 bg-white"
          : "bg-neutral-800 border-neutral-600")
      }
    >
      {aiOptionType === "edit" && (
        <>
          <span className="text-xl">What is your song about?</span>
          <input
            autoFocus
            value={lyricModalInput.about}
            onChange={handleModalInputChange}
            // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="text"
            name="about"
            className={
              "max-w-full font-normal mb-2 border px-2 rounded-lg " +
              (currentTheme === "Light"
                ? "bg-white border-gray-300"
                : "bg-neutral-800 border-neutral-600")
            }
          ></input>
          <div className="grid grid-cols-4 grid-rows-1 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <span className="text-md">
                How many lines do you want generated?
              </span>
              <input
                value={lyricModalInput.lines}
                onChange={handleModalInputChange}
                // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
                type="number"
                name="lines"
                min="1"
                max="99"
                className={
                  "max-w-full font-normal mb-2 border px-2 rounded-lg " +
                  (currentTheme === "Light"
                    ? "bg-white border-gray-300"
                    : "bg-neutral-800 border-neutral-600")
                }
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
                className={
                  "max-w-full font-normal mb-2 border px-2 rounded-lg " +
                  (currentTheme === "Light"
                    ? "bg-white border-gray-300"
                    : "bg-neutral-800 border-neutral-600")
                }
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
                className={
                  "max-w-full font-normal mb-2 border px-2 rounded-lg " +
                  (currentTheme === "Light"
                    ? "bg-white border-gray-300"
                    : "bg-neutral-800 border-neutral-600")
                }
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
                className={
                  "max-w-full font-normal mb-2 border px-2 rounded-lg " +
                  (currentTheme === "Light"
                    ? "bg-white border-gray-300"
                    : "bg-neutral-800 border-neutral-600")
                }
              ></input>
            </div>
          </div>
        </>
      )}

      <span className="text-lg">Please enter your OpenAI API Key</span>
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        // onKeyDown={(e) => e.key === "Enter" && addNewSong()}
        type="text"
        name="api-key"
        min="1"
        max="99"
        className={
          "max-w-full font-normal mb-2 border  px-2 rounded-lg " +
          (currentTheme === "Light"
            ? "bg-white border-gray-300"
            : "bg-neutral-800 border-neutral-600")
        }
      ></input>

      <div className="flex gap-4 justify-end items-center">
        {modalWarning && (
          <span className="font-semibold text-md ml-2">{modalWarningText}</span>
        )}
        <button
          onClick={(e) => {
            if (aiOptionType === "auto") {
              setLyricModalInput({
                about: "A catchy pop song",
                lines: 8,
                section: "Verse",
                mood: "Neutral",
                poetic: 6,
              });
            }
            generateLyrics(e);
          }}
          className={
            "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
            (currentTheme === "Light"
              ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
              : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
          }
        >
          Generate
        </button>
        <button
          onClick={handleLyricModal}
          className={
            "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
            (currentTheme === "Light"
              ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
              : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
          }
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
