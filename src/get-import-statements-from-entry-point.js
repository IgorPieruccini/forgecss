import { getFilesFromDirectory } from "./get-files-from-directory.js";
import fs from "fs";
import getImportStatementsUrlFromFile from "./get-import-statements-url-from-file.js"

const transformPathToAbsolute = (path) => {
  const currentPath = path.replace(/\b\.\//g, '/');

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


const getImportStatement = async (importStatementPath, previousPaths) => {
  console.log("   ");
  // console.log(`analyzing: ---${importStatementPath}---`);
  // console.log(`Previous path: ${previousPaths}`);
  const absoluteFilePath = transformPathToAbsolute(`${previousPaths || ""}${previousPaths ? "/" : ""}${importStatementPath}`)
  console.log(`Absolute file path: ${absoluteFilePath}`);

  const urlParts = absoluteFilePath.split("/");
  const currentImportStatementDirectory = urlParts.slice(0, urlParts.length - 1).join("/");
  const currentImportStatementFileName = urlParts[urlParts.length - 1];

  try {
    if (!fs.existsSync(absoluteFilePath)) {
      throw `looking for filename: ${absoluteFilePath}`
    }

    const pathIsDirectory = fs.lstatSync(absoluteFilePath).isDirectory();

    if (pathIsDirectory) {
      const filesInsideDirectory = getFilesFromDirectory(absoluteFilePath, ["jsx", "tsx", "js", "ts"]);
      console.log({ filesInsideDirectory });
      const foundedFile = filesInsideDirectory.find((dir) => dir.includes(`/index.`));

      if (!foundedFile) {
        console.log(`No file in path:  ${absoluteFilePath}`);
        return;
      }

      const extension = foundedFile.split(".").reverse()[0];
      const newPath = `${absoluteFilePath}/index.${extension}`;
      await getImportStatement(newPath);

    } else {
      const importUrls = await getImportStatementsUrlFromFile(absoluteFilePath);
      console.log({ importUrls });

      for (let i = 0; i < importUrls.length; i++) {
        const url = importUrls[i];
        await getImportStatement(url, currentImportStatementDirectory);
      }
    }

  } catch (e) {
    // console.log(e);
    if (!fs.existsSync(currentImportStatementDirectory)) {
      // code getting here without being a pack
      console.log("import pack")
      // package import
      return;
    }

    const filesInsideDirectoy = getFilesFromDirectory(currentImportStatementDirectory, ["jsx", "tsx", "js", "ts"]);
    const foundedFile = filesInsideDirectoy.find((dir) => dir.includes(`${currentImportStatementFileName}.`));

    if (!foundedFile) {
      console.log(`skipping ${absoluteFilePath}`);
      return;
    }

    const extension = foundedFile.split(".").reverse()[0];
    await getImportStatement(`${absoluteFilePath}.${extension}`);
  }
}

export default async (entryPoint, fileExtensions) => {
  let urls = [];

  const urlParts = entryPoint.split("/");
  const path = urlParts.slice(0, urlParts.length - 1).join("/");
  const fileName = urlParts[urlParts.length - 1];

  await getImportStatement(fileName, path);

  return urls;
}
