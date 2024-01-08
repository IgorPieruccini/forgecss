const fs = require("fs");

module.exports = async (filePath, format) => {
  return new Promise((response, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      if (format === "string") {
        response(data.toString());
      }
      if (format === "json") {
        response(JSON.parse(data.toString()));
      }
    })
  });
}
