import { tmpdir } from 'os'
import { join } from 'path'
import { mkdirSync, rmSync } from 'fs'
import { describe, test } from 'vitest'
import { createProject, installDependencies } from '../src'

describe('test project setup file', () => {
  test('should create project', async () => {
    const projectName = 'test'
    const testDir = join(tmpdir(), `test-shared-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    const templatePath = join(__dirname, '../../create-mcp-kit/template', 'server-standard-ts')
    await createProject(testDir, templatePath, {
      projectName,
      year: new Date().getFullYear().toString(),
      transports: ['stdio'],
      plugins: [],
      components: [],
    })
    await installDependencies(testDir)
    rmSync(testDir, { recursive: true, force: true })
  }, 60000)
})
