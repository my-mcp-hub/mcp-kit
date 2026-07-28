import type { Client } from '@modelcontextprotocol/client'

interface SearchMatch {
  id: string
  title: string
  summary: string
  score: number
  uri: string
}

const getSearchMatches = (structuredContent: unknown): SearchMatch[] => {
  if (
    typeof structuredContent !== 'object' ||
    structuredContent === null ||
    !Array.isArray((structuredContent as { matches?: unknown }).matches)
  ) {
    throw new Error('search_documents returned invalid structuredContent')
  }
  return (structuredContent as { matches: SearchMatch[] }).matches
}

export async function runKnowledgeBaseDemo(client: Client) {
  const [{ tools }, { resources }, { prompts }] = await Promise.all([
    client.listTools(),
    client.listResources(),
    client.listPrompts(),
  ])

  const searchResult = await client.callTool({
    name: 'search_documents',
    arguments: {
      query: 'transport session',
      limit: 1,
    },
  })
  const [match] = getSearchMatches(searchResult.structuredContent)
  if (!match) {
    throw new Error('No knowledge-base document matched the demo query')
  }

  const resourceResult = await client.readResource({
    uri: match.uri,
  })
  const promptResult = await client.getPrompt({
    name: 'review_document',
    arguments: {
      documentId: match.id,
      focus: 'risks',
    },
  })

  return {
    protocolVersion: client.getNegotiatedProtocolVersion(),
    tools,
    resources,
    prompts,
    searchResult,
    selectedDocument: match,
    resourceResult,
    promptResult,
  }
}
