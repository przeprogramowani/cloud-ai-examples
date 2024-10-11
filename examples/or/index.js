import {OPENROUTER_API_KEY} from "./config.js";

async function analyzeImage() {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-flash-1.5-8b",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Co widzisz na tym obrazku?",
              },
              {
                type: "image_url",
                image_url: {
                  url: "https://opanuj.ai/_astro/gemini-nano.9148882f.png",
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

analyzeImage();
