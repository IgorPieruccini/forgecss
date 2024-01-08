module.exports = async (config) => {
  const result = [];

  const checkValue = async (propertyValue) => {
    return new Promise((resolve) => {

      if (typeof propertyValue === "object") {
        Object.values(propertyValue).forEach(async (val) => {
          await checkValue(val);
        });
      }

      if (typeof propertyValue === "string") {
        result.push(propertyValue);
        resolve();
      }

    });
  }

  Object.values(config).forEach(async (val) => {
    await checkValue(val);
  });
  return result;
}

