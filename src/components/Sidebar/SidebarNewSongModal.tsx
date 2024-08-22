import { Dispatch, SetStateAction, useRef, useState } from "react";

import { useApiContext } from "@/contexts/api-context";
import { useThemeContext } from "@/contexts/theme-context";

import { Song, Version } from "@/types";

import { useOnClickOutside } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";

import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import { z } from "zod";

import { useCurrentSongContext } from "@/contexts/currentsong-context";
import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { motion } from "framer-motion";

interface SidebarNewSongModalProps {
  handleSongModal(): void;
  setSongs: Dispatch<SetStateAction<Song[] | undefined>>;
}

export default function SidebarNewSongModal({
  handleSongModal,
  setSongs,
}: SidebarNewSongModalProps) {
  const { currentTheme } = useThemeContext();

  const { setCurrentVersion } = useCurrentVersionContext();

  const { setCurrentSong } = useCurrentSongContext();

  const { apiKey, setApiKey } = useApiContext();

  const [showSongAiOptions, setShowSongAiOptions] = useState<boolean>(false);
  const [modalWarning, setModalWarning] = useState<boolean>(false);

  const [modalWarningText, setModalWarningText] = useState<string>();

  const [songModalInput, setSongModalInput] = useState<string>("");

  const [aiInput, setAiInput] = useState<string>("");

  const songModalRef = useRef(null);

  const recognitionRef = useRef<SpeechRecognition>();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // const [isSpeechDetected, setIsSpeechDetected] = useState<boolean>(false);
  const [isHoveredOnRecordingButton, setIsHoveredOnRecordingButton] =
    useState<boolean>(false);

  const sendAudioMessage = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onaudiostart = () => {};

    recognitionRef.current.onspeechstart = () => {
      // setIsSpeechDetected(true);
    };
    recognitionRef.current.onspeechend = () => {
      // setIsSpeechDetected(false);
    };
    recognitionRef.current.onstart = () => {
      setIsRecording(true);
    };
    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    let speechTimeout;
    (recognitionRef.current.onresult = (event) => {
      clearTimeout(speechTimeout);
      speechTimeout = setTimeout(async () => {
        const transcript = event.results[event.resultIndex][0].transcript;
        if (transcript) {
          await transcript;
          showSongAiOptions
            ? setAiInput(transcript)
            : setSongModalInput(transcript);
        }
      }, 800);
    }),
      recognitionRef.current.abort();
    recognitionRef.current.start();
  };

  console.log(showSongAiOptions);
  function addNewSong() {
    if (songModalInput.match(/^\s*$/)) {
      setModalWarningText("Song must have a name!");
      setModalWarning(true);
      setTimeout(() => {
        setModalWarning(false);
      }, 2000);
      return;
    }
    const newSong = {
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
    };
    setSongs((prevSongs) => {
      return [...(prevSongs ?? []), newSong] as Song[];
    });

    handleSongModal();
    console.log("SONG MODAL SET SONG");
  }

  function handleSongModalReset() {
    handleSongModal();
    setSongModalInput("");
    setShowSongAiOptions(false);
  }

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
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are creating a new song template project based off of the following prompt. Please extract as much of the following information from the given text as possible and return it as a JSON object: 
          Title as a string, General Notes as a string, Instruments as an array of strings, Sections as an array of strings, Key as a string, BPM as a number, Instrument Guitar Tab as a guitar tab formatted multi-line string with each line being 165 characters long that starts with "e|" and ends with "|" (empty spaces should be filled with a hyphen), Instrument Bass Tab as a bass tab formatted multi-line string with each line being 165 characters long that starts with "G|" and ends with "|" (empty spaces should be filled with a hyphen), Drum Pattern, Lyrics as a string`,
        },
        {
          role: "user",
          content: `I have a song named Loud Bark that is 120 bpm in A major with a 4/4 beat. I have a verse and a chorus with electric guitar, a distorted bass guitar, drums and vocals. The lyrics for the chorus are "oh yeah, oh yeah"`,
        },
        {
          role: "assistant",
          content: `{
            title: "Loud Bark",
            bpm: 120,
            key: "A major",
            sections: [
              {
                section: "Verse",
                generalNotes:
                  "The verse section features a driving rhythm with a focus on the electric guitar and bass.",
                theme: {
                  activeColor: "",
                  bgColor: "",
                  borderColor: "",
                  textColor: "",
                },
                instruments: [
                  {
                    instrument: "Electric Guitar",
                    label: "Electric Guitar",
                    notes:
                      "Play with a clean tone, focusing on rhythm and chord progression.",
                    tabs: "e|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nB|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nG|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nD|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nA|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nE|-----------------------------------------------------------------------------------------------------------------------------------------------------|",
                  },
                  {
                    instrument: "Distorted Bass Guitar",
                    label: "Distorted Bass Guitar",
                    notes:
                      "Add a gritty, distorted tone to complement the electric guitar.",
                    tabs: "G|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nD|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nA|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nE|-----------------------------------------------------------------------------------------------------------------------------------------------------|",
                  },
                  {
                    instrument: "Drums",
                    label: "Drums",
                    notes:
                      "Keep a steady 4/4 beat with a focus on snare and bass drum.",
                  },
                  {
                    instrument: "Vocals",
                    label: "Vocals",
                    notes: "Focus on delivering the verse lyrics with energy.",
                    lyrics: "",
                  },
                ],
              },
              {
                section: "Chorus",
                generalNotes:
                  "The chorus is energetic with a catchy hook and emphasizes the lyrics.",
                theme: {
                  activeColor: "",
                  bgColor: "",
                  borderColor: "",
                  textColor: "",
                },
                instruments: [
                  {
                    instrument: "Electric Guitar",
                    label: "Electric Guitar",
                    notes:
                      "Switch to a more powerful, overdriven sound for the chorus.",
                    tabs: "e|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nB|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nG|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nD|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nA|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nE|-----------------------------------------------------------------------------------------------------------------------------------------------------|",
                  },
                  {
                    instrument: "Distorted Bass Guitar",
                    label: "Distorted Bass Guitar",
                    notes:
                      "Continue with a heavy, distorted bass line to drive the chorus.",
                    tabs: "G|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nD|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nA|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nE|-----------------------------------------------------------------------------------------------------------------------------------------------------|",
                  },
                  {
                    instrument: "Drums",
                    label: "Drums",
                    notes:
                      "Increase intensity with cymbal crashes and a strong backbeat.",
                  },
                  {
                    instrument: "Vocals",
                    label: "Vocals",
                    notes:
                      "Deliver the chorus with enthusiasm and emphasis on the repeated phrase.",
                    lyrics: "oh yeah, oh yeah",
                  },
                ],
              },
            ],
          }`,
        },
        {
          role: "user",
          content: "song is called Test Song",
        },
        {
          role: "assistant",
          content: `{
            title: "Test Song",
            bpm: 120,
            key: "C Major",
            sections: [
              {
                section: "Verse",
                generalNotes: "",
                theme: {
                  activeColor: "",
                  bgColor: "",
                  borderColor: "",
                  textColor: "",
                },
              },
              {
                section: "Chorus",
                generalNotes: "",
                theme: {
                  activeColor: "",
                  bgColor: "",
                  borderColor: "",
                  textColor: "",
                },
              },
            ],
          }`,
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
    console.log(response.choices[0]?.message);
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

        const newVersion = Object.values(newSong).find(
          (value) => typeof value === "object" && Array.isArray(value) === false
        ) as Version | undefined;

        setSongs((prevSongs) => {
          return [...(prevSongs ?? []), newSong] as Song[];
        });
        setCurrentSong(newSong as Song);
        setCurrentVersion(newVersion as Version);
      }
    }
    setModalWarning(false);
    handleSongModalReset();
  }

  useOnClickOutside(songModalRef, handleSongModalReset);
  return (
    <>
      <motion.div
        onClick={handleSongModalReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        key="new-song-backdrop"
        className="fixed top-0 left-0 z-10 h-full w-full bg-neutral-900"
      ></motion.div>
      <motion.div
        // ref={songModalRef}
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -400 }}
        className={
          "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 lg:w-2/5 w-4/5 flex flex-col justify-between border  rounded-xl z-10 py-6 px-6 " +
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
                "max-w-full h-24 font-normal mb-2 border border-gray-300 px-2 rounded-lg resize-none " +
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
              "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:opacity-100  hover:scale-110 transition-transform " +
              (currentTheme === "Light"
                ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200 "
                : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500 ") +
              (showSongAiOptions ? "opacity-100" : "opacity-40")
            }
          >
            <img
              src="/SVG/magic-fill.svg"
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
                  src="/SVG/loader-4-line.svg"
                  alt=""
                  className={
                    "animate-spin w-6 m-0 p-0 " +
                    (currentTheme === "Dark" && "grayscale invert")
                  }
                />
              </div>
            )}
            <button
              onClick={sendAudioMessage}
              onMouseOver={() =>
                isRecording && setIsHoveredOnRecordingButton(true)
              }
              onMouseLeave={() =>
                isRecording && setIsHoveredOnRecordingButton(false)
              }
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:opacity-100 group hover:scale-110 transition-transform " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200 "
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500 ")
              }
            >
              {isRecording ? (
                <>
                  {isHoveredOnRecordingButton ? (
                    <img
                      src="/SVG/stop-fill.svg"
                      alt=""
                      className={"w-5 m-0 p-0 animate-pulse "}
                    />
                  ) : (
                    <img
                      src="/SVG/microphone-red.svg"
                      alt=""
                      className={
                        "w-5 m-0 p-0 animate-pulse scale-125 transition-transform "
                      }
                    />
                  )}
                </>
              ) : (
                <img
                  src="/SVG/microphone.svg"
                  alt=""
                  className={
                    "w-5 m-0 p-0 grayscale opacity-40 group-hover:opacity-100 " +
                    (currentTheme === "Light" ? "invert-0 " : "invert ")
                  }
                />
              )}
            </button>
            <button
              onClick={() => {
                showSongAiOptions ? generateUI() : addNewSong();
              }}
              className={
                "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
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
                "border-2 py-2 px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
