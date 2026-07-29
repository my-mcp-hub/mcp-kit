---
layout: doc
---

# What is MCP Kit?

MCP Kit is an interactive scaffolding CLI for Model Context Protocol (MCP) applications. It generates ready-to-develop servers and clients whose source code, scripts, tests, and documentation match the choices made in the setup wizard.

## What it generates

MCP Kit supports both sides of an MCP integration:

- **MCP Server** projects register tools, resources, and prompts and expose them over STDIO, Streamable HTTP, or both.
- **MCP Client** projects include connection helpers and a complete example that discovers and uses those server capabilities.

Every project can use TypeScript or JavaScript. The generated code uses modern ES modules and includes build and local development scripts.

## A working example, not an empty shell

The paired server and client templates demonstrate one end-to-end knowledge-base workflow:

1. The client calls the `search_documents` tool.
2. The tool returns structured matches and stable `kb://documents/{documentId}` resource URIs.
3. The client reads the selected Markdown resource.
4. The client gets the `review_document` prompt with that resource attached.

The example is deterministic and does not depend on an external database or API, so it can be used as a runnable reference before you replace it with your own domain logic.

## Transports

- **STDIO** is intended for local, process-based integrations. The generated server communicates through standard input and output.
- **Streamable HTTP** exposes an MCP endpoint at `/mcp`; the generated development server listens on port `8401` by default.

Selecting both transports keeps their implementations separate and adds a script for each one.

## Standard and custom setups

The **Standard** setup enables the recommended engineering stack:

- GitHub Actions
- Vitest
- MCP Inspector for server projects
- ESLint, Prettier, and lint-staged
- Commitlint
- changelog tooling

The **Custom** setup lets you select any combination of those plugins, including none of them.

## Next step

Continue to [Getting Started](./getting-started.md) to generate and run a project.
