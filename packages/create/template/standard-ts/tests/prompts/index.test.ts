import { describe, expect, test } from 'vitest'

describe('echoPrompt', () => {
  test('should return correct prompt content for a valid argument', async () => {
    expect(
      await global.client.getPrompt({
        name: 'echo',
        arguments: {
          message: 'hello',
        },
      }),
    ).toStrictEqual({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Please process this message: hello',
          },
        },
      ],
    })
  })
})
