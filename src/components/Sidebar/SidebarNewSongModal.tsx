import { Dispatch, SetStateAction, useRef, useState } from "react";

import { useApiContext } from "@/contexts/api-context";
import { useThemeContext } from "@/contexts/theme-context";

import { Song } from "@/types";

import { useOnClickOutside } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import { z } from "zod";
import { useCurrentSongContext } from "@/contexts/currentsong-context";

interface SidebarNewSongModalProps {
  handleSongModal(): void;
  setSongs: Dispatch<SetStateAction<Song[] | undefined>>;
}

export default function SidebarNewSongModal({
  handleSongModal,
  setSongs,
}: SidebarNewSongModalProps) {
  const { currentTheme } = useThemeContext();

  const { setCurrentSong } = useCurrentSongContext();

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
            versionId: uuidv4(),
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
  //             required: [""],
  //           },
  //         },
  //       },
  //       additionalProperties: false,
  //     },
  //   },
  // ];

  const uiOutputSchema = z.object({
    title: z.string().optional(),
    bpm: z.number().optional(),
    key: z.string().optional(),
    sections: z
      .array(
        z.object({
          section: z.string(),
          generalNotes: z.string().optional(),
          theme: z
            .object({
              activeColor: z.string().optional(),
              bgColor: z.string().optional(),
              borderColor: z.string().optional(),
              textColor: z.string().optional(),
            })
            .optional(),
          instruments: z
            .array(
              z.object({
                instrument: z.string().optional(),
                label: z.string().optional(),
                notes: z.string().optional(),
                tabs: z.string().optional(),
                lyrics: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .optional(),
  });

  async function generateUI() {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    setModalWarningText("Generating song...");
    setModalWarning(true);

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are creating a new song template project based off of the following prompt. Please extract as much of the following information from the given text as possible and return it as a JSON object: 
          Title as a string, General Notes as a string, Instruments as an array of strings, Sections as an array of strings, Key as a string, BPM as a number, Instrument Guitar Tab as a guitar tab formatted multi-line string with each line being 165 characters long that starts with "e|" and ends with "|" (empty spaces should be filled with a hyphen), Instrument Bass Tab as a bass tab formatted multi-line string with each line being 165 characters long that starts with "G|" and ends with "|" (empty spaces should be filled with a hyphen), Drum Pattern, Lyrics as a string`,
        },
        {
          role: "user",
          content: `${aiInput}`,
        },
      ],
      response_format: zodResponseFormat(uiOutputSchema, "uiOutputSchema"),
      // functions: tools,
      // function_call: { name: "generate_song" },
    });

    console.log(response);
    if (response) {
      console.log(response);

      const message = response.choices[0]?.message;
      const jsonObject = message?.parsed;
      // const jsonObject = JSON.parse(
      //   response.choices[0].message.content as string
      // );

      console.log(jsonObject);

      if (jsonObject) {
        const newSong = {
          title: jsonObject.title || "My First Song",
          bpm: jsonObject.bpm || 120,
          key: jsonObject.key || "C Maj",
          id: uuidv4(),
        };

        jsonObject.sections?.forEach((section) => {
          console.log(section);
        });

        jsonObject.sections?.forEach((section) => {
          newSong[section.section] = {
            version: section.section,
            generalNotes: section.generalNotes || "",
            theme: {
              activeColor: "text-black",
              bgColor: "bg-gray-100",
              borderColor: "border-gray-100",
              textColor: "text-black",
            },
            versionId: uuidv4(),
          };

          section.instruments?.forEach((instrument) => {
            newSong[section.section][instrument.instrument] = {
              instrument: instrument.instrument,
              label: instrument.instrument,
              notes: instrument.notes || "",
            };

            if (
              instrument.instrument?.match(/(electric|acoustic)?\s*guitar/i)
            ) {
              let guitarTab;
              if (instrument.tabs?.match(/^\s*$/)) {
                guitarTab = `e|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
B|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `;
              } else {
                guitarTab = instrument.tabs;
              }
              newSong[section.section][instrument.instrument].tabs = guitarTab;
            }

            if (instrument.instrument?.match(/bass\s*(guitar)?/i)) {
              let bassTab;
              if (instrument.tabs?.match(/^\s*$/)) {
                bassTab = `G|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
D|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
A|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
E|---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  `;
              } else {
                bassTab = instrument.tabs;
              }
              newSong[section.section][instrument.instrument].tabs = bassTab;
            }

            if (instrument.instrument?.match(/vocals?/i)) {
              newSong[section.section][instrument.instrument].lyrics =
                instrument.lyrics || "";
            }
          });
        });

        console.log(newSong);

        setSongs((prevSongs) => {
          return [...(prevSongs ?? []), newSong] as Song[];
        });
        setCurrentSong(newSong as Song);
      }
    }
    setModalWarning(false);
    handleSongModalReset();
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
            <div className="flex gap-2 justify-between items-center">
              <span className="font-semibold text-md ml-2">
                {modalWarningText}
              </span>
              <img
                src="./src/assets/SVG/loader-4-line.svg"
                alt=""
                className={
                  "animate-spin w-6 m-0 p-0 " +
                  (currentTheme === "Dark" && "grayscale invert")
                }
              />
            </div>
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
