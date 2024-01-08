const fs = require('fs');
const path = require('path');

module.exports = (directoryPath, extensions) => {
  const files = fs.readdirSync(directoryPath);

  const filteredFiles = files.filter(file => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    // Check if it's a file and has the specified extensions
    return stat.isFile() && extensions.some(ext => file.endsWith(ext));
  });

  return filteredFiles.map(file => path.join(directoryPath, file));
}
