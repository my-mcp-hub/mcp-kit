---
url: /mcp-kit/zh/guide/getting-started.md
---

# 入门指南

## 安装

### 前提条件

* [Node.js](https://nodejs.org/) 版本 18 或更高。
* 通过命令行界面（CLI）访问 MCP Kit 的终端。

MCP Kit 可用于创建新的 MCP（模型上下文协议）应用程序。您可以使用以下任何包管理器安装和使用它：

::: code-group

```sh [npm]
$ npm create mcp-kit@latest
```

```sh [pnpm]
$ pnpm create mcp-kit
```

```sh [yarn]
$ yarn create mcp-kit
```

```bash [bun]
$ bun create mcp-kit
```

```bash [deno]
$ deno init --npm mcp-kit
```

:::

::: tip NOTE
MCP Kit 是一个仅支持 ESM 的包。它需要 Node.js 版本 18 或更高，并使用现代 JavaScript 特性。
:::

## 设置向导

当您运行创建命令时，MCP Kit 将启动一个交互式设置向导，引导您创建一个新项目：

<<< @/snippets/init.ansi

1. 首先，系统会提示您选择 **Project type**:
   * **MCP Server**: 创建一个为 MCP 客户端提供工具、资源和提示的服务器
   * **MCP Client**: 创建一个连接到 MCP 服务器的客户端

2. 接下来，系统会要求您提供**Project name** (默认为 `mcp-[type]-starter`)

3. 选择您偏好的 **Project language**:
   * **TypeScript** (recommended)
   * **JavaScript**

4. 选择 **Project transport type** （可以选择多个选项）:
   * **STDIO**: 通过标准输入/输出流进行通信
   * **Streamable HTTP**: 具有流式功能的 RESTful API
   * **SSE**: 用于实时通信的服务器发送事件

5. 选择 **Project template**:
   * **Standard**: 包含推荐的插件和配置
   * **Custom**: 允许您选择特定的插件

6. 如果您选择了 **Custom** 模板, 系统会提示您选择 **Project plugins**:
   * **GitHub Action**: CI/CD 工作流
   * **Vitest**: 测试框架
   * **Inspector**: 调试工具（仅限服务器项目）
   * **ESLint + Prettier + Lint-staged**: 代码质量工具
   * **Commitlint**: 提交消息检查
   * **Changelog**: 自动生成变更日志

7. 最后，系统会询问您是否要自动 **install dependencies**

完成这些步骤后，MCP Kit 将使用所选配置创建您的项目。

## 文件结构

生成的文件结构取决于您选择的项目类型。

### MCP 服务器项目结构

```
├── src/
│   ├── tools/             # MCP 工具实现
│   │   ├── index.ts       # 工具注册
│   │   └── register*.ts   # 单个工具实现
│   ├── resources/         # MCP 资源实现
│   │   └── index.ts       # 资源注册
│   ├── prompts/           # MCP 提示实现
│   │   └── index.ts       # 提示注册
│   ├── services/          # 服务器实现
│   │   ├── stdio.ts       # STDIO 传输实现
│   │   └── web.ts         # 可流式 HTTP 和 SSE 传输实现
│   └── index.ts           # 入口点
├── tests/                 # 测试文件（可选）
├── scripts/               # 构建和开发脚本
├── .github/               # GitHub Actions 工作流（可选）
├── .husky/                # Git 钩子（可选）
├── .prettierrc            # Prettier 配置（可选）
├── changelog-option.js    # 约定式变更日志配置（可选）
├── commitlint.config.js   # 提交消息检查规则（可选）
├── eslint.config.js       # ESLint 配置（可选）
├── lint-staged.config.js  # Lint-staged 配置（可选）
├── vitest.*.ts            # Vitest 配置（可选）
└── package.json
```

### MCP 客户端项目结构

```
├── src/
│   └── index.ts           # 带有传输实现的入口点
├── tests/                 # 测试文件（可选）
├── scripts/               # 构建和开发脚本
├── .github/               # GitHub Actions 工作流（可选）
├── .husky/                # Git 钩子（可选）
├── .prettierrc            # Prettier 配置（可选）
├── changelog-option.js    # 约定式变更日志配置（可选）
├── commitlint.config.js   # 提交消息检查规则（可选）
├── eslint.config.js       # ESLint 配置（可选）
├── lint-staged.config.js  # Lint-staged 配置（可选）
├── vitest.*.ts            # Vitest 配置（可选）
└── package.json
```

::: tip
项目结构设计为模块化和可扩展的。您可以根据自己的需求进行自定义。
:::

## 启动和运行

创建项目后，您可以使用以下 npm 脚本来开发、测试和构建您的应用程序：

### MCP 服务器开发脚本

```json [package.json]
{
  "scripts": {
    "dev": "以 stdio 模式启动开发服务器",
    "dev:web": "以 web 模式启动开发服务器",
    "build": "构建项目",
    "test": "运行测试（如果选择了 vitest 插件）",
    "coverage": "生成测试覆盖率报告（如果选择了 vitest 插件）",
    "lint": "运行代码检查（如果选择了 style 插件）"
  }
}
```

要启动开发服务器，请运行：

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

### MCP 客户端开发脚本

客户端项目包含类似的脚本，用于开发、测试和构建：

```json [package.json]
{
  "scripts": {
    "dev": "以开发模式启动客户端",
    "build": "构建项目",
    "test": "运行测试（如果选择了 vitest 插件）",
    "coverage": "生成测试覆盖率报告（如果选择了 vitest 插件）",
    "lint": "运行代码检查（如果选择了 style 插件）"
  }
}
```
