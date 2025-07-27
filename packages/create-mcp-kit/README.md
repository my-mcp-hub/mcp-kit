# create-mcp-kit
A CLI tool to create MCP (Model Context Protocol) applications with ease.

## Features
- 🚀 Quick project scaffolding
- 📦 TypeScript support out of the box
- 🛠️ Built-in development tools
- 🔧 Configurable project templates

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

## Project Structure

```text
The generated project will have the following structure:

├── src/
│   ├── tools/          # MCP tools implementation
│   ├── resources/      # MCP resources implementation
│   ├── prompts/        # MCP prompts implementation
│   ├── services/       # Server implementations (stdio/web)
│   └── index.ts        # Entry point
├── tests/              # Test files
├── scripts/            # Build and development scripts
├── .github/            # GitHub Actions workflows
└── package.json
```

## Development Scripts

- npm run dev - Start the development server in stdio mode
- npm run dev:web - Start the development server in web mode
- npm run build - Build the project
- npm run test - Run tests
- npm run coverage - Generate test coverage report

## Features
### MCP Tools
Implement custom tools that can be used by MCP clients:

```ts
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
    // Your implementation
  }
)
```
### MCP Resources
Define resources that can be accessed by MCP clients:

```ts
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
    // Your implementation
  }
)
```
### MCP Prompts
Create reusable prompts for MCP clients:

```ts
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
    // Your implementation
  }
)
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
