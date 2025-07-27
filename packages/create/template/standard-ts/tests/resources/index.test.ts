import { describe, expect, test } from 'vitest'

describe('searchResource', () => {
  test('should return correct resource content for a valid URI', async () => {
    expect(
      await global.client.readResource({
        uri: 'search://hello',
      }),
    ).toStrictEqual({
      contents: [
        {
          uri: 'search://hello',
          text: 'search hello',
        },
      ],
    })
  })
})
