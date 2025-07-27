import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerTools } from '@/tools'
import { registerResources } from '@/resources'
import { registerPrompts } from '@/prompts'
import { stdioServer } from './stdio'
import { webServer } from './web'
import type { OptionsType } from '@/types'

const createServer = (options: OptionsType) => {
  const server = new McpServer({
    name: options.name,
    version: options.version,
  })
  registerTools(server, options)
  registerResources(server, options)
  registerPrompts(server)
  return server
}

export async function startStdioServer(options: OptionsType) {
  const server = createServer(options)
  await stdioServer(server)
}

export async function startWebServer(options: OptionsType) {
  const server = createServer(options)
  await webServer(server, options)
}
