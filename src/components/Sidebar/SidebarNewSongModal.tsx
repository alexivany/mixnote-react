import { Dispatch, SetStateAction, useRef, useState } from "react";

import { useApiContext } from "@/contexts/api-context";
import { useThemeContext } from "@/contexts/theme-context";

import { Song } from "@/types";

import { useOnClickOutside } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

import { OpenAI } from "openai";

interface SidebarNewSongModalProps {
  handleSongModal(): void;
  setSongs: Dispatch<SetStateAction<Song[] | undefined>>;
}

export default function SidebarNewSongModal({
  handleSongModal,
  setSongs,
}: SidebarNewSongModalProps) {
  const { currentTheme } = useThemeContext();

  const { apiKey, setApiKey } = useApiContext();

  const [showSongAiOptions, setShowSongAiOptions] = useState<boolean>(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);

  const [modalWarningText, setModalWarningText] = useState<string>();

  const [songModalInput, setSongModalInput] = useState<string>("");

  const [aiInput, setAiInput] = useState<string>("");

  const songModalRef = useRef(null);

  function addNewSong() {
    if (songModalInput.match(/^\s*$/)) {
      setModalWarningText("Song must have a name!");
      setModalWarning(true);
      setTimeout(() => {
        setModalWarning(false);
      }, 2000);
      return;
    }
    setSongs((prevSongs) => {
      return [
        ...(prevSongs ?? []),
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
      ] as Song[];
    });
    handleSongModal();
  }

  function handleSongModalReset() {
    handleSongModal();
    setSongModalInput("");
    setShowSongAiOptions(false);
  }

  // const tools = [
  //   {
  //     name: "generate_song",
  //     description:
  //       "Generate a new song object to save into localStorage. Call this whenever you are given a description of a song.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         title: {
  //           type: "string",
  //           description: "The title of the song.",
  //         },
  //         bpm: {
  //           type: "number",
  //           description: "The beats per minute or tempo of the song.",
  //         },
  //         key: {
  //           type: "string",
  //           description: "The key of the song.",
  //         },
  //         id: {
  //           type: "string",
  //           description: "The unique identifier for the song.",
  //         },
  //         sections: {
  //           type: "object",
  //           description:
  //             "An object where each key is a section name, and each value is the section details.",
  //           additionalProperties: {
  //             type: "object",
  //             properties: {
  //               version: { type: "string", description: "Section name." },
  //               generalNotes: {
  //                 type: "string",
  //                 description: "Notes for the section.",
  //               },
  //               theme: {
  //                 type: "object",
  //                 properties: {
  //                   activeColor: {
  //                     type: "string",
  //                     description: "The active color for the section.",
  //                   },
  //                   bgColor: {
  //                     type: "string",
  //                     description: "The background color for the section.",
  //                   },
  //                   borderColor: {
  //                     type: "string",
  //                     description: "The border color for the section.",
  //                   },
  //                   textColor: {
  //                     type: "string",
  //                     description: "The text color for the section.",
  //                   },
  //                 },
  //               },
  //               instruments: {
  //                 type: "object",
  //                 description:
  //                   "An object where each key is an instrument name, and each value is the instrument details.",
  //                 additionalProperties: {
  //                   type: "object",
  //                   properties: {
  //                     instrument: {
  //                       type: "string",
  //                       description: "The instrument name.",
  //                     },
  //                     label: {
  //                       type: "string",
  //                       description: "The label for the instrument.",
  //                     },
  //                     notes: {
  //                       type: "string",
  //                       description: "Notes for the instrument.",
  //                     },
  //                     tabs: {
  //                       type: "string",
  //                       description:
  //                         "Tablature for the instrument, if applicable.",
  //                     },
  //                     lyrics: {
  //                       type: "string",
  //                       description: "Lyrics for the vocals, if applicable.",
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       additionalProperties: false,
  //     },
  //   },
  // ];

  async function generateUI() {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    setModalWarningText("Generating song...");
    setModalWarning(true);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are creating a new song template project based off of the following prompt. Please extract as much of the following information from the given text as possible and return it as a JSON object: 
          Title, General Notes, Instruments, Sections, Key, BPM, Colour Theme, Guitar Tab, Bass Tab, Drum Pattern, Lyrics as a string`,
        },
        {
          role: "user",
          content: `${aiInput}`,
        },
      ],
      // functions: tools,
      // function_call: { name: "generate_song" },
    });

    if (response) {
      console.log(response);
      const jsonObject = JSON.parse(
        response.choices[0].message.content as string
      );

      console.log(jsonObject);

      const newSong = {
        title: jsonObject.Title,
        bpm: jsonObject.BPM,
        key: jsonObject.Key,
        id: uuidv4(),
      };

      const instruments = Object.values(jsonObject.Instruments);

      jsonObject.Sections.forEach((section) => {
        newSong[section] = {
          version: section,
          generalNotes: jsonObject["General Notes"] || "",
          theme: {
            activeColor: "text-black",
            bgColor: "bg-gray-100",
            borderColor: "border-gray-100",
            textColor: "text-black",
          },
        };

        instruments.forEach((instrument) => {
          newSong[section][instrument] = {
            instrument: instrument,
            label: instrument,
            notes: "",
          };

          if (instrument === "Guitar") {
            newSong[section][
              instrument
            ].tabs = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
`;
          }

          if (instrument === "Bass") {
            newSong[section][
              instrument
            ].tabs = `G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
`;
          }

          if (instrument === "Vocals") {
            newSong[section][instrument].lyrics = jsonObject.Lyrics || "";
          }
        });
      });

      console.log(instruments);
      console.log(newSong);

      setSongs((prevSongs) => {
        return [...(prevSongs ?? []), newSong] as Song[];
      });
    }
    setModalWarning(false);
  }

  useOnClickOutside(songModalRef, handleSongModalReset);
  return (
    <div
      ref={songModalRef}
      className={
        "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 w-2/5 flex flex-col justify-between border  rounded-xl z-10 py-6 px-6 " +
        (currentTheme === "Light"
          ? "bg-white text-black border-gray-300"
          : "bg-neutral-800 text-white border-neutral-600")
      }
    >
      {showSongAiOptions ? (
        <>
          <span className="text-xl">
            Describe your song (in as much detail as possible!)
          </span>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className={
              "max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg resize-none " +
              (currentTheme === "Light" ? "bg-white" : "bg-neutral-800")
            }
          ></textarea>
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
        </>
      ) : (
        <>
          <span className="text-xl">Enter new song name</span>
          <input
            autoFocus
            value={songModalInput}
            onChange={(e) => setSongModalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewSong()}
            type="text"
            className={
              "max-w-full font-normal mb-2 border border-gray-300 px-2 rounded-lg " +
              (currentTheme === "Light" ? "bg-white" : "bg-neutral-800")
            }
          ></input>
        </>
      )}

      <div className="flex gap-4 justify-between">
        <button
          onClick={() => setShowSongAiOptions((prevState) => !prevState)}
          className={
            "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:opacity-100 " +
            (currentTheme === "Light"
              ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200 "
              : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500 ") +
            (showSongAiOptions ? "opacity-100" : "opacity-40")
          }
        >
          <img
            src="./src/assets/SVG/magic-fill.svg"
            alt=""
            className={
              "w-5 m-0 p-0 grayscale  " +
              (currentTheme === "Light" ? "invert-0 " : "invert ")
            }
          />
        </button>

        <div className="flex gap-4">
          {modalWarning && (
            <span className="font-semibold text-md ml-2">
              {modalWarningText}
            </span>
          )}
          <button
            onClick={() => {
              showSongAiOptions ? generateUI() : addNewSong();
            }}
            className={
              "border-2 py-2 px-4 rounded-2xl cursor-pointer " +
              (currentTheme === "Light"
                ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
            }
          >
            {showSongAiOptions ? "Generate" : "OK"}
          </button>
          <button
            onClick={handleSongModalReset}
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
      </div>
    </div>
  );
}
