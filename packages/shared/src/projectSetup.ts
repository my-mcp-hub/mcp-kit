import { setTimeout as sleep } from 'timers/promises'
import { readdir, readFile, rename, stat, writeFile, cp, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { spawn } from 'child_process'
import Handlebars from 'handlebars'
import { registerHandlebarsHelpers } from '@/handlebars/register'

registerHandlebarsHelpers()

async function renameFiles(currentDir: string) {
  const renameMap = {
    _git: '.git',
    _husky: '.husky',
    _github: '.github',
  } as const
  const items = await readdir(currentDir, { recursive: true })
  for (const item of items) {
    if (!(item in renameMap)) {
      continue
    }
    await rename(join(currentDir, item), join(currentDir, renameMap[item as keyof typeof renameMap]))
  }
}

async function compileTemplateFiles(
  currentDir: string,
  templateData: {
    projectName: string
    year: string
    transports: string[]
    plugins: string[]
    components: string[]
  },
) {
  const items = await readdir(currentDir, { recursive: true })
  for (const item of items) {
    const itemPath = join(currentDir, item)
    const itemStat = await stat(itemPath)
    if (itemStat.isDirectory()) {
      continue
    }
    const content = await readFile(itemPath, 'utf-8')
    const template = Handlebars.compile(content)
    const newContent = template(templateData)
    if (newContent.trim() === '') {
      await unlink(itemPath)
      continue
    }
    if (itemPath.endsWith('.hbs')) {
      const newItemPath = itemPath.slice(0, -4)
      await writeFile(newItemPath, newContent, 'utf-8')
      await unlink(itemPath)
    } else {
      await writeFile(itemPath, newContent, 'utf-8')
    }
  }
}

export function installDependencies(currentDir: string) {
  return new Promise<void>((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: currentDir,
      stdio: 'pipe',
    })

    npm.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`npm install failed with code ${code}`))
      }
    })

    npm.on('error', reject)
  })
}

export async function createProject(
  targetPath: string,
  templatePath: string,
  templateData: {
    projectName: string
    year: string
    transports: string[]
    plugins: string[]
    components: string[]
  },
) {
  await mkdir(targetPath, { recursive: true })
  await cp(templatePath, targetPath, {
    recursive: true,
    filter: () => {
      // const relativePath = relative(templatePath, src)
      // const fileName = basename(src)
      // console.log('relativePath', relativePath)
      // console.log('fileName', fileName)
      // if (plugins === null) {
      //   return true
      // }
      // if (!plugins.includes('github-action') && relativePath.startsWith('_github')) {
      //   return false
      // }
      // if (
      //   !plugins.includes('vitest') &&
      //   (relativePath.startsWith('tests') ||
      //     ['vitest.config.js', 'vitest.setup.js', 'vitest.config.ts', 'vitest.setup.ts'].includes(relativePath))
      // ) {
      //   return false
      // }
      // if (
      //   !plugins.includes('style') &&
      //   ['eslint.config.js', '_prettierrc', 'lint-staged.config.js', '_husky/pre-commit'].includes(relativePath)
      // ) {
      //   return false
      // }
      // if (!plugins.includes('commitlint') && ['commitlint.config.js', '_husky/commit-msg'].includes(relativePath)) {
      //   return false
      // }
      // if (!plugins.includes('changelog') && ['changelog-option.js'].includes(relativePath)) {
      //   return false
      // }
      return true
    },
  })
  await renameFiles(targetPath)
  await compileTemplateFiles(targetPath, templateData)
}

export { sleep }
