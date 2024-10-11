import OpenAI from "openai";
import openAIKey from "./openai-key.json" assert {type: "json"};

import {fileURLToPath} from "url";
import {dirname, join} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new OpenAI({
  apiKey: openAIKey.apiKey,
});

async function requestWithTemperature(temperature) {
  console.log(`Generuję odpowiedź z temperature ${temperature}...`);
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: [
      {
        role: "user",
        content: "Podaj jednozdaniową definicję wzorca projektowego Singleton",
      },
    ],
    temperature,
  });
  return response.choices[0].message.content;
}

async function multipleRequestsWithTemperature() {
  const responses = [];

  // Request with temperature 0
  responses.push({temp: 0, message: await requestWithTemperature(0)});
  responses.push({temp: 0, message: await requestWithTemperature(0)});
  responses.push({temp: 0, message: await requestWithTemperature(0)});
  responses.push({temp: 0, message: await requestWithTemperature(0)});
  responses.push({temp: 0, message: await requestWithTemperature(0)});

  responses.push({temp: 1, message: await requestWithTemperature(1)});
  responses.push({temp: 1, message: await requestWithTemperature(1)});
  responses.push({temp: 1, message: await requestWithTemperature(1)});
  responses.push({temp: 1, message: await requestWithTemperature(1)});
  responses.push({temp: 1, message: await requestWithTemperature(1)});

  // Write responses to JSON file
  const fs = await import("fs/promises");
  await fs.writeFile(
    join(__dirname, "results/temp-overview.json"),
    JSON.stringify(responses, null, 2)
  );
}

multipleRequestsWithTemperature();
