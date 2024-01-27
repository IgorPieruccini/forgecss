import { getCssClassesUsedByFile } from "./get-css-classes-used-by-file.js";
import getImportStatementsFromEntryPoint from "./get-import-statements-from-entry-point.js";
import writeToFile from "./write-to-file.js";

/**
  * Get all css files used by files inside a directory
  * @param {object} config - The forge Config.
  *
  * Uses the sourceDir and fileExtensions from the config to look for files with classes included in alias object.
  */
export const getCssClassesUsedByAllFilesInDirectory = async (config) => {
  const classesInUse = {};
  let cssVariablesInUse = [];

  const { foundUrls, notFoundUrls } = await getImportStatementsFromEntryPoint(config.entry, config.fileExtensions);
  writeToFile(`{"urls":${JSON.stringify(foundUrls)}}`, "./forgecss.log.json");
  writeToFile(`{"urls":${JSON.stringify(notFoundUrls)}}`, "./forgecss.failed.log.json");

  for (let x = 0; x < foundUrls.length; x++) {
    const path = foundUrls[x];
    const {
      classesInUse: classesInUseFromFile,
      cssVariablesInUse: cssVariablesInUseFromFile,
    } = await getCssClassesUsedByFile(path, config.alias);

    if (Object.keys(classesInUseFromFile).length > 0 || Object.keys(cssVariablesInUseFromFile).length > 0) {
      console.log(path, { classesInUseFromFile, cssVariablesInUseFromFile })
    }

    // join the css variable of each file in one array
    const joinedVariables = [
      ...cssVariablesInUse,
      ...cssVariablesInUseFromFile,
    ];
    cssVariablesInUse = [...new Set(joinedVariables)];
    Object.entries(classesInUseFromFile).forEach(([key, value]) => {
      // join the classes of each file in one array
      const joinedAliasArray = [...(classesInUse[key] || []), ...value]
      classesInUse[key] = [...new Set(joinedAliasArray)];
    });
  };

  return { classesInUse, cssVariablesInUse };
}
