const Handlebars = require("handlebars");

const withUnit = (classesInUse, cssVariants, name, unit) => {
  if (!classesInUse) throw `${name} is undefined, please add ${name} to your forge.config.json"`

  const properties = classesInUse.map((alias) => {
    return { cssProperty: name, alias, unit }
  });

  const margingTemplate = `
{{#each properties}}
{{#each ../cssVariants}}
.{{../this.alias}}-{{this}} {
  {{../this.cssProperty}}: {{this}}{{../this.unit}} 
}
{{/each}}
{{/each}}
`;

  const template = Handlebars.compile(margingTemplate);
  const result = template({
    properties,
    cssVariants,
    unit
  });

  return result;
}

const withPlacement = (classesInUse, cssVariants, name) => {
  if (!classesInUse) throw `${name} is undefined, please add ${name} to your forge.config.json"`

  const properties = classesInUse.map((alias) => {
    return { cssProperty: name, alias }
  });

  const margingTemplate = `
{{#each properties}}
{{#each ../cssVariants}}
.{{../this.alias}}-{{this}} {
  {{../this.cssProperty}}: {{this}}; 
}
{{/each}}
{{/each}}
`;

  const template = Handlebars.compile(margingTemplate);
  const result = template({
    properties,
    cssVariants,
  });

  return result;
}

module.exports = {
  px: withUnit,
  "%": withUnit,
  placement: withPlacement,
}

