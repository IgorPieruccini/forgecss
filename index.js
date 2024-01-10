const readContentFromFile = require("./src/read-content-from-file.js");
const writeToFile = require("./src/write-to-file.js");
const generateTemplate = require("./src/generate-template.js");
const getClassesUsedByFilesInDirectory = require("./src/get-classes-used-by-files-in-directory.js");
const placement = require("./src/placements.js");

const variantMap = {
  margin: ["px"],
  padding: ["px"],
  "justify-content": ["placement"],
  "align-items": ["placement"]
}

const createTemplatesFromClassesInUse = (classesInUse, cssVariablesInUse, variants) => {
  variants = { ...variants, placement }

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

const init = async () => {
  try {
    const config = await readContentFromFile("./forge.config.json", "json");
    const { classes, variables } = await getClassesUsedByFilesInDirectory(config);
    const content = createTemplatesFromClassesInUse(classes, variables, config.variant);

    await writeToFile(content, config.outDir);
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
