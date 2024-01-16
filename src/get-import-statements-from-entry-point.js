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

  const filesInsideDirectoy = getFilesFromDirectory(sourceCodeDirectory, ["jsx", "tsx", "js", "ts"]);

  if (filesInsideDirectoy.length === 0) throw "Error: No file in the current directory"

  const fileName = getFileNameFromPath(filePath);
  const fileExtention = filesInsideDirectoy.find((dir) => {
    return dir.includes(`${fileName}.`)
  });

  if (!fileExtention) throw `Error: could not find a file that matches ${filePath}`

  return fileExtention.split(".")[1];
}

const pathIncludeFileExtention = (path, extention) => {
  return extention.some(ext => path.includes(`.${ext}`));
}

const removeFileConcatination = (path) => {
  return path.replace(/\b\.\//g, '/');
}

export default async (entryPoint, fileExtensions) => {
  let urls = [];

  const getImportStatementRecusive = async (path, sourceCodeDirectory) => {
    console.log(`------- ${path} -------`);
    const filePath = removeFileConcatination(`${sourceCodeDirectory || ''}${path}`);

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
        console.log(`skipping node package import`);
        // return earlier as it's a node package imported
        return;
      }
    }

    fileWithExtention = includeExtension ? filePath : `${filePath}.${getFileExtention(sourceCodeDir, filePath)}`;
    console.log("--> ", fileWithExtention);
    urls.push(fileWithExtention);

    const sourceCode = await readContentFromFile(fileWithExtention, "string");
    const importUrls = await getImportStatementsUrlFromFile(sourceCode);

    for (let i = 0; i < importUrls.length; i++) {
      const url = importUrls[i];
      await getImportStatementRecusive(url, sourceCodeDir);
    }
  }
  await getImportStatementRecusive(entryPoint);
  return urls;
}
