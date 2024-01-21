import babelCore from "@babel/core";
import traverse from "@babel/traverse";
import { getAliasesFromForgeConfig } from "./get-aliases-from-forge-config.js";
import { readContentFromFile } from "./read-content-from-file.js";
import getAstFromFile from "./get-ast-from-file.js";

/**
  * Get css classes used by file
  * @param {string} path - The path of the file to look for classes
  * @param {object} configAlias -The aliases from forge config
  * @returns {object} Returns object with {classesInUse: [...], cssVariablesInUse: [...]}
  * */
export const getCssClassesUsedByFile = async (path, configAlias) => {
  const astNode = await getAstFromFile(path);
  const aliases = await getAliasesFromForgeConfig(configAlias);

  const classesInUse = {};
  const cssVariablesInUse = [];

  traverse.default(astNode, {
    JSXAttribute: function(path) {
      const classAttribute = path.node.name.name;
      if (classAttribute === "className") {
        const valueAttribute = path.node.value.value;
        const classes = valueAttribute.split(" ");

        // only consider the classes that match the alias from the config
        Object.entries(aliases).forEach(
          ([key, aliasArray]) => {
            // get the classes in use from the file that matches alias from config
            const currentClassesInUse = aliasArray.filter(alias => {
              return classes.some((className) => {
                if (alias === className) return true
                const regexPattern = new RegExp(`${alias}-[a-zA-Z0-9]+$`);
                const regexPatternCssVariable = new RegExp(`${alias}-(.*?)( |$)`);
                if (regexPattern.test(className)) {
                  const cssVar = regexPatternCssVariable.exec(className)[1];
                  if (cssVar) {
                    // for each class in use we also store the css variable in use:
                    // eg: for margin bittom with alias mb
                    // mb-2
                    // the css variable is 2
                    cssVariablesInUse.push(cssVar);
                  }
                  return true;
                }
                return false;
              });
            });

            if (currentClassesInUse.length) {
              /**
                * Add the classes in use under the write key
                * ``js
                  {
                    margin: ["mb", "mt"],
                    padding: ["pb", "pt"]
                  } 
                * ``
              */
              classesInUse[key] = [
                ...classesInUse[key] || [],
                ...currentClassesInUse,
              ]
            }
            return classesInUse;
          });
      }
    },
  });
  console.log({ classesInUse, cssVariablesInUse });

  return { classesInUse, cssVariablesInUse };
}
