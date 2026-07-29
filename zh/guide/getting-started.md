---
url: /mcp-kit/zh/guide/getting-started.md
---

# 入门指南

## 前提条件

* [Node.js](https://nodejs.org/) 22 或更高版本
* 终端，以及 npm、pnpm、Yarn、Bun 或 Deno

MCP Kit 及其生成的模板使用现代 ES 模块。生成项目中的 `.nvmrc` 指定为 Node.js 22。

## 创建项目

无需全局安装，直接运行 CLI：

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

## 设置向导

交互式向导会依次询问：

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

1. **项目类型** — MCP Server 或 MCP Client。
2. **项目名称** — 默认为 `mcp-server-starter` 或 `mcp-client-starter`。
3. **开发语言** — TypeScript 或 JavaScript。
4. **传输方式** — STDIO、Streamable HTTP，或同时选择两者。
5. **项目模板** — Standard 或 Custom。
6. **插件** — Custom 项目会显示此项，可任意组合 GitHub Actions、Vitest、MCP Inspector（仅服务端）、代码风格工具、Commitlint 和变更日志工具。
7. **安装依赖** — 立即安装或稍后手动安装。

Standard 模板会启用全部推荐插件，服务端项目还会包含 MCP Inspector。

::: info
目标目录不能已存在。如果所选项目名称对应的目录已经存在，CLI 会停止执行且不会覆盖该目录。
:::

## 运行生成的项目

如果向导已经安装依赖：

```sh
cd mcp-server-starter
npm run dev
```

否则先安装依赖：

```sh
cd mcp-server-starter
npm install
npm run dev
```

`npm run dev` 会启动所选的默认传输方式。服务端脚本如下：

| 所选传输方式    | 可用脚本                      | 默认方式        |
| --------------- | ----------------------------- | --------------- |
| STDIO           | `dev`、`dev:stdio`            | STDIO           |
| Streamable HTTP | `dev`、`dev:web`              | Streamable HTTP |
| 两者            | `dev`、`dev:stdio`、`dev:web` | STDIO           |

Streamable HTTP 开发服务器默认监听 `8401` 端口，MCP 端点为 `http://localhost:8401/mcp`。可通过 `PORT` 修改服务端端口。

客户端项目使用 `npm run dev`。HTTP 连接默认指向同一端点，可通过 `MCP_SERVER_URL` 修改。

## 生成的服务端

同时选择两种传输方式时，TypeScript 服务端的核心结构如下：

```text
src/
├── assets/                  # 随包分发的静态资源
├── constants/
├── data/
│   └── documents.ts         # 结果确定的示例知识库
├── prompts/
│   └── index.ts             # review_document 提示
├── resources/
│   └── index.ts             # kb://documents/{documentId}
├── services/
│   ├── index.ts             # 服务端工厂与能力注册
│   ├── stdio.ts             # STDIO 传输
│   └── web.ts               # Streamable HTTP 传输
├── tools/
│   ├── index.ts
│   └── registerSearchDocuments.ts
├── types/
├── utils/
└── index.ts                 # 命令行入口
```

生成时会删除未选择的传输文件。JavaScript 项目采用相同结构，文件扩展名为 `.js`。

该模板演示了一条完整的 MCP 工作流：

1. `search_documents` 搜索内置的三篇 MCP 指南，同时返回文本和结构化结果。
2. 每个结果都链接到一个 `kb://documents/{documentId}` Markdown 资源。
3. `review_document` 将选中的资源附加到可复用的审阅提示中。

## 生成的客户端

客户端将协议工作流与传输连接分开：

```text
src/
├── client.ts                # MCP Client 工厂
├── knowledgeBaseDemo.ts     # 端到端协议工作流
├── transports.ts            # 所选传输方式的连接辅助函数
└── index.ts                 # 导出与可运行示例
```

使用 STDIO 时，示例默认启动 `@my-mcp-hub/node-mcp-server`。可向 `runStdioDemo` 传入其他进程参数来连接不同服务端。使用 Streamable HTTP 时，请先启动兼容服务端再运行客户端。

## 开发脚本

每个生成项目都包含：

* `npm run dev` — 监听源码并运行应用。
* `npm run build` — 对 TypeScript 项目执行类型检查，并将应用打包到 `build/`。

所选插件还会加入：

* Vitest：`npm test` 和 `npm run coverage`。
* 代码风格工具：`npm run lint`。
* 变更日志工具：`npm run changelog`。
* 代码风格与 Commitlint 插件：Git 钩子和提交检查。

生成的客户端测试套件默认在 `../mcp-server-starter` 查找配套服务端。
