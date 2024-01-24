#! /usr/bin/env node

import { readContentFromFile } from "./src/read-content-from-file.js";
import writeToFile from "./src/write-to-file.js";
import { getCssClassesUsedByAllFilesInDirectory } from "./src/get-classes-used-by-files-in-directory.js";
import { createTemplatesFromClassesInUse } from "./src/create-template-from-classes-in-use.js";

export const forgecssConfig = await readContentFromFile("./forge.config.json", "json");

const init = async () => {
  try {

    const {
      classesInUse,
      cssVariablesInUse,
    } = await getCssClassesUsedByAllFilesInDirectory(forgecssConfig);

    const content = createTemplatesFromClassesInUse(
      classesInUse,
      cssVariablesInUse,
      forgecssConfig.variant
    );

    await writeToFile(content, forgecssConfig.outDir);

    console.log("Your customized classes are generated, check forge.css");
  } catch (error) { console.log(error); }
}

init();
