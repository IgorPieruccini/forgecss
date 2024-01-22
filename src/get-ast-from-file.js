import getFileNameAndExtension from "./get-filename-and-extension.js";
import { babelParserMapping } from "./babel-parser-mapping.js";
import { readContentFromFile } from "./read-content-from-file.js";
import babelCore from "@babel/core";

export default async (path) => {
  try {
    const sourceCode = await readContentFromFile(path, "string");
    const { name, ext } = getFileNameAndExtension(path);

    if (!babelParserMapping[ext]) {
      console.log("File not supported");
      return;
    }

    const astNode = babelCore.parse(sourceCode, {
      filename: name,
      presets: babelParserMapping[ext].presets,
      plugins: babelParserMapping[ext].plugins,
    });

    return astNode;

  } catch (e) {
    console.error(`Could not create ast from file: ${path}`);
    console.log(e);
    return null;
  }

}
