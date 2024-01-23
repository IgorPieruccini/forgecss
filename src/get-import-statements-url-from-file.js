import traverse from "@babel/traverse";
import getAstFromFile from "./get-ast-from-file.js";
import path from "path";
import fs from "fs";

const extractPaths = (pathNode, filepath) => {
  const importDecalrationUrl = pathNode.node.source.value;
  try {
    const absolutePath = path.isAbsolute(importDecalrationUrl) ? importDecalrationUrl : path.resolve(path.dirname(filepath), importDecalrationUrl);

    // If the import statement does not include a file extension, try to find one
    if (!path.extname(absolutePath)) {
      const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx']; // Add more extensions if needed

      for (const extension of possibleExtensions) {
        const fileWithExtension = absolutePath + extension;
        if (fs.existsSync(fileWithExtension)) {
          return fileWithExtension;
        }
      }

      // If no extension is found, try to find an index file with any extension
      const indexFile = path.join(absolutePath, 'index');
      for (const extension of possibleExtensions) {
        const indexFileWithExtension = indexFile + extension;
        if (fs.existsSync(indexFileWithExtension)) {
          return indexFileWithExtension
        }
      }
    }

    // TODO: add support for alias
    return null;
  }
  catch (e) {
    console.log("ERROR", e);
  }
}

export default async (filepath, extensions) => {
  const astNode = await getAstFromFile(filepath)

  if (!astNode) return [];

  const importUrls = [];

  traverse.default(astNode, {
    enter() { },
    ImportDeclaration: (path) => {
      const url = extractPaths(path, filepath);
      if (url) importUrls.push(url)
    },
    ExportAllDeclaration: (path) => {
      const url = extractPaths(path, filepath);
      if (url) importUrls.push(url)
    }
  });

  return importUrls;

}
