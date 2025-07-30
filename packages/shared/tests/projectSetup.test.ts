import { join } from 'path'
import { rmSync } from 'fs'
import { describe, test } from 'vitest'
import { createProject, installDependencies } from '../src'

describe('test project setup file', () => {
  test('should create project', async () => {
    const projectName = 'test'
    const templatePath = join(__dirname, '../../create-mcp-kit/template', 'standard-ts')
    const targetPath = join(__dirname, '../../', projectName)
    console.log(templatePath)
    console.log(targetPath)
    await createProject(targetPath, templatePath, { projectName })
    await installDependencies(targetPath)
    rmSync(targetPath, { recursive: true, force: true })
  }, 20000)
})
