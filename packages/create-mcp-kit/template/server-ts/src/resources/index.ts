import { type McpServer, ResourceTemplate } from '@modelcontextprotocol/server'
import type { OptionsType } from '@/types'

export const registerResources = (server: McpServer, options: OptionsType) => {
  server.registerResource(
    'search',
    new ResourceTemplate('search://{keyword}', {
      list: undefined,
    }),
    {
      title: 'Search Resource',
      description: 'Dynamic generate search resource',
    },
    async (uri, { keyword }) => {
      return {
        contents: [
          {
            uri: uri.href,
            text: `search ${keyword}`,
          },
        ],
      }
    },
  )
}
