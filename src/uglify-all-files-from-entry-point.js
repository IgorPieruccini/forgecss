import uglify from "./uglify.js";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js";

/**
  * Uglify all files dependent of the entry point file provided
  * for example: if you provide a index.js that imports other 2 files
  * if will identify the dependency and uglify these dependencies too recursively.
  *
  * @param {string} entryPoint - the path to a file
  * @returns {object} Object key = file path, and value = uglified code
  * @example
  // example of the returning object
  {
      "./src/index.js" : "the uglify code",
      "./src/read-content-from-file": "the uglify code",
  }
  *
  *
  */
export default async (entryPoint) => {
  let uglifiedContentMap = {};

  const uglifyContentRecursive = async (path) => {
    console.log(`------- ${path} -------`)
    const uglifiedContent = await uglify(path);
    uglifiedContentMap[path] = uglifiedContent.code;
    const importUrls = await getImportStatementsUrlFromFile(uglifiedContent.code, ["js"]);
    for (let i = 0; i < importUrls.length; i++) {
      const url = importUrls[i];
      if (!uglifiedContentMap[url]) {
        const useSrc = url.includes("./src/");
        const absoluteUrl = useSrc ? url : `./src/${url}`;
        await uglifyContentRecursive(absoluteUrl);
      }
    }
  }

  await uglifyContentRecursive(entryPoint);
  return uglifiedContentMap;
}

