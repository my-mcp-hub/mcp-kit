import type { McpServer } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { documents, getDocumentUri } from '@/data/documents'

const searchResultSchema = z.object({
  matches: z.array(
    z.object({
      id: z.string().describe('Stable identifier of the matching document'),
      title: z.string().describe('Human-readable document title'),
      summary: z.string().describe('Short description of the document'),
      score: z.number().nonnegative().describe('Deterministic relevance score; higher values are more relevant'),
      uri: z.string().describe('URI of the readable MCP resource'),
    }),
  ),
})

const normalize = (value: string) => value.trim().toLocaleLowerCase()

export default function registerSearchDocuments(server: McpServer) {
  server.registerTool(
    'search_documents',
    {
      title: 'Search Documents',
      description: 'Search the built-in MCP knowledge base and return readable resource URIs.',
      inputSchema: z.object({
        query: z.string().trim().min(1).describe('Words to find in the knowledge base'),
        limit: z.number().int().min(1).max(3).default(3).describe('Maximum number of matches'),
      }),
      outputSchema: searchResultSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ query, limit }) => {
      const terms = normalize(query).split(/\s+/).filter(Boolean)
      const matches = documents
        .map(document => {
          const title = normalize(document.title)
          const searchable = normalize(
            [document.title, document.summary, document.keywords.join(' '), document.content].join(' '),
          )
          const score = terms.reduce((total, term) => {
            if (!searchable.includes(term)) return total
            return total + (title.includes(term) ? 3 : 1)
          }, 0)

          return {
            id: document.id,
            title: document.title,
            summary: document.summary,
            score,
            uri: getDocumentUri(document.id),
          }
        })
        .filter(match => match.score > 0)
        .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
        .slice(0, limit)

      const structuredContent = { matches }
      const text =
        matches.length === 0
          ? `No documents matched "${query}".`
          : matches.map(match => `- ${match.title}: ${match.uri}`).join('\n')

      return {
        content: [{ type: 'text', text }],
        structuredContent,
      }
    },
  )
}
