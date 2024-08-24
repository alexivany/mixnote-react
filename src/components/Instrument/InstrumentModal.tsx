import { useApiContext } from "@/contexts/api-context";
import { useCurrentVersionContext } from "@/contexts/currentversion-context";
import { useThemeContext } from "@/contexts/theme-context";
import { Version } from "@/types";
import { motion } from "framer-motion";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { useState } from "react";
import { z } from "zod";

interface InstrumentModalProps {
  handleInstrumentModal(): void;
}

export default function InstrumentModal({
  handleInstrumentModal,
}: InstrumentModalProps) {
  const { currentTheme } = useThemeContext();

  const { apiKey, setApiKey } = useApiContext();

  const { setCurrentVersion } = useCurrentVersionContext();

  const [aiInput, setAiInput] = useState<string>();

  const [modalWarning, setModalWarning] = useState<boolean>(false);
  const [modalWarningText, setModalWarningText] = useState<string>();
  const [modalLoader, setModalLoader] = useState<boolean>(false);

  const instrumentOutputSchema = z.object({
    instrument: z.string().optional(),
    label: z.string().optional(),
    notes: z.string().optional(),
    tabs: z.string().optional(),
    lyrics: z.string().optional(),
  });

  async function generateUI() {
    if (!apiKey || apiKey.match(/^\s*$/)) {
      setModalWarningText("Please enter an API Key!");
      setModalLoader(false);
      setModalWarning(true);
      return;
    }

    if (!aiInput || aiInput.match(/^\s*$/)) {
      setModalWarningText("Please enter a description!");
      setModalLoader(false);
      setModalWarning(true);
      return;
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    setModalWarningText("Generating instrument...");
    setModalLoader(true);
    setModalWarning(true);

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are creating a new instrument object based off of the following prompt. Please extract as much of the following information from the given text as possible and return it as a JSON object: 
          Instrument as a string, Notes as a string, Label as a string, if the Instrument is guitar: Instrument Guitar Tab as a guitar tab formatted multi-line string with each line being 165 characters long that starts with "e|" and ends with "|" (empty spaces should be filled with a hyphen), if the Instrument is bass: Instrument Bass Tab as a bass tab formatted multi-line string with each line being 165 characters long that starts with "G|" and ends with "|" (empty spaces should be filled with a hyphen), if the Instrument is vocals:  Lyrics as a string`,
        },
        {
          role: "user",
          content: "guitar",
        },
        {
          role: "assistant",
          content: `{
    instrument: "Guitar",
    label: "Guitar",
    notes: "This is a sample note for the guitar tab.",
  tabs: "e|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nB|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nG|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nD|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nA|-----------------------------------------------------------------------------------------------------------------------------------------------------|\nE|-----------------------------------------------------------------------------------------------------------------------------------------------------|",
}`,
        },
        {
          role: "user",
          content: `dreamy lyrics that go "oh yeah, oh yeah"`,
        },
        {
          role: "assistant",
          content: `{
    instrument: "Vocals",
    label: "Vocals",
    notes: "Soft, dreamy vocals.",
          lyrics: "oh yeah, oh yeah"
}`,
        },
        {
          role: "user",
          content: `${aiInput}`,
        },
      ],
      response_format: zodResponseFormat(
        instrumentOutputSchema,
        "instrumentOutputSchema"
      ),
    });

    if (response) {
      const message = response.choices[0]?.message;
      const jsonObject = message?.parsed;

      if (jsonObject) {
        setCurrentVersion((prevVersionData) => {
          return {
            ...prevVersionData,
            [jsonObject.instrument as string]: jsonObject,
          } as Version;
        });
      }
    }
    setModalWarning(false);
    handleInstrumentModal();
  }
  return (
    <>
      <motion.div
        onClick={handleInstrumentModal}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        key="instrument-modal-backdrop"
        className="fixed top-0 left-0 z-10 h-full w-full bg-neutral-900"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -400 }}
        className={
          "fixed top-1/4 left-0 gap-4 font-semibold m-auto right-0 lg:w-2/5 w-4/5 flex flex-col justify-between border  rounded-xl z-10 py-6 px-6 " +
          (currentTheme === "Light"
            ? "bg-white text-black border-gray-300"
            : "bg-neutral-800 text-white border-neutral-600")
        }
      >
        <>
          <span className="text-lg">
            Describe the instrument you want to add (in as much detail as
            possible!)
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
          <div className="flex gap-2 md:gap-4 justify-end">
            {modalWarning && (
              <div className="flex gap-2 justify-between items-center">
                <span className="font-semibold text-md ml-2">
                  {modalWarningText}
                </span>
                {modalLoader && (
                  <img
                    src="/SVG/loader-4-line.svg"
                    alt=""
                    className={
                      "animate-spin w-6 m-0 p-0 " +
                      (currentTheme === "Dark" && "grayscale invert")
                    }
                  />
                )}
              </div>
            )}
            <button
              onClick={generateUI}
              className={
                "border-2 py-2 px-3 text-xs md:text-lg md:py-2 md:px-4  rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Generate
            </button>
            <button
              onClick={handleInstrumentModal}
              className={
                "border-2 py-2 px-3 text-xs md:text-lg md:py-2 lg:px-4 rounded-2xl cursor-pointer hover:scale-110 transition-transform " +
                (currentTheme === "Light"
                  ? "bg-gray-100 border-gray-100 hover:bg-gray-200 hover:bg-gray-200"
                  : "bg-neutral-700 border-neutral-700 hover:bg-neutral-500 hover:border-neutral-500")
              }
            >
              Cancel
            </button>
          </div>
        </>
      </motion.div>
    </>
  );
}
