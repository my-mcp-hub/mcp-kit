import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MCP Kit',
  description: 'A CLI tool to create MCP (Model Context Protocol) applications with ease',
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
      { text: 'Guide', link: '/guide/what-is-this', activeMatch: '/guide/' },
      { text: 'Configs', link: '/config/', activeMatch: '/config/' },
      { text: 'Examples', link: '/guide/examples', activeMatch: '/guide/examples' },
      {
        text: '0.0.6',
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
          { text: 'Getting Started', link: '/en/guide/getting-started' },
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
  }
})
