import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    'echo',
    {
      title: 'Echo Prompt',
      description: 'Creates a prompt to process a message.',
      argsSchema: z.object({
        message: z.string(),
      }),
    },
    ({ message }) => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please process this message: ${message}`,
            },
          },
        ],
      }
    },
  )
}
