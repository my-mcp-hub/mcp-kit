import { mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { createProject, fileExists } from '../src'

describe('test project setup file', () => {
  test('should create project', async () => {
    const projectName = 'test'
    const testDir = join(tmpdir(), `test-shared-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    const templatePath = join(__dirname, '../../create-mcp-kit/template', 'server-ts')
    await createProject(testDir, templatePath, {
      projectName,
      year: new Date().getFullYear().toString(),
      transports: ['stdio'],
      plugins: [],
      components: [],
    })
    expect(await fileExists(testDir)).toBe(true)
    expect(await fileExists(join(testDir, 'missing'))).toBe(false)
    rmSync(testDir, { recursive: true, force: true })
  }, 60000)
})
