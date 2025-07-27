import { nanoid } from 'nanoid'
import express from 'express'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import type { OptionsType } from '@/types'

export async function webServer(server: McpServer, options: OptionsType) {
  const app = express()
  app.use(express.json())

  const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>,
  }
  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport

    if (sessionId && transports.streamable[sessionId]) {
      transport = transports.streamable[sessionId]
    } else if (!sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => nanoid(),
        onsessioninitialized: sessionId => {
          transports.streamable[sessionId] = transport
        },
      })

      transport.onclose = () => {
        if (transport.sessionId) {
          delete transports.streamable[transport.sessionId]
        }
      }
      await server.connect(transport)
    } else {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      })
      return
    }

    await transport.handleRequest(req, res, req.body)
  })

  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    if (!sessionId || !transports.streamable[sessionId]) {
      res.status(400).send('Invalid or missing session ID')
      return
    }

    const transport = transports.streamable[sessionId]
    await transport.handleRequest(req, res)
  }

  app.get('/mcp', handleSessionRequest)

  app.delete('/mcp', handleSessionRequest)

  app.get('/sse', async (req, res) => {
    const transport = new SSEServerTransport('/messages', res)
    transports.sse[transport.sessionId] = transport

    res.on('close', () => {
      delete transports.sse[transport.sessionId]
    })

    await server.connect(transport)
  })

  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string
    const transport = transports.sse[sessionId]
    if (transport) {
      await transport.handlePostMessage(req, res, req.body)
    } else {
      res.status(400).send('No transport found for sessionId')
    }
  })

  app.listen(options.port)
  console.log(`MCP server started on port ${options.port}. SSE endpoint: /sse, streamable endpoint: /mcp`)
}
