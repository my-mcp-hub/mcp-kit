import 'dotenv/config'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const serverParams = new StdioClientTransport({
  command: 'nyc',
  args: [
    '--merge-async',
    '--reporter=lcov',
    '--reporter=text',
    'tsx',
    './src/index.ts'
  ],
  env: {
    ...process.env as Record<string, string>,
    NODE_V8_COVERAGE: './coverage/tmp',
  },
})
const client = new Client({
  name: 'test-mcp-client',
  version: '1.0.0',
})
await client.connect(serverParams)

global.client = client
