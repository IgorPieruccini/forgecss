const identifyClasses = require("./src/identify-classes.js");
const readContentFromFile = require("./src/read-content-from-file.js");
const writeToFile = require("./src/write-to-file.js");
const generateTemplate = require("./src/generate-template.js")

const init = async () => {
  try {
    const classesInUse = await identifyClasses();
    const config = await readContentFromFile("./forge.config.json", "json");
    const marginClassesWithPx = generateTemplate.withUnit(classesInUse.margin, config.size.px, "margin", "px");
    const padddingClassesWithPx = generateTemplate.withUnit(classesInUse.padding, config.size.px, "padding", "px");
    await writeToFile(marginClassesWithPx + padddingClassesWithPx, "forge.js");
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
