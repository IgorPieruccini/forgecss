const readContentFromFile = require("./read-content-from-file");
const extractAliasFromConfig = require("./extract-alias-from-config");
const babelCore = require("@babel/core");
const traverse = require("@babel/traverse").default;

module.exports = async (path, configTemplate) => {
  const sourceCode = await readContentFromFile(path, "string");
  const aliases = await extractAliasFromConfig(configTemplate);

  const astNode = babelCore.parseSync(sourceCode, {
    plugins: [
      "@babel/plugin-syntax-jsx"
    ]
  });

  const classesInUse = {};

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
                const regexPattern = new RegExp(`${alias}-\\d+`);
                if (regexPattern.test(className)) return true;
                return false;
              });
            });
            if (currentClassesInUse.length) {
              classesInUse[key] = [...classesInUse[key] || [], ...currentClassesInUse]
            }
            return classesInUse;
          });
      }
    },
  });

  return classesInUse;
}
