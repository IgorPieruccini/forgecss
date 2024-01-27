import path from "path";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js";

const getImportStatement = async (importStatementPath, scannedPaths, urls, notFound) => {
  // console.log(`analyzing: ---${importStatementPath}---`);
  scannedPaths.push(importStatementPath);

  const { importUrls, notFoundUrls } = await getImportStatementsUrlFromFile(importStatementPath);

  const foundUrl = importUrls.filter(url => !scannedPaths.includes(url));

  urls.push(...foundUrl);

  const notFoundUniqueUrls = notFoundUrls.filter(url => !notFound.includes(url));
  notFound.push(...notFoundUniqueUrls);

  for (let i = 0; i < foundUrl.length; i++) {
    const url = foundUrl[i];
    await getImportStatement(url, scannedPaths, urls, notFound)
  }

  return [urls, notFound];
}

export default async (entryPoint, fileExtensions) => {
  const fileName = entryPoint.split("/").pop();
  const absolutePath = path.isAbsolute(entryPoint) ? entryPoint : path.resolve(path.dirname(entryPoint), fileName)
  const [foundUrls, notFoundUrls] = await getImportStatement(absolutePath, [], [], []);
  return { foundUrls, notFoundUrls };
}
