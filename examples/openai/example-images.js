import OpenAI from "openai";
import openAIKey from "./openai-key.json" assert {type: "json"};
import fs from "fs";
import {fileURLToPath} from "url";
import {dirname, join} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new OpenAI({
  apiKey: openAIKey.apiKey,
});

async function generateImage(prompt) {
  try {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    const imageName = `generated_image_${Date.now()}.png`;
    const imagePath = join(__dirname, "results", imageName);

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(imagePath, buffer);

    console.log(`Wygenerowano i zapisano obraz jako ${imageName}`);
    return imagePath;
  } catch (error) {
    console.error("Błąd podczas generowania obrazu:", error);
    throw error;
  }
}

generateImage("A futuristic city skyline at sunset")
  .then((imagePath) => console.log("Obraz zapisany w:", imagePath))
  .catch((error) => console.error("Błąd podczas generowania obrazu:", error));
