import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

export const registerResources = (server, options) => {
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
