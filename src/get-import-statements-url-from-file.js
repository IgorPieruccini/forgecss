import babelCore from "@babel/core";
import traverse from "@babel/traverse";

export default async (sourceCode, extensions) => {
  const astNode = babelCore.parseSync(sourceCode, {
    plugins: ["@babel/plugin-syntax-jsx"]
  });

  const importUrls = [];

  traverse.default(astNode, {
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

  return importUrls;
}
