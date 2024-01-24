import path from "path";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js";

const getImportStatement = async (importStatementPath, scannedPaths, urls) => {
  console.log(`analyzing: ---${importStatementPath}---`);
  scannedPaths.push(importStatementPath);

  const importUrls = await getImportStatementsUrlFromFile(importStatementPath);
  const foundUrl = importUrls.filter(url => !scannedPaths.includes(url));
  urls.push(...foundUrl);
  console.log({ urls });

  for (let i = 0; i < foundUrl.length; i++) {
    const url = importUrls[i];
    await getImportStatement(url, scannedPaths, urls)
  }
}

export default async (entryPoint, fileExtensions) => {
  let urls = [];
  const fileName = entryPoint.split("/").pop();
  const absolutePath = path.isAbsolute(entryPoint) ? entryPoint : path.resolve(path.dirname(entryPoint), fileName)
  const foundUrls = await getImportStatement(absolutePath, [], []);
  console.log({ foundUrls });
  return urls;
}
