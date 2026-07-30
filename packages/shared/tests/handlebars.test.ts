import * as Handlebars from 'handlebars'
import { describe, expect, test } from 'vitest'
import { registerHandlebarsHelpers } from '@/handlebars/register'

describe('Handlebars helpers', () => {
  registerHandlebarsHelpers()

  test('checks array membership safely', () => {
    const render = Handlebars.compile('{{#if (includes values "stdio")}}included{{else}}missing{{/if}}')

    expect(render({ values: ['stdio'] })).toBe('included')
    expect(render({ values: ['streamable'] })).toBe('missing')
    expect(render({ values: null })).toBe('missing')
    expect(render({ values: 'stdio' })).toBe('missing')
  })

  test('combines and compares values', () => {
    const render = Handlebars.compile('{{and first second}}|{{or first second}}|{{eq first second}}')

    expect(render({ first: true, second: false })).toBe('false|true|false')
    expect(render({ first: false, second: false })).toBe('false|false|true')
    expect(render({ first: 'same', second: 'same' })).toBe('same|same|true')
  })
})
