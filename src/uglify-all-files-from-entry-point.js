import uglify from "./uglify.js";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js";

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

