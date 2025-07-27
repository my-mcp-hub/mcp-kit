import { setTimeout as sleep } from 'timers/promises'
import { readdir, readFile, rename, stat, writeFile, cp, mkdir } from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

async function renameFiles(currentDir: string) {
  const renameMap = {
    _env: '.env',
    _gitignore: '.gitignore',
    _git: '.git',
    _nvmrc: '.nvmrc',
    _prettierrc: '.prettierrc',
    _husky: '.husky',
    _github: '.github',
  } as const
  const items = await readdir(currentDir, { recursive: true })
  for (const item of items) {
    if (!(item in renameMap)) {
      continue
    }
    await rename(path.join(currentDir, item), path.join(currentDir, renameMap[item as keyof typeof renameMap]))
  }
}

async function replaceVariables(
  currentDir: string,
  replacements: {
    projectName: string
  },
) {
  const variables = {
    '{{PROJECT_NAME}}': replacements.projectName,
    '{{YEAR}}': new Date().getFullYear().toString(),
  }
  const items = await readdir(currentDir, { recursive: true })
  for (const item of items) {
    const itemPath = path.join(currentDir, item)
    const itemStat = await stat(itemPath)
    if (itemStat.isDirectory()) {
      continue
    }
    for (const [key, value] of Object.entries(variables)) {
      const content = await readFile(itemPath, 'utf-8')
      const regex = new RegExp(key, 'g')
      const newContent = content.replace(regex, value)
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
  replacements: {
    projectName: string
  },
) {
  await mkdir(targetPath, { recursive: true })
  await cp(templatePath, targetPath, { recursive: true })
  await renameFiles(targetPath)
  await replaceVariables(targetPath, replacements)
}

export { sleep }
