import { defineConfig } from 'vitepress'
import pkg from '../../packages/create-mcp-kit/package.json' with { type: 'json' }

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
  locales: {
    root: { label: 'English', lang: 'en-US', dir: 'ltr' },
    zh: { label: '简体中文', lang: 'zh-Hans', dir: 'ltr' },
  },
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
        text: pkg.version,
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
})
