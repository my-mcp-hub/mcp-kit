# Create-MCP-Kit
A CLI tool to create MCP (Model Context Protocol) applications with ease.

[![][npm-release-shield]][npm-release-link]
[![][codecov-shield]][codecov-link]
[![][github-release-date-shield]][github-release-date-link]
[![][github-action-build-shield]][github-action-build-link]
[![][github-license-shield]][github-license-link]

## Features
- 🚀 Quick project scaffolding
- 📦 TypeScript support out of the box
- 🛠️ Built-in development tools
- 🔧 Configurable project templates
- 🌐 Multiple Transport Modes (stdio/streamable-http/sse)
- 📚 Comprehensive APIs

## Usage

```bash
npm create mcp-kit@latest
```

or

```bash
yarn create mcp-kit@latest
```

or

```bash
pnpm create mcp-kit@latest
```

## Project Types

create-mcp-kit supports generating two types of projects:

### MCP Server

Create an MCP server that provides tools, resources, and prompts for MCP clients.

#### Server Project Structure

```text
The generated server project will have the following structure:

├── src/
│   ├── tools/          # MCP tools implementation
│   │   ├── index.ts    # Tools registration
│   │   └── register*.ts # Individual tool implementations
│   ├── resources/      # MCP resources implementation
│   │   └── index.ts    # Resources registration
│   ├── prompts/        # MCP prompts implementation
│   │   └── index.ts    # Prompts registration
│   ├── services/       # Server implementations
│   │   ├── stdio.ts    # STDIO transport implementation
│   │   └── web.ts      # Streamable HTTP and SSE transport implementation
│   └── index.ts        # Entry point
├── tests/              # Test files (optional)
├── scripts/            # Build and development scripts
├── .github/            # GitHub Actions workflows (optional)
├── .husky/             # Git hooks (optional)
└── package.json
```

#### Server Development Scripts

- `npm run dev` - Start the development server in stdio mode
- `npm run dev:web` - Start the development server in web mode
- `npm run build` - Build the project
- `npm run test` - Run tests (if vitest plugin is selected)
- `npm run coverage` - Generate test coverage report (if vitest plugin is selected)
- `npm run lint` - Run linting (if style plugin is selected)

### MCP Client

Create an MCP client that connects to MCP servers and uses their tools, resources, and prompts.

#### Client Project Structure

```text
The generated client project will have the following structure:

├── src/
│   └── index.ts        # Entry point with transport implementations
├── tests/              # Test files (optional)
├── scripts/            # Build and development scripts
├── .github/            # GitHub Actions workflows (optional)
├── .husky/             # Git hooks (optional)
└── package.json
```

#### Client Development Scripts

- `npm run dev` - Start the client in development mode
- `npm run build` - Build the project
- `npm run test` - Run tests (if vitest plugin is selected)
- `npm run coverage` - Generate test coverage report (if vitest plugin is selected)
- `npm run lint` - Run linting (if style plugin is selected)

## Features

### MCP Server Features

#### Transport Modes

MCP Server supports three transport modes:

1. **STDIO**: Communication through standard input/output streams
2. **Streamable HTTP**: RESTful API with streaming capabilities
3. **SSE (Server-Sent Events)**: Real-time event streaming from server to client

#### MCP Tools
Implement custom tools that can be used by MCP clients:

```ts
// Full implementation example
import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export default function register(server, options) {
  server.registerTool(
    'GetData',
    {
      title: 'Get Data',
      description: 'Get Data',
      inputSchema: {
        keyword: z.string().describe('search keyword'),
      },
    },
    async ({ keyword }) => {
      const { success, data, message } = await getData(keyword, options)
      return {
        content: [
          {
            type: 'text',
            text: success ? data : message,
          },
        ],
      }
    },
  )
}

export const getData = async (keyword, options) => {
  if (!keyword || keyword === 'error') {
    return {
      success: false,
      message: 'Invalid keyword',
    }
  }

  return {
    success: true,
    data: `Data for ${keyword}`,
  }
}
```

#### MCP Resources
Define resources that can be accessed by MCP clients:

```ts
// Full implementation example
import { type McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { OptionsType } from '@/types'

export const registerResources = (server: McpServer, options: OptionsType) => {
  server.registerResource(
    'search',
    new ResourceTemplate('search://{keyword}', {
      list: undefined,
    }),
    {
      title: 'Search Resource',
      description: 'Dynamic generate search resource',
    },
    async (uri, { keyword }) => {
      return {
        contents: [
          {
            uri: uri.href,
            text: `search ${keyword}`,
          },
        ],
      }
    },
  )
}
```

#### MCP Prompts
Create reusable prompts for MCP clients:

```ts
// Full implementation example
import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export const registerPrompts = (server: McpServer) => {
  server.registerPrompt(
    'echo',
    {
      title: 'Echo Prompt',
      description: 'Creates a prompt to process a message.',
      argsSchema: {
        message: z.string(),
      },
    },
    ({ message }) => {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please process this message: ${message}`,
            },
          },
        ],
      }
    },
  )
}
```

### MCP Client Features

#### Multiple Transport Modes
Connect to MCP servers using different transport modes:

```ts
// Import the MCP client
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/transports/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/transports/streamable-http.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/transports/sse.js'

// Create a new MCP client
const client = new McpClient()

// STDIO Transport
const stdioClientTransport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@my-mcp-hub/node-mcp-server'],
  env: process.env,
})
await client.connect(stdioClientTransport)

// Streamable HTTP Transport
const streamableBaseUrl = new URL('http://localhost:8401/mcp')
const streamableClientTransport = new StreamableHTTPClientTransport(streamableBaseUrl)
await client.connect(streamableClientTransport)

// SSE Transport
const sseBaseUrl = new URL('http://localhost:8401/sse')
const sseClientTransport = new SSEClientTransport(sseBaseUrl)
await client.connect(sseClientTransport)
```

#### Tool Calling
Call tools provided by MCP servers:

```ts
// List available tools
const tools = await client.listTools()
console.log(tools)

// Call a tool
const callResult = await client.callTool({
  name: 'GetData',
  arguments: {
    keyword: 'Hello',
  },
})
console.log(callResult.content)
```

#### Resource Access
Access resources provided by MCP servers:

```ts
// List available resources
const resources = await client.listResources()
console.log(resources)

// Get a resource
const resource = await client.getResource('search://example')
console.log(resource.contents)
```

#### Prompt Usage
Use prompts provided by MCP servers:

```ts
// List available prompts
const prompts = await client.listPrompts()
console.log(prompts)

// Use a prompt
const prompt = await client.getPrompt('echo', { message: 'Hello, world!' })
console.log(prompt.messages)
```

## Contributing

Feel free to dive in! [Open an issue](https://github.com/my-mcp-hub/mcp-kit/issues/new/choose) or submit PRs.

Standard Readme follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

### Contributors

This project exists thanks to all the people who contribute.

<a href="https://github.com/my-mcp-hub/mcp-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=my-mcp-hub/mcp-kit" />
</a>

## License

[MIT](LICENSE) © MichaelSun

[npm-release-link]: https://www.npmjs.com/package/create-mcp-kit
[npm-release-shield]: https://img.shields.io/npm/v/create-mcp-kit?color=1677FF&labelColor=black&logo=npm&logoColor=white&style=flat-square
[codecov-link]: https://coveralls.io/github/my-mcp-hub/mcp-kit?branch=main
[codecov-shield]: https://img.shields.io/coverallsCoverage/github/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&style=flat-square&logo=codecov&logoColor=white
[github-release-date-link]: https://github.com/my-mcp-hub/mcp-kit/releases
[github-release-date-shield]: https://img.shields.io/github/release-date/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&style=flat-square
[github-action-build-link]: https://github.com/my-mcp-hub/mcp-kit/actions/workflows/build.yml
[github-action-build-shield]: https://img.shields.io/github/actions/workflow/status/my-mcp-hub/mcp-kit/build.yml?branch=main&color=1677FF&label=build&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-license-link]: https://github.com/my-mcp-hub/mcp-kit/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/github/license/my-mcp-hub/mcp-kit?color=1677FF&labelColor=black&style=flat-square
