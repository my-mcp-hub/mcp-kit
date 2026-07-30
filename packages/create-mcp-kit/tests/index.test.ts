import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { execa } from 'execa'
import { describe, expect, test } from 'vitest'

describe('test index cli', () => {
  test('should create project', async () => {
    const testDir = join(tmpdir(), `test-cli-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
    try {
      const userInput = ['\x0D', '\x0D', '\x0D', '\x0D', '\x0D', 'n']
      const scriptPath = resolve('./packages/create-mcp-kit/src/index.ts')
      const subprocess = execa('tsx', [scriptPath], {
        cwd: testDir,
        timeout: 60000,
        env: {
          ...process.env,
        },
      })
      userInput.forEach((input, index) => {
        setTimeout(
          () => {
            if (index === userInput.length - 1) {
              subprocess.stdin.end(input)
            } else {
              subprocess.stdin.write(input)
            }
          },
          1000 * (index + 1),
        )
      })
      const result = await subprocess
      const projectDir = join(testDir, 'mcp-server-starter')

      expect(result.stdout).toContain('Project created successfully!')
      expect(existsSync(join(projectDir, 'package.json'))).toBe(true)
      expect(existsSync(join(projectDir, 'node_modules'))).toBe(false)
    } finally {
      rmSync(testDir, { recursive: true, force: true })
    }
  }, 60000)
})
