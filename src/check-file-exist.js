import fs from "fs";

export default (filePath) => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        reject(err);
        return
      }
      resolve();
    });

  });
}
