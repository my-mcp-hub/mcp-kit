---
layout: doc
---

# 什么是 MCP Kit？

MCP Kit 是一个面向模型上下文协议（Model Context Protocol，MCP）应用的交互式脚手架 CLI。它会根据设置向导中的选择，生成源码、脚本、测试和说明相互匹配的可开发服务端或客户端。

## 可以生成什么？

MCP Kit 支持 MCP 集成的两端：

- **MCP 服务端**：注册工具、资源和提示，并通过 STDIO、Streamable HTTP 或同时通过两者提供能力。
- **MCP 客户端**：包含连接辅助函数和完整示例，可发现并使用服务端提供的能力。

每种项目都可选择 TypeScript 或 JavaScript。生成的代码使用现代 ES 模块，并包含构建与本地开发脚本。

## 不是空壳，而是可运行示例

配套的服务端与客户端模板演示了一条端到端知识库工作流：

1. 客户端调用 `search_documents` 工具。
2. 工具返回结构化匹配结果和稳定的 `kb://documents/{documentId}` 资源 URI。
3. 客户端读取选中的 Markdown 资源。
4. 客户端获取附带该资源的 `review_document` 提示。

该示例结果确定，不依赖外部数据库或 API。你可以先把它作为可运行参考，再替换成自己的领域逻辑。

## 传输方式

- **STDIO** 面向本地进程集成，生成的服务端通过标准输入和标准输出通信。
- **Streamable HTTP** 在 `/mcp` 暴露 MCP 端点；开发服务器默认监听 `8401` 端口。

同时选择两种传输方式时，它们会保留独立实现，并分别提供开发脚本。

## 标准与自定义配置

**Standard** 配置会启用推荐的工程工具：

- GitHub Actions
- Vitest
- MCP Inspector（仅服务端）
- ESLint、Prettier 与 lint-staged
- Commitlint
- 变更日志工具

**Custom** 配置允许自由组合这些插件，也可以全部不选。

## 下一步

继续阅读[入门指南](./getting-started.md)，生成并运行一个项目。
