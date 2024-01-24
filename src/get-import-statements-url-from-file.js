import traverse from "@babel/traverse";
import getAstFromFile from "./get-ast-from-file.js";
import path from "path";
import fs from "fs";
import { forgecssConfig } from "../index.js";

const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx']; // Add more extensions if needed

// If the import statement does not include a file extension, try to find one
const findAndAttachFileExtension = (absolutePath) => {
  for (const extension of possibleExtensions) {
    const fileWithExtension = absolutePath + extension;
    if (fs.existsSync(fileWithExtension)) {
      return fileWithExtension;
    }
  }
  return null;
}

// If no extension is found, try to find an index file with any extension
const findIndexFileWithAnyExtention = (absolutePath) => {
  const indexFile = path.join(absolutePath, 'index');
  for (const extension of possibleExtensions) {
    const indexFileWithExtension = indexFile + extension;
    if (fs.existsSync(indexFileWithExtension)) {
      return indexFileWithExtension
    }
  }
}

const extractPaths = (pathNode, filepath) => {
  const importDecalrationUrl = pathNode.node.source.value;
  try {
    const absolutePath = path.isAbsolute(importDecalrationUrl) ? importDecalrationUrl : path.resolve(path.dirname(filepath), importDecalrationUrl);

    if (!path.extname(absolutePath)) {
      const fileWithExtension = findAndAttachFileExtension(absolutePath);
      if (fileWithExtension) return fileWithExtension;
      const indexFile = findIndexFileWithAnyExtention(absolutePath);
      if (indexFile) return indexFile;
    }

    const resolveAlias = forgecssConfig.resolve.alias;
    console.log("looking for alias", absolutePath);

    const pathIsUsingAlias = Object.entries(resolveAlias).find(([key]) => {
      return absolutePath.includes(key);
    });

    if (pathIsUsingAlias) {
      const [key, alias] = pathIsUsingAlias;
      const detachedUrl = absolutePath.split(key);
      if (detachedUrl.length) {
        const aliasUrl = alias + detachedUrl.pop();
        const aliasUrlAbsolute = path.isAbsolute(aliasUrl) ? aliasUrl : path.resolve(path.dirname(""), aliasUrl);

        const fileWithExtension = findAndAttachFileExtension(aliasUrlAbsolute);
        if (fileWithExtension) return fileWithExtension;
        const indexFile = findIndexFileWithAnyExtention(aliasUrlAbsolute);
        if (indexFile) return indexFile;
      }
    }

    console.log("file not match");
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
