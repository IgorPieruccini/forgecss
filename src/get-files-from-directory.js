import fs from 'fs';
import path from 'path';

/**
  * Get files recursively from a directory that matches a file extention
  * @param {string} directoryPath - The path of the directory to look files from
  * @param {string} extensions - The file extension eg: .jsx, .tsx, .js
  * @returns {array} The absolute path of all matched files 
  * */
export const getFilesFromDirectory = (directoryPath, extensions) => {
  const files = fs.readdirSync(directoryPath);

  const filteredFiles = files.filter(file => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    // Check if it's a file and has the specified extensions
    return stat.isFile() && extensions.some(ext => file.endsWith(ext));
  });

  return filteredFiles.map(file => path.join(directoryPath, file));
}
