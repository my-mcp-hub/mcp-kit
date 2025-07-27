#!/usr/bin/env node
import * as clack from '@clack/prompts'
import pc from 'picocolors'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { stat } from 'fs/promises'
import { sleep, createProject, installDependencies } from '@mcp-tool-kit/shared'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
clack.intro(pc.inverse(' create-mcp-kit '))

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
          // { value: 'js', label: pc.blue('JavaScript') },
        ],
      }),
    template: () =>
      clack.select({
        message: 'Project template:',
        options: [
          { value: 'standard', label: pc.magenta('Standard') },
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

const templatePath = join(__dirname, '../template', `${group.template}-${group.language}`)
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
  ${pc.dim('npm install')}
  ${pc.dim('npm run dev')}

Enjoy coding! 🎉
  `)
