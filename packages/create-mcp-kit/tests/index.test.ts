import { tmpdir } from 'os'
import { join, resolve } from 'path'
import { mkdirSync, rmSync } from 'fs'
import { describe, test, expect } from 'vitest'
import { execa } from 'execa'

describe('test index cli', () => {
  test('should create project', async () => {
    const testDir = join(tmpdir(), `test-cli-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    const userInput = ['\x0D', '\x0D', '\x0D', '\x0D', 'y\x0D']
    const scriptPath = resolve('./src/index.ts')
    const subprocess = execa('tsx', [scriptPath], {
      // stdio: ['pipe', 'inherit', 'inherit'],
      cwd: testDir,
      timeout: 30000,
    })
    userInput.forEach((input, index) => {
      setTimeout(
        () => {
          subprocess.stdin.write(input)
        },
        1000 * (index + 1),
      )
    })
    const result = await subprocess
    expect(result.stdout).toContain('Project created successfully!')
    rmSync(testDir, { recursive: true, force: true })
  }, 30000)
})
