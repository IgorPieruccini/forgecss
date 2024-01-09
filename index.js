const identifyClasses = require("./src/identify-classes.js");
const readContentFromFile = require("./src/read-content-from-file.js");
const writeToFile = require("./src/write-to-file.js");
const generateTemplate = require("./src/generate-template.js");
const getFilesWithExtension = require("./src/get-files-with-extension.js");

const getClassesUsedByFilesInDirectory = async (directory) => {
  const classes = {};
  const filesPath = getFilesWithExtension(directory, [".jsx", ".tsx"]);
  for (let x = 0; x < filesPath.length; x++) {
    const path = filesPath[x];
    const classesInUse = await identifyClasses(path);
    Object.entries(classesInUse).forEach(([key, value]) => {
      const joinedArray = [...(classes[key] || []), ...value]
      classes[key] = [...new Set(joinedArray)];
    });
  };
  return classes;
}

const init = async () => {
  try {
    const classesInUse = await getClassesUsedByFilesInDirectory("./examples/");
    const config = await readContentFromFile("./forge.config.json", "json");
    const marginClassesWithPx = generateTemplate.withUnit(classesInUse.margin, config.size.px, "margin", "px");
    const padddingClassesWithPx = generateTemplate.withUnit(classesInUse.padding, config.size.px, "padding", "px");
    await writeToFile(marginClassesWithPx + padddingClassesWithPx, "forge.css");
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
