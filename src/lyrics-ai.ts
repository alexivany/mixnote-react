// import { traceable } from "langsmith/traceable";
// import { wrapOpenAI } from "langsmith/wrappers";
// import OpenAI from "openai";

// import { LyricModalInput } from "./types";

// export default async function lyricsAi(lyricModalInput) {
//   const openai = wrapOpenAI(
//     new OpenAI({
//       apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//       dangerouslyAllowBrowser: true,
//     })
//   );

//   const formatPrompt = traceable(
//     (lyricModalInput: LyricModalInput) => {
//       return [
//         {
//           role: "system" as const,
//           content: `You are an award-winning songwriter helping me write my next big hit. You will be provided with the specific section of the song you will write. You will also be provided with the exact amount of lines to generate, as well the topic that the song is about, and the general mood and feeling of the song. You should write lyrics poetically, determined by a number between 0 and 10, with 10 being the most poetic and 0 being the least poetic. Your current poetic level is ${lyricModalInput.poetic}. You will only respond with lyrics.`,
//         },
//         {
//           role: "user" as const,
//           content: `Write me a ${lyricModalInput.section} section of a song, that is ${lyricModalInput.lines} lines long and about ${lyricModalInput.about}, with the general feeling of ${lyricModalInput.mood}`,
//         },
//       ];
//     },
//     { name: "formatPrompt" }
//   );

//   const invokeLLM = traceable(
//     async ({ messages }: { messages: { role: string; content: string }[] }) => {
//       return openai.chat.completions.create({
//         model: "gpt-4",
//         messages: messages,
//         temperature: 1,
//         max_tokens: 256,
//       });
//     },
//     { run_type: "llm" }
//   );

//   const parseOutput = traceable(
//     (response: any) => {
//       return response.choices[0].message.content;
//     },
//     { name: "parseOutput " }
//   );

//   const runPipeline = traceable(
//     async () => {
//       const messages = await formatPrompt(lyricModalInput);
//       const response = await invokeLLM({ messages });
//       return parseOutput(response);
//     },
//     { name: "runPipeline" }
//   );

//   const response = await openai.chat.completions.create({
//     model: "gpt-4",
//     temperature: 1,
//     max_tokens: 256,
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

//   await runPipeline();
// }
