export interface KnowledgeDocument {
  id: string
  title: string
  summary: string
  keywords: string[]
  content: string
  lastModified: string
}

export const documents: KnowledgeDocument[] = [
  {
    id: 'mcp-overview',
    title: 'MCP Server Primitives and Control Boundaries',
    summary: 'Explains the responsibilities, control model, and composition of tools, resources, and prompts.',
    keywords: ['mcp', 'tool', 'resource', 'prompt', 'architecture', 'control', 'primitive'],
    lastModified: '2026-07-27T00:00:00.000Z',
    content: `# MCP Server Primitives and Control Boundaries

MCP servers expose three core primitives: tools, resources, and prompts. Their primary distinction is not the shape of the data they return, but who controls their use and which responsibility each primitive owns.

## Tools: Model-Controlled Actions

Tools are model-controlled functions that allow a language model to perform actions or retrieve information. Examples include searching documents, running calculations, and creating work items. A tool should have a stable name, a clear description, and valid JSON Schema definitions for its expected input and, when applicable, its structured output. If a tool defines an output schema, its structured content must conform to that schema. A text content block should also be returned as a human-readable representation and compatibility fallback.

## Resources: Application-Controlled Context

Resources are application-controlled contextual data that clients can discover, select, and attach to a model interaction. Examples include documents, configuration, and database records. Every resource has a unique URI, and resource contents should declare an appropriate MIME type. A custom URI scheme must follow RFC 3986. Data whose primary purpose is to provide context should normally be exposed as a resource instead of being hidden behind a read-only tool.

## Prompts: User-Controlled Templates

Prompts are user-controlled templates. They are exposed so that a user can explicitly select a reusable workflow, such as reviewing a document or drafting release notes. A prompt can accept arguments and include embedded resources, allowing server-managed reference content and task instructions to be delivered together.

## Composing the Primitives

A coherent workflow can call a tool to search for a document, read the resource URI returned in the tool's structured content, and then retrieve a prompt that asks the model to summarize the same document, assess risks, or extract action items. This composition preserves clear control boundaries and prevents clients from scraping display text for application data.`,
  },
  {
    id: 'transport-and-lifecycle',
    title: 'MCP Transports and Server Lifecycle',
    summary: 'Covers stdio, Streamable HTTP, the stateless 2026-07-28 protocol core, and graceful shutdown.',
    keywords: ['stdio', 'http', 'streamable', 'transport', 'session', 'stateless', '0728', 'lifecycle'],
    lastModified: '2026-07-27T00:00:00.000Z',
    content: `# MCP Transports and Server Lifecycle

A transport defines how a client and server exchange MCP messages. It should not change the semantics of the tools, resources, and prompts exposed by the server. This starter supports both stdio and Streamable HTTP and runs the same behavioral checks against each transport.

## stdio

The stdio transport is designed for local process integrations. A client launches the MCP server as a subprocess and exchanges protocol messages over standard input and standard output. The server must not write ordinary logs to stdout because that would corrupt the protocol stream; diagnostic output should be written to stderr. On termination, the process should close the MCP connection and release owned resources.

## Streamable HTTP

Streamable HTTP is suitable for remote services and web deployments. The HTTP route should be handled by the SDK's transport implementation. Production deployments should also apply authorization, Origin and Host validation, request-size limits, and appropriate network security. During graceful shutdown, the service should stop accepting new work, allow in-flight requests to finish, and then close the underlying HTTP server.

## Stateless Protocol Core

The 2026-07-28 protocol revision removes protocol-level sessions and the Mcp-Session-Id header from Streamable HTTP. A server cannot rely on implicit per-connection state to relate requests. Cross-call state should use an explicit, server-minted handle returned from one tool and accepted as an ordinary argument by later tools. Stable resource URIs and domain identifiers should be passed explicitly as well.

## Implementation Guidance

A server factory should be able to create independent instances, and list operations should produce deterministic results. Immutable built-in data may be shared safely, while user-owned state belongs in an external store keyed by explicit identifiers. Any server instance should be able to process a self-contained request, and equivalent requests should produce structurally consistent results over either transport.`,
  },
  {
    id: 'schema-and-errors',
    title: 'MCP Schemas, Structured Content, and Error Handling',
    summary: 'Explains input and output schemas, structured content, tool execution errors, and resource errors.',
    keywords: ['schema', 'structuredcontent', 'iserror', 'validation', 'error', 'security', 'json-rpc'],
    lastModified: '2026-07-27T00:00:00.000Z',
    content: `# MCP Schemas, Structured Content, and Error Handling

Reliable MCP implementations distinguish request validation, successful domain results, tool execution errors, and protocol errors. Clients should consume declared schemas and structured fields instead of parsing human-readable display text for application data.

## Input and Output Schemas

A tool's input schema is a JSON Schema object that defines its expected parameters. An optional output schema defines the structure of the tool's structured content. When an output schema is present, the server must return structured content that conforms to it. The result should also include a concise text content block so models and clients that do not consume structured content still receive a useful representation.

## Protocol Errors and Tool Execution Errors

Protocol errors describe failures in the request or protocol operation, such as an unknown tool or a malformed request. Tool execution errors provide actionable feedback that a model may use to correct a call; they are returned as tool results with isError set to true. A valid search that finds no matches is still successful and should return an empty matches array rather than an error.

## Resource Errors

Reading a URI that does not identify an available resource should produce a protocol-level Resource Not Found error. A server should not return a successful resource whose text merely says "not found," because clients would be unable to distinguish real content from a failed lookup.

## Security and Predictability

Tool annotations may describe read-only, destructive, idempotent, and open-world behavior, but clients must treat those annotations as untrusted unless the server itself is trusted. Annotations do not replace authorization or validation. Error messages should not expose credentials, internal paths, or stack traces. Stable schemas and deterministic list ordering improve validation, client-side caching, and language-model prompt cache hit rates.`,
  },
]

export const getDocument = (id: string) => documents.find(document => document.id === id)

export const getDocumentUri = (id: string) => `kb://documents/${id}`
