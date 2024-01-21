import { getFilesFromDirectory } from "./get-files-from-directory.js";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js"
import { readContentFromFile } from "./read-content-from-file.js";

const getSourceCodeDirectory = (path) => {
  const sourceCodePath = path.split("/");
  if (sourceCodePath.length <= 2) {
    return path;
  }
  sourceCodePath.pop();
  return sourceCodePath.join("/");
}

const getFileNameFromPath = (path) => {
  const parts = path.split("/");
  if (!parts || parts.length === 0) throw `Error: path: ${path} is not a directory`;
  return parts[parts.length - 1];
}


const getFileExtention = (sourceCodeDirectory, filePath) => {
  if (!sourceCodeDirectory) return filePath;
  console.log({ sourceCodeDirectory, filePath })
  const filesInsideDirectoy = getFilesFromDirectory(sourceCodeDirectory, ["jsx", "tsx", "js", "ts"]);
  if (filesInsideDirectoy.length === 0) throw "Error: No file in the current directory"
  const fileName = getFileNameFromPath(filePath);
  const fileExtention = filesInsideDirectoy.find((dir) => { return dir.includes(`${fileName}.`) });
  if (!fileExtention) throw `Error: could not find a file that matches ${filePath}`
  return fileExtention.split(".").reverse()[0];
}

const pathIncludeFileExtention = (path, extention) => {
  return extention.some(ext => path.includes(`.${ext}`));
}

const transformPathToAbsolute = (path) => {
  const currentPath = path.replace(/\b\.\//g, '/');
  const pattern = /\.\.\//g;
  const matches = currentPath.match(pattern);
  const numberOfOccurrences = matches ? matches.length : 0;

  let parts = currentPath.split("/");
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (part === "..") {
      parts.splice(index, 1);
      parts.splice(index - 1, 1);
      index -= 2;
    }
  }
  const joinedParts = parts.join("/").replace(/\b\.\//g, '/');
  return joinedParts;
}

export default async (entryPoint, fileExtensions) => {
  let urls = [];

  const getImportStatementRecusive = async (path, sourceCodeDirectory) => {
    console.log(`------- ${path} -------`);
    const filePath = transformPathToAbsolute(`${sourceCodeDirectory || ''}${path}`);

    const includeExtension = pathIncludeFileExtention(filePath, fileExtensions);
    const sourceCodeDir = getSourceCodeDirectory(filePath);

    let fileWithExtention = "";
    if (includeExtension) {
      fileWithExtention = filePath;
    } else {
      try {
        const fileExtention = getFileExtention(sourceCodeDir, filePath);
        fileWithExtention = `${filePath}.${fileExtention}`;
      } catch (e) {
        console.warn(`skipping node package import`, sourceCodeDir, filePath);
        // return earlier as it's a node package imported
        return;
      }
    }

    urls.push(fileWithExtention);

    const importUrls = await getImportStatementsUrlFromFile(fileWithExtention);

    for (let i = 0; i < importUrls.length; i++) {
      const url = importUrls[i];
      await getImportStatementRecusive(url, sourceCodeDir + "/");
    }
  }
  await getImportStatementRecusive(entryPoint);
  return urls;
}
