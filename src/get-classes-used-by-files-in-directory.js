const identifyClasses = require("./identify-classes.js");
const getFilesWithExtension = require("./get-files-with-extension.js");

module.exports = async (directory) => {
  const classes = {};
  const filesPath = getFilesWithExtension(directory, [".jsx", ".tsx"]);
  for (let x = 0; x < filesPath.length; x++) {
    const path = filesPath[x];
    const classesInUse = await identifyClasses(path);
    Object.entries(classesInUse).forEach(([key, value]) => {
      const joinedArray = [...(classes[key] || []), ...value]
      classes[key] = [...new Set(joinedArray)];
    });
  };
  return classes;
}
