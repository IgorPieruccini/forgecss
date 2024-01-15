import UglifyJs from "uglify-js";
import { readContentFromFile } from "../src/read-content-from-file.js";

export default async () => {
  const code = await readContentFromFile("./index.js", "string");
  const result = UglifyJs.minify(code);
  return result;
}
