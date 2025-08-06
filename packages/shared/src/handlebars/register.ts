import Handlebars from 'handlebars'

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper('includes', function (array, value) {
    return array && Array.isArray(array) && array.includes(value)
  })

  Handlebars.registerHelper('and', function (a, b) {
    return a && b
  })

  Handlebars.registerHelper('or', function (a, b) {
    return a || b
  })
}
