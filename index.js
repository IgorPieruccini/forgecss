const readContentFromFile = require("./src/read-content-from-file.js");
const writeToFile = require("./src/write-to-file.js");
const generateTemplate = require("./src/generate-template.js");
const getClassesUsedByFilesInDirectory = require("./src/get-classes-used-by-files-in-directory.js");

const init = async () => {
  try {
    const config = await readContentFromFile("./forge.config.json", "json");
    const classesInUse = await getClassesUsedByFilesInDirectory(config.sourceDir);
    const marginClassesWithPx = generateTemplate.withUnit(classesInUse.margin, config.size.px, "margin", "px");
    const padddingClassesWithPx = generateTemplate.withUnit(classesInUse.padding, config.size.px, "padding", "px");
    await writeToFile(marginClassesWithPx + padddingClassesWithPx, config.outDir);
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
