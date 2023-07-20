import "dotenv/config";
import * as fs from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

// Read the .json file
const queryData = fs.readFileSync("scripts/V8.json", "utf8");
const parsedData: {
  scenes: {
    time: string;
    title: string;
    setting: string;
    blocks: { type: string; content: string }[];
  }[];
} = JSON.parse(queryData);

const scenesArray = parsedData.scenes;

async function run() {
  // OPENING THE OLD SCRIPT
  const script = fs.readFileSync(`scripts/V1.json`, {
    encoding: "utf-8",
  });

  // PARSING THE OLD SCRIPT
  const json: {
    scenes: {
      time: string;
      title: string;
      setting: string;
      blocks: { type: string; content: string }[];
    }[];
  } = JSON.parse(script);

  // DOING VECTOR STORAGE
  const vectorStore = await HNSWLib.fromTexts(
    json.scenes.map((scene: any) => JSON.stringify(scene)), // Stringify each scene object
    [],
    new OpenAIEmbeddings()
  );

  // Iterate through each query object and process them
  scenesArray.forEach(async (scene) => {
    // Access properties of each scene here
    console.log("Time:", scene.time);
    console.log("Title:", scene.title);
    console.log("Setting:", scene.setting);

    // Access the "blocks" array and iterate through each block
    const blocksArray = scene.blocks;
    blocksArray.forEach(async (block) => {
      // Access properties of each block here
      // console.log("Type:", block.type);
      // console.log("Content:", block.content);
      const queryString = JSON.stringify(block.content);

      // GETTING RESULTS FROM VECTOR STORAGE
      const results = await vectorStore.similaritySearchWithScore(
        JSON.stringify(queryString),
        2
        // {sceneId: True}
      );

      // Output the results
      console.log(`\nResults for Block:\n"${block.content}"`);
      if (results.length === 0) {
        console.log("(threshold fail) No similar text found.\n");
      } else {
        results.forEach(([doc, score]) => {
          const text = JSON.parse(doc);
          console.log(`(${score}) "${block.content}" => [${score}] "${text}"`);
        });
        console.log();
      }
    });
  });
}

run();

//   scenes.forEach((block) => {
//     // Convert query object to string
//     const queryString = JSON.stringify(rest);

//     // OLD SCRIPT
//     async function run() {
//       const script = fs.readFileSync(`scripts/V1.json`, {
//         encoding: "utf-8",
//       });
//       const json = JSON.parse(script);

//       // DOING VECTOR STORAGE
//       const vectorStore = await HNSWLib.fromTexts(
//         json.map((block: any) => JSON.stringify(block)),
//         [],
//         new OpenAIEmbeddings()
//       );

//       // GETTING RESULTS FROM VECTOR STORAGE
//       const results = await vectorStore.similaritySearchWithScore(
//         JSON.stringify(queryString),
//         2
//         // {sceneId: True}
//       );

//       console.log("INPUT");
//       console.log(queryString);
//       console.log("");
//       console.log("RESULTS");
//       results.forEach(([doc, score]) => {
//         console.log({ score, ...JSON.parse(doc.pageContent) });
//         console.log("");
//       });
//     }
//     run();
//   });
// });
