const fs = require("fs");

module.exports = (content, filePath) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

