import fs from "fs";
import uglify from "./uglify.js";
import writeToFile from "../src/write-to-file.js"
import createDirectory from "../src/create-directory.js";
import getImportStatementsUrlFromFile from "../src/get-import-statements-url-from-file.js";


const uglifyAllFilesInUse = async (entryPoint) => {

  let uglyfiedContentMap = {};

  const uglifyContentRecursive = async (path) => {
    console.log(`------- ${path} -------`)
    const uglifiedContent = await uglify(path);
    uglyfiedContentMap[path] = uglifiedContent.code;
    const importUrls = await getImportStatementsUrlFromFile(uglifiedContent.code, ["js"]);
    for (let i = 0; i < importUrls.length; i++) {
      const url = importUrls[i];
      if (!uglyfiedContentMap[url]) {
        const useSrc = url.includes("./src/");
        const absoluteUrl = useSrc ? url : `./src/${url}`;
        await uglifyContentRecursive(absoluteUrl);
      }
    }
  }

  await uglifyContentRecursive(entryPoint);

  return uglyfiedContentMap;
}


const init = async () => {
  const result = await uglifyAllFilesInUse("./index.js");
  console.log({ result });

  await createDirectory("./bin/src");

  Object.entries(result).forEach(([key, value]) => {
    console.log(key);
    writeToFile(value, `./bin/${key}`);
  });
}

init();
