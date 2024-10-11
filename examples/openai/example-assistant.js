import OpenAI from "openai";
import readlinePromises from "readline/promises";
import openAIKey from "./openai-key.json" assert {type: "json"};

const openai = new OpenAI({
  apiKey: openAIKey.apiKey,
});

const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const assistantId = "asst_QL57AhNDg8jsxrFlqt8tbCnQ";

async function main() {
  const thread = await openai.beta.threads.create();

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.toLowerCase() === "exit") break;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userInput,
    });

    const stream = await openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistantId,
    });

    for await (const event of stream) {
      if (event.event === "thread.message.delta") {
        if (
          event.data.delta.content &&
          event.data.delta.content[0].type === "text"
        ) {
          process.stdout.write(event.data.delta.content[0].text.value);
        }
      }
    }
    console.log("\n");
  }

  rl.close();
}

main().catch(console.error);
