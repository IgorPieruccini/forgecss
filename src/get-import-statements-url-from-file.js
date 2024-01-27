import traverse from "@babel/traverse";
import getAstFromFile from "./get-ast-from-file.js";
import path from "path";
import fs from "fs";
import { forgecssConfig } from "../index.js";

const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx']; // Add more extensions if needed

const hasExtention = (extensions, absolutePath) => {
  const ext = path.extname(absolutePath);
  if (!ext) return false;
  return extensions.includes(ext);
}

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

    if (!hasExtention(possibleExtensions, absolutePath)) {
      const fileWithExtension = findAndAttachFileExtension(absolutePath);
      if (fileWithExtension) return [fileWithExtension, "url"];
      const indexFile = findIndexFileWithAnyExtention(absolutePath);
      if (indexFile) return [indexFile, "url"];
    }

    const resolveAlias = forgecssConfig.resolve.alias;

    const pathIsUsingAlias = Object.entries(resolveAlias).find(([key]) => {
      return importDecalrationUrl.startsWith(key);
    });


    if (pathIsUsingAlias) {
      const [key, alias] = pathIsUsingAlias;
      const detachedUrl = absolutePath.split(key);
      if (detachedUrl.length) {
        const aliasUrl = alias + detachedUrl.pop();
        const aliasUrlAbsolute = path.isAbsolute(aliasUrl) ? aliasUrl : path.resolve(path.dirname(""), aliasUrl);

        const fileWithExtension = findAndAttachFileExtension(aliasUrlAbsolute);
        if (fileWithExtension) return [fileWithExtension, "url"];
        const indexFile = findIndexFileWithAnyExtention(aliasUrlAbsolute);
        if (indexFile) return [indexFile, "url"];
      }
    }

    return [absolutePath, "not found"];
  }
  catch (e) {
    console.log("ERROR", e);
  }
}

export default async (filepath, extensions) => {
  const astNode = await getAstFromFile(filepath)

  if (!astNode) return [];

  const importUrls = [];
  const notFoundUrls = [];

  traverse.default(astNode, {
    enter() { },
    ImportDeclaration: (path) => {
      const [url, type] = extractPaths(path, filepath);
      if (url && type === "url") importUrls.push(url);
      if (url && type === "not found") notFoundUrls.push(url);
    },
    ExportAllDeclaration: (path) => {
      const [url, type] = extractPaths(path, filepath);
      if (url && type === "url") importUrls.push(url);
      if (url && type === "not found") notFoundUrls.push(url);
    }
  });

  return { importUrls, notFoundUrls };
}
