const identifyClasses = require("./identify-classes.js");
const getFilesWithExtension = require("./get-files-with-extension.js");

module.exports = async (config) => {
  const classes = {};
  let variables = [];

  const filesPath = getFilesWithExtension(config.sourceDir, config.fileExtensions);
  for (let x = 0; x < filesPath.length; x++) {
    const path = filesPath[x];
    const { aliasInUse, cssVariablesInUse } = await identifyClasses(path, config.alias);
    const joinedVariables = [...variables, ...cssVariablesInUse];
    variables = [...new Set(joinedVariables)];
    Object.entries(aliasInUse).forEach(([key, value]) => {
      const joinedAliasArray = [...(aliasInUse[key] || []), ...value]
      classes[key] = [...new Set(joinedAliasArray)];
    });
  };

  return {
    classes,
    variables
  };
}
