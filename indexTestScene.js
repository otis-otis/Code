"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var fs = require("fs");
var openai_1 = require("langchain/embeddings/openai");
var hnswlib_1 = require("langchain/vectorstores/hnswlib");
// const QUERY = {
//   type: "Dialogue",
//   content: 'Amazing. You seem to really <span class="italic">get</span> dogs.',
// };
// Read the .json file
var queryData = fs.readFileSync("scripts/V8.json", "utf8");
// const queryObjects = JSON.parse(queryData);
// const queryObjects: { scene: { name: string; description: string }[] } =
//   JSON.parse(queryData);
var parsedData = JSON.parse(queryData);
var scenesArray = parsedData.scenes;
// const scenes = queryObjects.scenes;
// const blocks = scenes.blocks;
// Scenes.forEach (scenes)
// Scenes.forEach (scenes.blocks)
// Do an output file that (score) "Old Text" => "New Text" (score) ...
// Cap scores at .000
// Iterate through each query object and process them
scenesArray.forEach(function (scene) {
    // Access properties of each scene here
    console.log("Time:", scene.time);
    console.log("Title:", scene.title);
    console.log("Setting:", scene.setting);
    // Access the "blocks" array and iterate through each block
    var blocksArray = scene.blocks;
    blocksArray.forEach(function (block) {
        // Access properties of each block here
        // console.log("Type:", block.type);
        // console.log("Content:", block.content);
        var queryString = JSON.stringify(block.content);
        // OPENING THE OLD SCRIPT
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var script, json, vectorStore, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            script = fs.readFileSync("scripts/V1.json", {
                                encoding: "utf-8",
                            });
                            json = JSON.parse(script);
                            return [4 /*yield*/, hnswlib_1.HNSWLib.fromTexts(json.scenes.map(function (scene) { return JSON.stringify(scene); }), // Stringify each scene object
                                [], new openai_1.OpenAIEmbeddings())];
                        case 1:
                            vectorStore = _a.sent();
                            return [4 /*yield*/, vectorStore.similaritySearchWithScore(JSON.stringify(queryString), 1
                                // {sceneId: True}
                                )];
                        case 2:
                            results = _a.sent();
                            console.log("INPUT");
                            console.log(queryString);
                            console.log("");
                            console.log("RESULTS");
                            results.forEach(function (_a) {
                                var doc = _a[0], score = _a[1];
                                console.log(__assign({ score: score }, JSON.parse(doc.pageContent)));
                                console.log("");
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
        run();
    });
});
