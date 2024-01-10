const readContentFromFile = require("./read-content-from-file");
const extractAliasFromConfig = require("./extract-alias-from-config");
const babelCore = require("@babel/core");
const traverse = require("@babel/traverse").default;

module.exports = async (path, configAlias) => {
  const sourceCode = await readContentFromFile(path, "string");
  const aliases = await extractAliasFromConfig(configAlias);

  const astNode = babelCore.parseSync(sourceCode, {
    plugins: [
      "@babel/plugin-syntax-jsx"
    ]
  });

  const aliasInUse = {};
  const cssVariablesInUse = [];

  traverse(astNode, {
    JSXAttribute: function(path) {
      const classAttribute = path.node.name.name;
      if (classAttribute === "className") {
        const valueAttribute = path.node.value.value;
        const classes = valueAttribute.split(" ");
        Object.entries(aliases).forEach(
          ([key, aliasArray]) => {
            const currentClassesInUse = aliasArray.filter(alias => {
              return classes.some((className) => {
                if (alias === className) return true
                const regexPattern = new RegExp(`${alias}-[a-zA-Z0-9]+$`);
                const regexPatternCssVariable = new RegExp(`${alias}-(.*?)( |$)`);
                if (regexPattern.test(className)) {
                  const cssVar = regexPatternCssVariable.exec(className)[1];
                  if (cssVar) {
                    cssVariablesInUse.push(cssVar);
                  }
                  return true;
                }
                return false;
              });
            });
            if (currentClassesInUse.length) {
              aliasInUse[key] = [...aliasInUse[key] || [], ...currentClassesInUse]
            }
            return aliasInUse;
          });
      }
    },
  });

  return { aliasInUse, cssVariablesInUse };
}
