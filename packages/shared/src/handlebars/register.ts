import Handlebars from 'handlebars'

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('includes', (array, value) => array && Array.isArray(array) && array.includes(value))
  Handlebars.registerHelper('and', (a, b) => a && b)
  Handlebars.registerHelper('or', (a, b) => a || b)
  Handlebars.registerHelper('eq', (a, b) => a === b)
}
