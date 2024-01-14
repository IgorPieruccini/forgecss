import generateTemplate from "./generate-template.js"
import { placement } from "./placements.js";

/**
  * An object that defines the properties and which variants they use
  */
const variantMap = {
  margin: ["px"],
  padding: ["px"],
  "justify-content": ["placement"],
  "align-items": ["placement"]
}

/**
  * Create a template from classes in use
  * @param {object} classesInUse - The object defining the css properties and the corresponding
  * classes used
  * @example
  * 
    {  
        margin : ["mt", "mb"],
        padding: ["pt", "pb"]
    }
  *
  * @param {array} cssVariablesInUse - The array containing all css variables in use
  * @example ["2", "4", "center"]
  * 
  * @param {object} - The variants from forge Config
  *
  * @returns {string} - The string with the css content
  */
export const createTemplatesFromClassesInUse = (
  classesInUse,
  cssVariablesInUse,
  variants
) => {
  // join variants from forge Config and default css placements
  variants = {
    ...variants,
    placement,
  }

  let content = "";
  Object.entries(classesInUse).forEach(([key, value]) => {
    const currentVariantsType = variantMap[key];
    currentVariantsType?.forEach((variantKey) => {
      const variantInUse = variants[variantKey].filter((curVariant) => {
        return cssVariablesInUse.find((cssVar) => cssVar === curVariant);
      });

      if (variantInUse.length === 0) return;

      const templateContent = generateTemplate[variantKey](value, variantInUse, key, variantKey);
      content = `${content} \n ${templateContent}`;
    });
  });

  return content;
}
