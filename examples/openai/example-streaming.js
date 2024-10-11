import OpenAI from "openai";
import openAIKey from "./openai-key.json" assert {type: "json"};
import {SYSTEM_MESSAGES} from "./system-messages.js";

const client = new OpenAI({
  apiKey: openAIKey.apiKey,
});

const messages = [
  {
    role: "system",
    content: SYSTEM_MESSAGES.EXPERT,
  },
  {
    role: "user",
    content: "Wytłumacz mi, jak działa rekurencja w programowaniu",
  },
  // {
  //   role: "assistant",
  //   content: "Czy chcesz poznać teorię czy uczyć się na przykładzie?",
  // },
  // {
  //   role: "user",
  //   content: "Uczę się na przykładach",
  // },
];

async function requestAnswer(isStreamingEnabled) {
  return await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: isStreamingEnabled,
    messages,
  });
}

async function nonStreamingAnswer() {
  const response = await requestAnswer(false);
  const message = response.choices[0].message.content;
  console.log(message);
}

async function streamAnswer() {
  const stream = await requestAnswer(true);
  console.clear();
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}
// nonStreamingAnswer();
streamAnswer();
