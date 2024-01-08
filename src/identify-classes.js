const readContentFromFile = require("./read-content-from-file");
const extractAliasFromConfig = require("./extract-alias-from-config");
const babelCore = require("@babel/core");
const traverse = require("@babel/traverse").default;

const examplePath = "./examples/index.js";
const configPath = "./forge.config.json";

module.exports = async () => {
  const sourceCode = await readContentFromFile(examplePath, "string");
  const jsonConfig = await readContentFromFile(configPath, "json");
  const aliases = await extractAliasFromConfig(jsonConfig);

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
