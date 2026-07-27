import type { McpServer } from '@modelcontextprotocol/server'
import registerSearchDocuments from './registerSearchDocuments'

export const registerTools = (server: McpServer) => {
  registerSearchDocuments(server)
}
