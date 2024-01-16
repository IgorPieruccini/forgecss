import fs from "fs";

/**
 * Read content from a file.
 * @param {string} filePath - The path of the file to read the content from.
 * @param {string} format - The format of content (string | json).
 * @returns {string | json} The content of the file
 */
export const readContentFromFile = async (filePath, format) => {
  return new Promise((response, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return;
      };
      if (format === "string") {
        response(data.toString());
      }
      if (format === "json") {
        response(JSON.parse(data.toString()));
      }
    })
  });
}
