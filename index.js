#! /usr/bin/env node

import { readContentFromFile } from "./src/read-content-from-file.js";
import writeToFile from "./src/write-to-file.js";
import { getCssClassesUsedByAllFilesInDirectory } from "./src/get-classes-used-by-files-in-directory.js";
import { createTemplatesFromClassesInUse } from "./src/create-template-from-classes-in-use.js";

const init = async () => {
  try {
    const config = await readContentFromFile("./forge.config.json", "json");

    const {
      classesInUse,
      cssVariablesInUse,
    } = await getCssClassesUsedByAllFilesInDirectory(config);

    const content = createTemplatesFromClassesInUse(
      classesInUse,
      cssVariablesInUse,
      config.variant
    );

    await writeToFile(content, config.outDir);

    console.log("Your customized classes are generated, check forge.css");
  } catch (error) { console.log(error); }
}

init();
