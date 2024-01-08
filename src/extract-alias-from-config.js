module.exports = async (config) => {
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
          result[parentKey] = [propertyValue];
        }

        resolve();
      }

    });
  }

  Object.entries(config).forEach(async ([key, val]) => {
    await checkValue(key, val);
  });
  return result;
}

