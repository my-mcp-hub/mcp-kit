import { type McpServer, ResourceNotFoundError, ResourceTemplate } from '@modelcontextprotocol/server'
import { documents, getDocument, getDocumentUri } from '@/data/documents'

export const registerResources = (server: McpServer) => {
  server.registerResource(
    'knowledge-document',
    new ResourceTemplate('kb://documents/{documentId}', {
      list: async () => ({
        resources: documents.map(document => ({
          name: document.id,
          title: document.title,
          description: document.summary,
          uri: getDocumentUri(document.id),
          mimeType: 'text/markdown',
          annotations: {
            audience: ['user', 'assistant'],
            priority: 0.8,
            lastModified: document.lastModified,
          },
        })),
      }),
      complete: {
        documentId: value => documents.map(document => document.id).filter(id => id.startsWith(value)),
      },
    }),
    {
      title: 'Knowledge Document',
      description: 'A document in the built-in MCP knowledge base.',
      mimeType: 'text/markdown',
      cacheHint: {
        ttlMs: 3_600_000,
        cacheScope: 'public',
      },
    },
    async (uri, { documentId }) => {
      const document = getDocument(String(documentId))
      if (!document) {
        throw new ResourceNotFoundError(uri.href)
      }

      return {
        contents: [
          {
            uri: uri.href,
            name: document.id,
            title: document.title,
            mimeType: 'text/markdown',
            text: document.content,
          },
        ],
      }
    },
  )
}
