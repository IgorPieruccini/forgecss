const Handlebars = require("handlebars");

const withUnit = (classesInUse, space, name, unit) => {
  if (!classesInUse) throw `${name} is undefined, please add ${name} to your forge.config.json"`

  const properties = classesInUse.map((alias) => {
    return { cssProperty: name, alias, unit }
  });

  const margingTemplate = `
{{#each properties}}
{{#each ../space}}
.{{../this.alias}}-{{this}} {
  {{../this.cssProperty}}: {{this}}{{../this.unit}} 
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

const withPlacement = (classesInUse, space, name) => {
  if (!classesInUse) throw `${name} is undefined, please add ${name} to your forge.config.json"`

  const properties = classesInUse.map((alias) => {
    return { cssProperty: name, alias }
  });

  const margingTemplate = `
{{#each properties}}
{{#each ../space}}
.{{../this.alias}}-{{this}} {
  {{../this.cssProperty}}: {{this}}; 
}
{{/each}}
{{/each}}
`;

  const template = Handlebars.compile(margingTemplate);
  const result = template({
    properties,
    space,
  });

  return result;
}

module.exports = {
  px: withUnit,
  "%": withUnit,
  placement: withPlacement,
}

