import { mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execa } from 'execa'
import { describe, expect, test } from 'vitest'

describe('test index cli', () => {
  test('should create project', async () => {
    const testDir = join(tmpdir(), `test-cli-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    const userInput = ['\x0D', '\x0D', '\x0D', '\x0D', '\x0D', 'y\x0D']
    const scriptPath = resolve('./packages/create-mcp-kit/src/index.ts')
    const subprocess = execa('c8', ['--reporter=lcov', '--reporter=text', 'tsx', scriptPath], {
      // stdio: ['pipe', 'inherit', 'inherit'],
      cwd: testDir,
      timeout: 60000,
      env: {
        ...process.env,
      },
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
  }, 60000)
})
