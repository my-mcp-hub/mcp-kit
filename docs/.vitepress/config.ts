import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import pkg from '../../packages/create-mcp-kit/package.json' with { type: 'json' }

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MCP Kit',
  description: 'A CLI tool to create MCP (Model Context Protocol) applications with ease',
  rewrites: {
    'en/:rest*': ':rest*',
    'en/index.md': 'index.md',
  },
  base: '/mcp-kit/',
  head: [
    ['link', { rel: 'shortcut icon', href: '/mcp-kit/favicons/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/mcp-kit/favicons/apple-touch-icon.png' }],
  ],
  locales: {
    root: { label: 'English', lang: 'en-US', dir: 'ltr' },
    zh: { label: '简体中文', lang: 'zh-Hans', dir: 'ltr' },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    socialLinks: [{ icon: 'github', link: 'https://github.com/my-mcp-hub/mcp-kit' }],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/what-is-mcp', activeMatch: '/guide/' },
      {
        text: pkg.version,
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/my-mcp-hub/mcp-kit/blob/main/packages/create-mcp-kit/CHANGELOG.md',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is MCP?', link: '/guide/what-is-mcp' },
          { text: 'What is MCP Kit?', link: '/guide/what-is-mcp-kit' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: 'V6CF28P0PS',
        apiKey: '692752b7b3c6f794997d8ae22aed79fa',
        indexName: 'create-mcp-kit',
      },
    },
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      llmstxt({
        ignoreFiles: ['en/index.md', 'zh/index.md'],
        description: 'A CLI tool to create MCP applications with ease',
        sidebar: [
          {
            text: 'Introduction',
            base: '',
            items: [
              { text: 'What is MCP?', link: '/en/guide/what-is-mcp' },
              { text: 'What is MCP Kit?', link: '/en/guide/what-is-mcp-kit' },
              { text: 'Getting Started', link: '/en/guide/getting-started' },
            ],
          },
          {
            text: '简介',
            base: '',
            items: [
              { text: '什么是MCP？', link: '/zh/guide/what-is-mcp' },
              { text: '什么是MCP Kit？', link: '/zh/guide/what-is-mcp-kit' },
              { text: '快速开始', link: '/zh/guide/getting-started' },
            ],
          },
        ],
        details: `\
- 🚀 Quick Scaffolding
- 📦️ TypeScript First
- 🛠️️ Development Tools
- 🔧 Configurable Templates
- 🌐️ Multiple Transport Modes
- 📚️ Comprehensive APIs

MCP Kit is a toolkit for creating MCP (Model Context Protocol) applications with ease, enabling developers to build MCP-compliant servers and client applications. It consists of two major parts:

- A scaffolding system that quickly generates MCP server and client projects with [pre-configured TypeScript setup](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp-kit.html) and built-in developer tools for rapid development.

- Project templates that provide standardized structure for both [MCP servers and clients](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp.html), pre-configured to follow Model Context Protocol specifications.

In addition, MCP Kit streamlines the development workflow with [getting started guides](https://my-mcp-hub.github.io/mcp-kit/guide/getting-started.html) and best practices with full TypeScript support.`,
      }),
      groupIconVitePlugin(),
    ],
  },
})
