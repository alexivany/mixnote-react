import { useState } from "react";

import { OpenAI } from "openai";
// import { wrapOpenAI } from "langsmith/wrappers";
import { useThemeContext } from "@/contexts/theme-context";
import { useApiContext } from "@/contexts/api-context";

// const openai = wrapOpenAI(new OpenAI());

export default function GenerativeUI() {
  const { currentTheme } = useThemeContext();
  const { apiKey } = useApiContext();

  const [aiInput, setAiInput] = useState<string>("");

  const [aiResponse, setAiResponse] = useState<string | null>();

  const [modalWarning, setModalWarning] = useState<boolean>(false);

  // async function generateResponse() {
  //   try {
  //     const response = await openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ content: "Hi there!", role: "user" }],
  //     });
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error creating completion:", error);
  //   }
  // }
  // generateResponse();

  async function generateUI() {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    setModalWarning(true);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 1,
      messages: [
        {
          role: "system",
          content: `You are creating a new song template project based off of the following prompt.`,
        },
        {
          role: "user",
          content: `${aiInput}`,
        },
      ],
    });

    if (response) {
      setAiResponse(response.choices[0].message.content);
    }

    setModalWarning(false);
  }

  return (
    <div>
      <input
        value={aiInput}
        onChange={(e) => setAiInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && generateUI()}
        type="text"
        className={
          "max-w-full font-normal mb-2 border px-2 rounded-lg " +
          (currentTheme === "Light"
            ? "bg-white border-gray-300"
            : "bg-neutral-800 border-neutral-600")
        }
      ></input>
      <div
        className={
          "max-w-full font-normal mb-2 border px-2 rounded-lg " +
          (currentTheme === "Light"
            ? "bg-white border-gray-300"
            : "bg-neutral-800 border-neutral-600")
        }
      >
        Response:
        {modalWarning && (
          <span className="font-semibold text-md ml-2">
            "Generating lyrics..."
          </span>
        )}
        {aiResponse}
      </div>
    </div>
  );
}
