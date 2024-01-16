import { getFilesFromDirectory } from "./get-files-from-directory.js";
import { getCssClassesUsedByFile } from "./get-css-classes-used-by-file.js";
import getImportStatementsFromEntryPoint from "./get-import-statements-from-entry-point.js";

/**
  * Get all css files used by files inside a directory
  * @param {object} config - The forge Config.
  *
  * Uses the sourceDir and fileExtensions from the config to look for files with classes included in alias object.
  */
export const getCssClassesUsedByAllFilesInDirectory = async (config) => {
  const classesInUse = {};
  let cssVariablesInUse = [];

  const urls = await getImportStatementsFromEntryPoint(config.entry, config.fileExtensions);
  console.log({ urls });

  const filesPath = getFilesFromDirectory(config.sourceDir, config.fileExtensions);
  for (let x = 0; x < filesPath.length; x++) {
    const path = filesPath[x];
    const {
      classesInUse: classesInUseFromFile,
      cssVariablesInUse: cssVariablesInUseFromFile,
    } = await getCssClassesUsedByFile(path, config.alias);
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
