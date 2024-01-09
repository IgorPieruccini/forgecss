const identifyClasses = require("./identify-classes.js");
const getFilesWithExtension = require("./get-files-with-extension.js");

module.exports = async (config) => {
  const classes = {};
  const filesPath = getFilesWithExtension(config.sourceDir, config.fileExtensions);
  for (let x = 0; x < filesPath.length; x++) {
    const path = filesPath[x];
    const classesInUse = await identifyClasses(path, config.template);
    Object.entries(classesInUse).forEach(([key, value]) => {
      const joinedArray = [...(classes[key] || []), ...value]
      classes[key] = [...new Set(joinedArray)];
    });
  };
  return classes;
}
