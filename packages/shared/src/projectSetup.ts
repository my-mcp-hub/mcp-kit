import { setTimeout as sleep } from 'timers/promises'
import { readdir, readFile, rename, stat, writeFile, cp, mkdir, unlink, rmdir, access, constants } from 'fs/promises'
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

async function removeEmptyDirectories(currentDir: string) {
  const items = await readdir(currentDir, { recursive: true, withFileTypes: true })
  const directories = items
    .filter(item => item.isDirectory())
    .map(item => join(item.parentPath || currentDir, item.name))
    .sort((a, b) => b.split('/').length - a.split('/').length)
  for (const dirPath of directories) {
    try {
      const dirItems = await readdir(dirPath)
      if (dirItems.length === 0) {
        await rmdir(dirPath)
      }
    } catch {}
  }
}

export async function fileExists(path: string) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
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
  })
  await renameFiles(targetPath)
  await compileTemplateFiles(targetPath, templateData)
  await removeEmptyDirectories(targetPath)
}

export { sleep }
