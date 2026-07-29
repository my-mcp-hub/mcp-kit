<p align="center">
  <a href="https://my-mcp-hub.github.io/mcp-kit/" target="_blank" rel="noopener noreferrer">
    <img width="960" src="https://raw.githubusercontent.com/my-mcp-hub/mcp-kit/main/docs/public/readme-hero.webp" alt="mcp-kit CLI generating a ready-to-develop MCP project" />
  </a>
</p>

<h1 align="center">mcp-kit</h1>

<p align="center">
  An interactive CLI for scaffolding ready-to-develop Model Context Protocol servers and clients.
</p>

<p align="center">
  <a href="https://my-mcp-hub.github.io/mcp-kit/">Documentation</a>
  ·
  <a href="https://my-mcp-hub.github.io/mcp-kit/guide/getting-started">Getting started</a>
  ·
  <a href="https://github.com/my-mcp-hub/mcp-kit/issues">Issues</a>
  ·
  <a href="https://github.com/my-mcp-hub/mcp-kit/blob/main/packages/create-mcp-kit/CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-mcp-kit"><img src="https://img.shields.io/npm/v/create-mcp-kit?color=1677FF&labelColor=black&logo=npm&logoColor=white&style=flat-square" alt="npm version" /></a>
  <a href="https://github.com/my-mcp-hub/mcp-kit/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/my-mcp-hub/mcp-kit/build.yml?branch=main&color=1677FF&label=build&labelColor=black&logo=githubactions&logoColor=white&style=flat-square" alt="build status" /></a>
  <a href="https://codecov.io/gh/my-mcp-hub/mcp-kit"><img src="https://img.shields.io/codecov/c/github/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&logo=codecov&logoColor=white&style=flat-square" alt="test coverage" /></a>
  <a href="https://github.com/my-mcp-hub/mcp-kit/blob/main/LICENSE"><img src="https://img.shields.io/github/license/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&style=flat-square" alt="MIT license" /></a>
</p>

## Overview

`mcp-kit` turns the repetitive setup around an MCP application into a short, guided workflow. Choose what you are building, select a language and transport, then decide how much engineering infrastructure you want. The CLI writes a working project that follows the same choices all the way through its source, scripts, tests, and documentation.

It is designed for both sides of an MCP integration:

| Project        | What the generated starter provides                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| **MCP Server** | A structured server with tools, resources, prompts, lifecycle handling, and the transports you selected          |
| **MCP Client** | A client with connection helpers and an end-to-end example that discovers and uses tools, resources, and prompts |

## Why mcp-kit?

- **Start with a real MCP workflow** — generated starters include working protocol primitives and a small knowledge-base example, not an empty entry file.
- **Build either side** — create a server or a client from the same CLI.
- **Choose your runtime shape** — use TypeScript or JavaScript with STDIO, Streamable HTTP, or both.
- **Keep only the tooling you need** — start with the recommended setup or select individual plugins.
- **Develop immediately** — generated scripts cover local development, production builds, linting, testing, and coverage when enabled.
- **Stay close to the protocol** — server templates separate tools, resources, prompts, and transports into focused modules.

## Quick start

Run the CLI with your package manager:

```bash
npm create mcp-kit@latest
```

```bash
pnpm create mcp-kit
```

```bash
yarn create mcp-kit
```

`bun create mcp-kit` and `deno init --npm mcp-kit` are also supported.

The interactive setup asks for:

| Choice       | Options                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Project type | MCP Server · MCP Client                                                                                 |
| Language     | TypeScript · JavaScript                                                                                 |
| Transport    | STDIO · Streamable HTTP · both                                                                          |
| Template     | Standard · Custom                                                                                       |
| Plugins      | GitHub Actions · Vitest · MCP Inspector (server) · ESLint/Prettier/Lint-staged · Commitlint · Changelog |
| Dependencies | Install now · install later                                                                             |

After generation:

```bash
cd mcp-server-starter
npm run dev
```

## What gets generated

The exact output follows your answers. A TypeScript server with both transports uses a structure like this:

```text
src/
├── data/                 # Example knowledge-base data
├── prompts/              # User-controlled prompt templates
├── resources/            # Application-controlled context
├── services/
│   ├── stdio.ts          # Local process transport
│   └── web.ts            # Streamable HTTP transport
├── tools/                # Model-controlled actions
├── types/
├── utils/
└── index.ts              # CLI entry point
```

Depending on the selected plugins, the project can also include Vitest, GitHub Actions, MCP Inspector, lint and formatting rules, Git hooks, commit checks, and changelog tooling.

## Server starter

The server template demonstrates how the three MCP primitives work together:

1. `search_documents` searches the starter knowledge base and returns structured results with stable resource URIs.
2. `kb://documents/{documentId}` exposes the matching document as an MCP resource.
3. `review_document` packages that resource into a reusable review prompt.

The same server can be generated for local STDIO integrations, a Streamable HTTP endpoint at `/mcp`, or both.

Common development commands:

```bash
npm run dev       # start the default development transport
npm run dev:stdio # start the STDIO server, when selected
npm run dev:web   # start the Streamable HTTP server, when selected
npm run build
```

## Client starter

The client template includes transport-specific connection helpers and an end-to-end demo that:

- negotiates the protocol version;
- lists tools, resources, and prompts;
- calls `search_documents`;
- reads the returned resource URI;
- retrieves the `review_document` prompt;
- closes the client connection cleanly.

Use it as a runnable reference or as the base for your own MCP host integration.

## Standard or custom setup

The **Standard** template is the fast path. It enables GitHub Actions, Vitest, code-quality tooling, commit checks, changelog support, and MCP Inspector for server projects.

Choose **Custom** when you want a smaller starter and select only the plugins that belong in your workflow.

## Documentation

- [What is MCP Kit?](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp-kit)
- [Getting started](https://my-mcp-hub.github.io/mcp-kit/guide/getting-started)
- [What is MCP?](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp)

## Contributing

Contributions and bug reports are welcome. [Open an issue](https://github.com/my-mcp-hub/mcp-kit/issues/new/choose) or submit a pull request, and follow the project [Code of Conduct](https://github.com/my-mcp-hub/mcp-kit/blob/main/CODE_OF_CONDUCT.md).

### Contributors

<a href="https://github.com/my-mcp-hub/mcp-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=my-mcp-hub/mcp-kit" alt="mcp-kit contributors" />
</a>

## License

[MIT](https://github.com/my-mcp-hub/mcp-kit/blob/main/LICENSE) © Michael Sun
