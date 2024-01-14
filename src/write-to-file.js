import { writeFile } from "fs";

/**
  * Write the content to file
  * @param {string} content - The stringfy content
  * @param {string} filePath - The filePath to write the content to
  * if the file does not exist, it will be created
  * @returns `Promise<void>`
  */
export default (content, filePath) => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

