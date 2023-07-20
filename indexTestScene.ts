import "dotenv/config";
import * as fs from "fs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

// const QUERY = {
//   type: "Dialogue",
//   content: 'Amazing. You seem to really <span class="italic">get</span> dogs.',
// };

// Read the .json file
const queryData = fs.readFileSync("scripts/V8.json", "utf8");
// const queryObjects = JSON.parse(queryData);
// const queryObjects: { scene: { name: string; description: string }[] } =
//   JSON.parse(queryData);

const parsedData: {
  scenes: {
    time: string;
    title: string;
    setting: string;
    blocks: { type: string; content: string }[];
  }[];
} = JSON.parse(queryData);

const scenesArray = parsedData.scenes;

// const scenes = queryObjects.scenes;
// const blocks = scenes.blocks;

// Scenes.forEach (scenes)
// Scenes.forEach (scenes.blocks)
// Do an output file that (score) "Old Text" => "New Text" (score) ...
// Cap scores at .000

// Iterate through each query object and process them

scenesArray.forEach((scene) => {
  // Access properties of each scene here
  console.log("Time:", scene.time);
  console.log("Title:", scene.title);
  console.log("Setting:", scene.setting);

  // Access the "blocks" array and iterate through each block
  const blocksArray = scene.blocks;
  blocksArray.forEach((block) => {
    // Access properties of each block here
    // console.log("Type:", block.type);
    // console.log("Content:", block.content);
    const queryString = JSON.stringify(block.content);

    // OPENING THE OLD SCRIPT
    async function run() {
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

      // GETTING RESULTS FROM VECTOR STORAGE
      const results = await vectorStore.similaritySearchWithScore(
        JSON.stringify(queryString),
        2
        // {sceneId: True}
      );
  };
});

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
