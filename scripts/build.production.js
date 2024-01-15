import fs from "fs";
import uglify from "./uglify.js";
import writeToFile from "../src/write-to-file.js"
import createDirectory from "../src/create-directory.js";

const init = async () => {
  const uglifiedContent = await uglify();
  await createDirectory("./bin");
  await writeToFile(uglifiedContent.code, "./bin/index.js");
  console.log({ uglifyCode: uglifiedContent });
}

init();
