#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import * as clack from '@clack/prompts'
import pc from 'picocolors'
import gradient from 'gradient-string'
import { sleep, createProject, installDependencies, fileExists } from '@mcp-tool-kit/shared'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

clack.intro(
  gradient([
    { color: '#a855f7', pos: 0 },
    { color: '#3b82f6', pos: 0.4 },
    { color: '#06b6d4', pos: 0.8 },
    { color: '#10b981', pos: 1 },
  ])('MCP Kit - The Modern Context Protocol Builder'),
)

const group = await clack.group(
  {
    type: () =>
      clack.select({
        message: 'Project type:',
        options: [
          { value: 'server', label: pc.magentaBright('MCP Server') },
          { value: 'client', label: pc.greenBright('MCP Client') },
          // { value: 'host', label: pc.yellowBright('MCP Host') },
        ],
      }),
    name: ({ results }) =>
      clack.text({
        message: 'Project name:',
        defaultValue: `mcp-${results.type}-starter`,
        placeholder: `mcp-${results.type}-starter`,
      }),
    language: () =>
      clack.select({
        message: 'Project language:',
        options: [
          { value: 'ts', label: pc.magentaBright('TypeScript') },
          { value: 'js', label: pc.greenBright('JavaScript') },
        ],
      }),
    transports: () => {
      return clack.multiselect({
        message: 'Project transport type:',
        required: true,
        initialValues: ['stdio'],
        options: [
          { value: 'stdio', label: pc.magentaBright('STDIO') },
          { value: 'streamable', label: pc.greenBright('Streamable HTTP') },
          { value: 'sse', label: pc.yellowBright('SSE') },
        ],
      })
    },
    template: () =>
      clack.select({
        message: 'Project template:',
        options: [
          { value: 'standard', label: pc.magentaBright('Standard (recommended)') },
          { value: 'custom', label: pc.greenBright('Custom') },
        ],
      }),
    plugins: ({ results }) => {
      if (results.template !== 'custom') {
        return Promise.resolve([
          'github-action',
          'vitest',
          ...(results.type === 'server' ? ['inspector'] : []),
          'style',
          'commitlint',
          'changelog',
        ])
      }
      return clack.multiselect({
        message: 'Project plugins:',
        required: false,
        options: [
          { value: 'github-action', label: pc.magentaBright('GitHub Action') },
          { value: 'vitest', label: pc.greenBright('Vitest') },
          ...(results.type === 'server' ? [{ value: 'inspector', label: pc.cyanBright('Inspector') }] : []),
          { value: 'style', label: pc.yellowBright('ESLint + Prettier + Lint-staged') },
          { value: 'commitlint', label: pc.redBright('Commitlint') },
          { value: 'changelog', label: pc.blueBright('Changelog') },
        ],
      })
    },
    install: () =>
      clack.confirm({
        message: 'Do you want to install dependencies?',
      }),
  },
  {
    onCancel: () => {
      clack.cancel('Operation cancelled.')
      process.exit(0)
    },
  },
)

const templatePath = join(__dirname, '../template', `${group.type}-${group.language}`)
const targetPath = resolve(process.cwd(), group.name as string)

if (!(await fileExists(templatePath))) {
  clack.log.error(`Template not found: ${templatePath}`)
  process.exit(1)
}

if (await fileExists(targetPath)) {
  clack.log.error(`Directory ${group.name} already exists`)
  process.exit(1)
}

{
  await sleep(100)
  try {
    await createProject(targetPath, templatePath, {
      projectName: group.name as string,
      year: new Date().getFullYear().toString(),
      transports: group.transports as string[],
      plugins: group.plugins as string[],
      components: [],
    })
  } catch (error) {
    clack.log.error((error as Error).message)
    process.exit(1)
  }
}

if (group.install) {
  const spinner = clack.spinner()
  spinner.start('Installing dependencies...')
  await installDependencies(targetPath)
  spinner.stop(pc.green('Dependencies installed!'))
}

clack.outro(`${pc.green('✓')} Project created successfully!

${pc.cyan('Next steps:')}
  ${pc.dim('cd')} ${group.name}
  ${group.install ? '' : `${pc.dim('npm install')}\n  `}${pc.dim('npm run dev')}

Enjoy coding! 🎉`)
