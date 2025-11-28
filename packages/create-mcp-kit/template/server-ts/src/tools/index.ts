import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { OptionsType } from '@/types'
import registerGetData from './registerGetData'

export const registerTools = (server: McpServer, options: OptionsType) => {
  registerGetData(server, options)
}
