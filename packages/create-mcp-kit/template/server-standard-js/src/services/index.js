import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerTools } from '../tools/index.js'
import { registerResources } from '../resources/index.js'
import { registerPrompts } from '../prompts/index.js'
import { stdioServer } from './stdio.js'
import { webServer } from './web.js'

const createServer = options => {
  const server = new McpServer({
    name: options.name,
    version: options.version,
  })
  registerTools(server, options)
  registerResources(server, options)
  registerPrompts(server)
  return server
}

export async function startStdioServer(options) {
  const server = createServer(options)
  await stdioServer(server)
}

export async function startWebServer(options) {
  const server = createServer(options)
  await webServer(server, options)
}
