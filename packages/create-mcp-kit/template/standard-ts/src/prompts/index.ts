import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    'echo',
    {
      title: 'Echo Prompt',
      description: 'Creates a prompt to process a message.',
      argsSchema: {
        message: z.string(),
      },
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
