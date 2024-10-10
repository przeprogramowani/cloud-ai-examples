import {VertexAI} from "@google-cloud/vertexai";

import {fileURLToPath} from "url";
import {dirname, resolve} from "path";

import {PROJECT, LOCATION, TEXT_MODEL} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vertexAI = new VertexAI({
  project: PROJECT,
  location: LOCATION,
  googleAuthOptions: {keyFilename: resolve(__dirname, "gcp-key.json")},
});

const generativeModel = vertexAI.getGenerativeModel({
  model: TEXT_MODEL,
  generationConfig: {maxOutputTokens: 512},
  systemInstruction: {
    role: "system",
    parts: [{text: `Jesteś asystentem programisty korzystającego z AI.`}],
  },
});

async function streamGenerateContent() {
  const request = {
    contents: [
      {
        role: "user",
        parts: [{text: "Opowiedz mi o projekcie Przeprogramowani.pl"}],
      },
    ],
  };
  try {
    const streamingResult = await generativeModel.generateContentStream(
      request
    );
    await processResponseStream(streamingResult);
  } catch (e) {
    console.error("Error: ", e);
  }
}

async function processResponseStream(streamingResult) {
  let modelResponse = "";
  for await (const item of streamingResult.stream) {
    const textContent = item.candidates[0].content.parts[0].text;
    modelResponse += textContent;
    console.clear();
    console.log(modelResponse);
  }
}

streamGenerateContent();
