---
url: /mcp-kit/guide/getting-started.md
---

# Getting Started

## Prerequisites

* [Node.js](https://nodejs.org/) 22 or later
* A terminal and npm, pnpm, Yarn, Bun, or Deno

MCP Kit and the generated templates use modern ES modules. Generated projects include an `.nvmrc` set to Node.js 22.

## Create a project

Run the CLI without installing it globally:

::: code-group

```sh [npm]
npm create mcp-kit@latest
```

```sh [pnpm]
pnpm create mcp-kit
```

```sh [yarn]
yarn create mcp-kit
```

```sh [Bun]
bun create mcp-kit
```

```sh [Deno]
deno init --npm mcp-kit
```

:::

## Setup wizard

The interactive wizard asks for the project:

```ansi
[90m┌[39m  [1m[36mMCP Kit - The Modern Context Protocol Builder[0m
[90m│[39m
[32m◇[39m  Project type:
[90m│[39m  [2mMCP Server[0m
[90m│[39m
[32m◇[39m  Project name:
[90m│[39m  [2mmcp-server-starter[0m
[90m│[39m
[32m◇[39m  Project language:
[90m│[39m  [2mTypeScript[0m
[90m│[39m
[32m◇[39m  Project transport type:
[90m│[39m  [2mSTDIO[0m
[90m│[39m
[32m◇[39m  Project template:
[90m│[39m  [2mStandard (recommended)[0m
[90m│[39m
[32m◇[39m  Do you want to install dependencies?
[90m│[39m  [2mYes[0m
[90m│[39m
[90m└[39m  Project created successfully!

```

1. **Type** — MCP Server or MCP Client.
2. **Name** — defaults to `mcp-server-starter` or `mcp-client-starter`.
3. **Language** — TypeScript or JavaScript.
4. **Transport** — STDIO, Streamable HTTP, or both.
5. **Template** — Standard or Custom.
6. **Plugins** — shown for Custom projects. Choose GitHub Actions, Vitest, MCP Inspector (server only), style tooling, Commitlint, and changelog tooling in any combination.
7. **Dependency installation** — install immediately or leave it for later.

The Standard template enables all recommended plugins. Server projects also receive MCP Inspector.

::: info
The target directory must not already exist. The CLI stops without overwriting it if a directory with the selected project name is present.
:::

## Run the generated project

If the wizard installed dependencies:

```sh
cd mcp-server-starter
npm run dev
```

Otherwise, install first:

```sh
cd mcp-server-starter
npm install
npm run dev
```

`npm run dev` starts the selected default transport. For servers:

| Selected transport | Available scripts             | Default         |
| ------------------ | ----------------------------- | --------------- |
| STDIO              | `dev`, `dev:stdio`            | STDIO           |
| Streamable HTTP    | `dev`, `dev:web`              | Streamable HTTP |
| Both               | `dev`, `dev:stdio`, `dev:web` | STDIO           |

The Streamable HTTP development server listens on port `8401` and exposes its MCP endpoint at `http://localhost:8401/mcp`. Set `PORT` to change the server port.

Client projects use `npm run dev`. Their HTTP connection defaults to the same endpoint and can be changed with `MCP_SERVER_URL`.

## Generated server

A TypeScript server generated with both transports has this core structure:

```text
src/
├── assets/                  # Packaged static assets
├── constants/
├── data/
│   └── documents.ts         # Deterministic example knowledge base
├── prompts/
│   └── index.ts             # review_document prompt
├── resources/
│   └── index.ts             # kb://documents/{documentId}
├── services/
│   ├── index.ts             # Server factory and registration
│   ├── stdio.ts             # STDIO transport
│   └── web.ts               # Streamable HTTP transport
├── tools/
│   ├── index.ts
│   └── registerSearchDocuments.ts
├── types/
├── utils/
└── index.ts                 # Command-line entry point
```

Transport files that were not selected are removed during generation. JavaScript projects use the same layout with `.js` files.

The starter demonstrates a complete MCP workflow:

1. `search_documents` searches three built-in MCP guides and returns text plus structured results.
2. Each match links to a `kb://documents/{documentId}` Markdown resource.
3. `review_document` attaches the selected resource to a reusable review prompt.

## Generated client

The client keeps protocol and transport responsibilities separate:

```text
src/
├── client.ts                # MCP Client factory
├── knowledgeBaseDemo.ts     # End-to-end protocol workflow
├── transports.ts            # Selected connection helpers
└── index.ts                 # Exports and runnable demo
```

For STDIO, the demo starts `@my-mcp-hub/node-mcp-server` by default. Pass different process options to `runStdioDemo` to connect another server. For Streamable HTTP, start a compatible server before running the client.

## Development scripts

Every generated project includes:

* `npm run dev` — watch source files and run the application.
* `npm run build` — type-check TypeScript projects and bundle the application into `build/`.

Selected plugins add:

* `npm test` and `npm run coverage` with Vitest.
* `npm run lint` with the style plugin.
* `npm run changelog` with the changelog plugin.
* Git hooks and commit checks with the style and Commitlint plugins.

The generated test suite for a client expects the paired server at `../mcp-server-starter`.
