import UglifyJs from "uglify-js";
import { readContentFromFile } from "../src/read-content-from-file.js";

export default async (path) => {
  const code = await readContentFromFile(path, "string");
  const result = UglifyJs.minify(code);
  return result;
}
