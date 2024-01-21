import traverse from "@babel/traverse";
import getAstFromFile from "./get-ast-from-file.js";

export default async (filepath, extensions) => {
  console.log({ filepath });
  const astNode = await getAstFromFile(filepath)

  const importUrls = [];

  traverse.default(astNode, {
    enter() { },
    ImportDeclaration: (path) => {
      const importDecalrationUrl = path.node.source.value;
      if (extensions) {
        const isInternalModule = extensions.some(ext => {
          return importDecalrationUrl.includes(`.${ext}`);
        });
        if (isInternalModule) {
          importUrls.push(importDecalrationUrl);
        }
      } else {
        importUrls.push(importDecalrationUrl);
      }
    }
  });

  console.log({ importUrls });
  return importUrls;
}
