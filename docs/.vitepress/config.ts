import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MCP Kit',
  description: 'A CLI tool to create MCP (Model Context Protocol) applications with ease',
  rewrites: {
    'en/:rest*': ':rest*',
  },
  base: '/mcp-kit/',
  head: [
    ['link', { rel: 'shortcut icon', href: '/mcp-kit/favicons/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/mcp-kit/favicons/apple-touch-icon.png' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/my-mcp-hub/mcp-kit' }
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/what-is-mcp', activeMatch: '/guide/' },
      {
        text: '0.0.7',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/my-mcp-hub/mcp-kit/blob/main/packages/create-mcp-kit/CHANGELOG.md'
          },
        ]
      }
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
  }
})
