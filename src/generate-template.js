const Handlebars = require("handlebars");

module.exports = {
  withUnit: (classesInUse, space, name, unit) => {
    if (!classesInUse) throw `${name} is undefined, please add ${name} to your forge.config.json"`

    const properties = classesInUse.map((alias) => {
      return { cssProperty: name, alias }
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
}

