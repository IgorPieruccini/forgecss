import path from "path";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js"

const getImportStatement = async (importStatementPath, scannedPaths) => {
  console.log(`analyzing: ---${importStatementPath}---`);
  scannedPaths.push(importStatementPath);

  const importUrls = await getImportStatementsUrlFromFile(importStatementPath);
  const urls = importUrls.filter(url => !scannedPaths.includes(url));
  console.log({ urls });

  for (let i = 0; i < urls.length; i++) {
    const url = importUrls[i];
    await getImportStatement(url, scannedPaths)
  }
}

export default async (entryPoint, fileExtensions) => {
  let urls = [];
  const fileName = entryPoint.split("/").pop();
  const absolutePath = path.isAbsolute(entryPoint) ? entryPoint : path.resolve(path.dirname(entryPoint), fileName)
  await getImportStatement(absolutePath, []);

  return urls;
}
