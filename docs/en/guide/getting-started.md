---
layout: doc
---

# Getting Started

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher.
- Terminal for accessing MCP Kit via its command line interface (CLI).

MCP Kit can be used to create new MCP (Model Context Protocol) applications. You can install and use it with any of the following package managers:

::: code-group
```sh [npm]
$ npm create mcp-kit@latest
```

```sh [pnpm]
$ pnpm create mcp-kit@latest
```

```sh [yarn]
$ yarn create mcp-kit@latest
```
:::

::: tip NOTE
MCP Kit is an ESM-only package. It requires Node.js version 18 or higher and uses modern JavaScript features.
:::

## Setup Wizard

When you run the create command, MCP Kit will launch an interactive setup wizard that guides you through creating a new project:

<<< @/snippets/init.ansi

1. First, you'll be prompted to select a **Project type**:
   - **MCP Server**: Creates a server that provides tools, resources, and prompts for MCP clients
   - **MCP Client**: Creates a client that connects to MCP servers

2. Next, you'll be asked to provide a **Project name** (defaults to `mcp-[type]-starter`)

3. Choose your preferred **Project language**:
   - **TypeScript** (recommended)
   - **JavaScript**

4. Select **Project transport type** (multiple options can be selected):
   - **STDIO**: Communication through standard input/output streams
   - **Streamable HTTP**: RESTful API with streaming capabilities
   - **SSE**: Server-Sent Events for real-time communication

5. Choose a **Project template**:
   - **Standard**: Includes recommended plugins and configurations
   - **Custom**: Allows you to select specific plugins

6. If you selected **Custom** template, you'll be prompted to select **Project plugins**:
   - **GitHub Action**: CI/CD workflows
   - **Vitest**: Testing framework
   - **Inspector**: Debugging tools (server projects only)
   - **ESLint + Prettier + Lint-staged**: Code quality tools
   - **Commitlint**: Commit message linting
   - **Changelog**: Automated changelog generation

7. Finally, you'll be asked if you want to **install dependencies** automatically

After completing these steps, MCP Kit will create your project with the selected configuration.

## File Structure

The generated file structure depends on the project type you selected.

### MCP Server Project Structure

```
├── src/
│   ├── tools/             # MCP tools implementation
│   │   ├── index.ts       # Tools registration
│   │   └── register*.ts   # Individual tool implementations
│   ├── resources/         # MCP resources implementation
│   │   └── index.ts       # Resources registration
│   ├── prompts/           # MCP prompts implementation
│   │   └── index.ts       # Prompts registration
│   ├── services/          # Server implementations
│   │   ├── stdio.ts       # STDIO transport implementation
│   │   └── web.ts         # Streamable HTTP and SSE transport implementation
│   └── index.ts           # Entry point
├── tests/                 # Test files (optional)
├── scripts/               # Build and development scripts
├── .github/               # GitHub Actions workflows (optional)
├── .husky/                # Git hooks (optional)
├── .prettierrc            # Prettier configuration (optional)
├── changelog-option.js    # Conventional changelog config (optional)
├── commitlint.config.js   # Commit message lint rules (optional)
├── eslint.config.js       # ESLint configuration (optional)
├── lint-staged.config.js  # Lint-staged configuration (optional)
├── vitest.*.ts            # Vitest configuration (optional)
└── package.json
```

### MCP Client Project Structure

```
├── src/
│   └── index.ts           # Entry point with transport implementations
├── tests/                 # Test files (optional)
├── scripts/               # Build and development scripts
├── .github/               # GitHub Actions workflows (optional)
├── .husky/                # Git hooks (optional)
├── .prettierrc            # Prettier configuration (optional)
├── changelog-option.js    # Conventional changelog config (optional)
├── commitlint.config.js   # Commit message lint rules (optional)
├── eslint.config.js       # ESLint configuration (optional)
├── lint-staged.config.js  # Lint-staged configuration (optional)
├── vitest.*.ts            # Vitest configuration (optional)
└── package.json
```

::: tip
The project structure is designed to be modular and extensible. You can customize it according to your needs.
:::

## Up and Running

After creating your project, you can use the following npm scripts to develop, test, and build your application:

### MCP Server Development Scripts

```json [package.json]
{
  "scripts": {
    "dev": "Start the development server in stdio mode",
    "dev:web": "Start the development server in web mode",
    "build": "Build the project",
    "test": "Run tests (if vitest plugin is selected)",
    "coverage": "Generate test coverage report (if vitest plugin is selected)",
    "lint": "Run linting (if style plugin is selected)"
  }
}
```

To start the development server, run:

::: code-group

```sh [npm]
$ npm run dev
```

```sh [pnpm]
$ pnpm run dev
```

```sh [yarn]
$ yarn dev
```

:::

### MCP Client Development Scripts

The client project includes similar scripts for development, testing, and building:

```json [package.json]
{
  "scripts": {
    "dev": "Start the client in development mode",
    "build": "Build the project",
    "test": "Run tests (if vitest plugin is selected)",
    "coverage": "Generate test coverage report (if vitest plugin is selected)",
    "lint": "Run linting (if style plugin is selected)"
  }
}
```
