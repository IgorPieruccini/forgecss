import writeToFile from "../src/write-to-file.js"
import createDirectory from "../src/create-directory.js";
import uglifyAllFilesFromEntryPoint from "../src/uglify-all-files-from-entry-point.js";

const init = async () => {
  const result = await uglifyAllFilesFromEntryPoint("./index.js");
  await createDirectory("./bin/src");

  Object.entries(result).forEach(([key, value]) => {
    writeToFile(value, `./bin/${key}`);
  });
}

init();
