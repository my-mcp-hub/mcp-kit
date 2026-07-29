# create-mcp-kit

An interactive CLI for scaffolding ready-to-develop Model Context Protocol servers and clients.

[![npm version](https://img.shields.io/npm/v/create-mcp-kit?color=1677FF&labelColor=black&logo=npm&logoColor=white&style=flat-square)](https://www.npmjs.com/package/create-mcp-kit)
[![build status](https://img.shields.io/github/actions/workflow/status/my-mcp-hub/mcp-kit/build.yml?branch=main&color=1677FF&label=build&labelColor=black&logo=githubactions&logoColor=white&style=flat-square)](https://github.com/my-mcp-hub/mcp-kit/actions/workflows/build.yml)
[![test coverage](https://img.shields.io/codecov/c/github/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&logo=codecov&logoColor=white&style=flat-square)](https://codecov.io/gh/my-mcp-hub/mcp-kit)

## Quick start

```bash
npm create mcp-kit@latest
```

The wizard lets you choose:

- an MCP Server or MCP Client;
- TypeScript or JavaScript;
- STDIO, Streamable HTTP, or both;
- the recommended Standard setup or a Custom plugin selection;
- whether to install dependencies immediately.

Then run the generated project:

```bash
cd mcp-server-starter
npm run dev
```

## Generated workflow

The paired server and client starters contain a complete, deterministic knowledge-base example:

1. Call the `search_documents` tool.
2. Read a returned `kb://documents/{documentId}` Markdown resource.
3. Get the `review_document` prompt with that resource attached.

Server projects can expose the workflow through local STDIO, a Streamable HTTP endpoint at `http://localhost:8401/mcp`, or both. Client projects include matching connection helpers and an end-to-end demo.

## Optional tooling

The Standard setup enables GitHub Actions, Vitest, code-quality tooling, Commitlint, changelog support, and MCP Inspector for server projects. Custom setup lets you select any combination.

Every generated project provides `npm run dev` and `npm run build`. Depending on the selected transports and plugins, it can also provide:

- `npm run dev:stdio`
- `npm run dev:web`
- `npm test`
- `npm run coverage`
- `npm run lint`
- `npm run changelog`

## Documentation

- [What is MCP Kit?](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp-kit)
- [Getting started](https://my-mcp-hub.github.io/mcp-kit/guide/getting-started)
- [Source repository](https://github.com/my-mcp-hub/mcp-kit)

## License

[MIT](https://github.com/my-mcp-hub/mcp-kit/blob/main/LICENSE) © Michael Sun
