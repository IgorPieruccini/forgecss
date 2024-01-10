const readContentFromFile = require("./src/read-content-from-file.js");
const writeToFile = require("./src/write-to-file.js");
const generateTemplate = require("./src/generate-template.js");
const getClassesUsedByFilesInDirectory = require("./src/get-classes-used-by-files-in-directory.js");

const variantMap = {
  margin: ["px"],
  padding: ["px"],
  "justify-content": ["placement"],
}

const createTemplatesFromClassesInUse = (classesInUse, variants) => {
  let content = "";
  Object.entries(classesInUse).forEach(([key, value]) => {
    const currentVariants = variantMap[key];

    currentVariants?.forEach((variantKey) => {
      const templateContent = generateTemplate.withUnit(value, variants[variantKey], key, variantKey);
      content = `${content} \n ${templateContent}`;
    });

  });

  return content;
}

const init = async () => {
  try {
    const config = await readContentFromFile("./forge.config.json", "json");
    const classesInUse = await getClassesUsedByFilesInDirectory(config);
    const content = createTemplatesFromClassesInUse(classesInUse, config.variant);

    await writeToFile(content, config.outDir);
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
