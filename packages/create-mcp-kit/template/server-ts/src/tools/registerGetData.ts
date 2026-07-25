import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import type { OptionsType } from '@/types'

export default function register(server: McpServer, options: OptionsType) {
  server.registerTool(
    'GetData',
    {
      title: 'Get Data',
      description: 'Get Data',
      inputSchema: z.object({
        keyword: z.string().describe('search keyword'),
      }),
    },
    async ({ keyword }) => {
      const { success, data, message } = await getData(keyword, options)
      return {
        content: [
          {
            type: 'text',
            text: success ? data! : message!,
          },
        ],
      }
    },
  )
}

export const getData = async (keyword: string, options: OptionsType) => {
  if (!keyword || keyword === 'error') {
    return {
      success: false,
      message: 'not found',
    }
  }
  return {
    success: true,
    data: `keyword: ${keyword};`,
  }
}
