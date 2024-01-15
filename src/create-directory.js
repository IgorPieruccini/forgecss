import fs from "fs";

export default (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
