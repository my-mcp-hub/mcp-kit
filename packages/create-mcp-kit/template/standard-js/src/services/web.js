import { nanoid } from 'nanoid'
import express from 'express'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'

export async function webServer(server, options) {
  const app = express()
  app.use(express.json())

  const transports = {
    streamable: {},
    sse: {},
  }
  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id']
    let transport

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

  const handleSessionRequest = async (req, res) => {
    const sessionId = req.headers['mcp-session-id']
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
    const sessionId = req.query.sessionId
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
