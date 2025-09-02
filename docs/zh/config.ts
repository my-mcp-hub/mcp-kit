import { defineAdditionalConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineAdditionalConfig({
  description: '一个轻松创建 MCP 应用的 CLI 工具',
  themeConfig: {
    nav: [
      { text: '首页', link: '/zh/' },
      { text: '指南', link: '/zh/guide/what-is-mcp', activeMatch: '/guide/' },
      {
        text: '0.0.8',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/my-mcp-hub/mcp-kit/blob/main/packages/create-mcp-kit/CHANGELOG.md'
          },
        ],
      },
    ],

    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是MCP？', link: '/zh/guide/what-is-mcp' },
          { text: '什么是MCP Kit？', link: '/zh/guide/what-is-mcp-kit' },
          { text: '快速开始', link: '/zh/guide/getting-started' },
        ],
      },
    ],
  },
})
