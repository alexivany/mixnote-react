import { useState } from "react";

import { OpenAI } from "openai";
import { wrapOpenAI } from "langsmith/wrappers";

// const openai = wrapOpenAI(new OpenAI());

const openai = new OpenAI();

export default function GenerativeUI() {
  const [aiInput, setAiInput] = useState<string>();

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
          content: ``,
        },
      ],
    });
  }

  return <input></input>;
}
