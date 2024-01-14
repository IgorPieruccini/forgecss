
/** 
  * Get all aliases inside the forge config
  * @param {object} aliasConfig - The alias object inside the forgec config 
  * @returns {object} An object with [parentKey] : [all aliases inside the key]
  * @example
   {
        margin: ["m", "mb"],
        padding: ["p", pb]
   }
  * */
export const getAliasesFromForgeConfig = async (aliasConfig) => {
  const result = {};

  const checkValue = async (propertyKey, propertyValue, parentKey) => {
    return new Promise((resolve) => {

      if (typeof propertyValue === "object") {
        Object.entries(propertyValue).forEach(async ([key, val]) => {
          await checkValue(key, val, propertyKey);
        });
      }

      if (typeof propertyValue === "string") {
        if (result[parentKey]) {
          result[parentKey].push(propertyValue);
        } else {
          result[propertyKey] = [propertyValue];
        }

        resolve();
      }

    });
  }

  Object.entries(aliasConfig).forEach(async ([key, val]) => {
    await checkValue(key, val);
  });

  return result;
}

