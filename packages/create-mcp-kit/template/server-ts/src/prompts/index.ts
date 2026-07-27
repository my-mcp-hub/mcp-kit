import { completable, type McpServer, ProtocolError, ProtocolErrorCode } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { documents, getDocument, getDocumentUri } from '@/data/documents'

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    'review_document',
    {
      title: 'Review Document',
      description: 'Review one knowledge-base document with a selected focus.',
      argsSchema: z.object({
        documentId: completable(z.string().describe('Knowledge-base document identifier'), value =>
          documents.map(document => document.id).filter(id => id.startsWith(value)),
        ),
        focus: z.enum(['summary', 'risks', 'actions']).default('summary'),
      }),
    },
    ({ documentId, focus }) => {
      const document = getDocument(documentId)
      if (!document) {
        throw new ProtocolError(ProtocolErrorCode.InvalidParams, `Unknown document: ${documentId}`, {
          documentId,
        })
      }

      const focusInstructions = {
        summary: 'Summarize the core ideas and preserve the important technical distinctions.',
        risks: 'Identify incorrect usage risks, ambiguous guidance, and likely implementation mistakes.',
        actions: 'Extract a prioritized list of concrete implementation actions.',
      }

      return {
        description: `Review ${document.title}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Review the attached document. ${focusInstructions[focus]} Respond in English with clear headings and concise recommendations.`,
            },
          },
          {
            role: 'user',
            content: {
              type: 'resource',
              annotations: {
                audience: ['user', 'assistant'],
                priority: 0.8,
                lastModified: document.lastModified,
              },
              resource: {
                uri: getDocumentUri(document.id),
                mimeType: 'text/markdown',
                text: document.content,
              },
            },
          },
        ],
      }
    },
  )
}
