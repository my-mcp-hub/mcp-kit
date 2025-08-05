#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { stat } from 'fs/promises'
import * as clack from '@clack/prompts'
import pc from 'picocolors'
import gradient from 'gradient-string'
import { sleep, createProject, installDependencies } from '@mcp-tool-kit/shared'

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
          { value: 'server', label: pc.magenta('MCP Server') },
          // { value: 'client', label: pc.blue('MCP Client') },
          // { value: 'host', label: pc.green('MCP Host') },
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
          { value: 'ts', label: pc.magenta('TypeScript') },
          { value: 'js', label: pc.blue('JavaScript') },
        ],
      }),
    template: () =>
      clack.select({
        message: 'Project template:',
        options: [
          { value: 'standard', label: pc.magenta('Standard (recommended)') },
          // { value: 'custom', label: pc.blue('Custom') },
        ],
      }),
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

const templatePath = join(__dirname, '../template', `${group.type}-${group.template}-${group.language}`)
const targetPath = resolve(process.cwd(), group.name as string)

try {
  await stat(templatePath)
} catch {
  clack.log.error(`Template not found: ${templatePath}`)
  process.exit(1)
}

try {
  await stat(targetPath)
  clack.log.error(`Directory ${group.name} already exists`)
  process.exit(1)
} catch {}

{
  const createSpinner = clack.spinner()
  createSpinner.start('Creating project...')
  await sleep(100)
  try {
    await createProject(targetPath, templatePath, {
      projectName: group.name as string,
    })
  } catch (error) {
    createSpinner.stop('Failed to create project')
    clack.log.error((error as Error).message)
    process.exit(1)
  }
  createSpinner.stop(pc.green('Project created!'))
}

if (group.install) {
  const spinner = clack.spinner()
  spinner.start('Installing dependencies...')
  await installDependencies(targetPath)
  spinner.stop(pc.green('Dependencies installed!'))
}

clack.outro(`
${pc.green('✓')} Project created successfully!

${pc.cyan('Next steps:')}
  ${pc.dim('cd')} ${group.name}
  ${group.install ? '' : `${pc.dim('npm install')}\n  `}${pc.dim('npm run dev')}

Enjoy coding! 🎉
  `)
