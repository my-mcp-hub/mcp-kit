import { isUndefined } from 'lodash-es'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'
import pkg from '../../packages/create-mcp-kit/package.json' with { type: 'json' }

const isGithubPages = isUndefined(process.env.VERCEL)
const base = isGithubPages ? '/mcp-kit/' : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'MCP Kit',
  description: 'Scaffold ready-to-develop Model Context Protocol servers and clients',
  rewrites: {
    'en/:rest*': ':rest*',
    'en/index.md': 'index.md',
    'en/guide/what-is-mcp.md': 'guide/what-is-mcp.md',
    'en/guide/what-is-mcp-kit.md': 'guide/what-is-mcp-kit.md',
    'en/guide/getting-started.md': 'guide/getting-started.md',
  },
  base,
  head: [
    ['link', { rel: 'shortcut icon', href: `${base}favicons/favicon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}favicons/apple-touch-icon.png` }],
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

    outline: {
      level: [2, 6],
    },

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
        searchParameters: {
          facetFilters: [`tags:${isGithubPages ? 'gh' : 'vercel'}`],
        },
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
        description: 'Scaffold ready-to-develop Model Context Protocol servers and clients',
        sidebar: [
          {
            text: 'Introduction',
            base: '',
            items: [
              { text: 'What is MCP?', link: '/guide/what-is-mcp' },
              { text: 'What is MCP Kit?', link: '/guide/what-is-mcp-kit' },
              { text: 'Getting Started', link: '/guide/getting-started' },
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
MCP Kit is an interactive CLI that generates ready-to-develop Model Context Protocol servers and clients.

- Generate TypeScript or JavaScript projects.
- Select STDIO, Streamable HTTP, or both.
- Start from a runnable knowledge-base workflow connecting a Tool, Resource, and Prompt.
- Use the recommended engineering setup or choose individual testing, CI, inspection, style, commit, and changelog plugins.

See [What is MCP Kit?](https://my-mcp-hub.github.io/mcp-kit/guide/what-is-mcp-kit.html) for the generated workflow and [Getting Started](https://my-mcp-hub.github.io/mcp-kit/guide/getting-started.html) for the current CLI options and scripts.`,
      }),
      groupIconVitePlugin(),
    ],
  },
})
