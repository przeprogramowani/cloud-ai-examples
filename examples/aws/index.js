import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import {fileURLToPath} from "url";
import {dirname, join} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {writeFile} from "fs/promises";

import {KNOWLEDGE_BASE_ID, MODEL_ARN} from "./config.js";

const client = new BedrockAgentRuntimeClient({region: "eu-central-1"});

const retrieveAndGen = await new RetrieveAndGenerateCommand({
  input: {
    text: "Czy Przeprogramowani korzystają z narzędzia Make? W jakim celu?",
  },
  retrieveAndGenerateConfiguration: {
    type: "KNOWLEDGE_BASE",
    knowledgeBaseConfiguration: {
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      modelArn: MODEL_ARN,
    },
  },
});

const {citations, output} = await client.send(retrieveAndGen);
await writeFile(
  join(__dirname, "output.json"),
  JSON.stringify({citations, output}, null, 2)
);
