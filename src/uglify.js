import UglifyJs from "uglify-js";
import { readContentFromFile } from "../src/read-content-from-file.js";

/**
  * Uglify js content
  * @param {string} path - path of the file
  * @returns `Promise<string>`
  */
export default async (path) => {
  const code = await readContentFromFile(path, "string");
  const result = UglifyJs.minify(code);
  return result;
}
