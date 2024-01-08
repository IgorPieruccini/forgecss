const fs = require("fs");
const Handlebars = require("handlebars");
const identifyClasses = require("./src/identify-classes.js");

const ReadConfigFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./forge.config.json", (err, data) => {
      if (err) reject(err);
      const jsonConfig = JSON.parse(data);
      resolve(jsonConfig)
    });
  });
}

const writeToFile = (content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("forge.css", content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

const generateClassesWithSizes = (section, space, name, unit) => {
  if (!section) throw `${name} is undefined, please add ${name} to your forge.config.json"`

  const properties = Object.entries(section).map(([cssProperty, alias]) => {
    return { cssProperty, alias }
  });

  const margingTemplate = `
{{#each properties}}
{{#each ../space}}
.{{../this.alias}}-{{this}} {
  {{../this.cssProperty}}: {{this}}{{unit}}
}
{{/each}}
{{/each}}
`;

  const template = Handlebars.compile(margingTemplate);
  const result = template({
    properties,
    space,
    unit
  });

  return result;
}

const init = async () => {
  try {
    const classesInUse = identifyClasses();
    const config = await ReadConfigFile();
    const marginClassesWithPx = generateClassesWithSizes(config.margin, config.size.px, "margin", "px");
    const padddingClassesWithPx = generateClassesWithSizes(config.padding, config.size.px, "padding", "px");
    await writeToFile(marginClassesWithPx + padddingClassesWithPx);
    console.log("Your customized classes are generated, check forge.css");
  } catch (error) {
    console.log(error);
  }
}

init();
