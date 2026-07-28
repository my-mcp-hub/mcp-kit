const getSearchMatches = structuredContent => {
  if (
    typeof structuredContent !== 'object' ||
    structuredContent === null ||
    !Array.isArray(structuredContent.matches)
  ) {
    throw new Error('search_documents returned invalid structuredContent')
  }
  return structuredContent.matches
}

export async function runKnowledgeBaseDemo(client) {
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
