import { describe, expect, test } from 'vitest'

describe('getDataTool', () => {
  test('returns data for a valid input', async () => {
    expect(
      await global.client.callTool({
        name: 'GetData',
        arguments: {
          keyword: 'test',
        },
      }),
    ).toStrictEqual({
      content: [{ type: 'text', text: 'keyword: test;' }],
    })
  })

  test('returns a "not found" response for an unrecognized input', async () => {
    expect(
      await global.client.callTool({
        name: 'GetData',
        arguments: {
          keyword: 'error',
        },
      }),
    ).toStrictEqual({
      content: [{ type: 'text', text: 'not found' }],
    })
  })

  test('returns a "not found" response for empty input', async () => {
    expect(
      await global.client.callTool({
        name: 'GetData',
        arguments: {
          keyword: '',
        },
      }),
    ).toStrictEqual({
      content: [{ type: 'text', text: 'not found' }],
    })
  })
})
