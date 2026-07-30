import { EventEmitter } from 'node:events'
import { beforeEach, describe, expect, test, vi } from 'vitest'

const spawn = vi.hoisted(() => vi.fn())

vi.mock('node:child_process', () => ({
  spawn,
}))

import { installDependencies } from '../src'

describe('installDependencies', () => {
  beforeEach(() => {
    spawn.mockReset()
  })

  test('resolves when npm exits successfully', async () => {
    const npm = new EventEmitter()
    spawn.mockReturnValue(npm)

    const installation = installDependencies('/tmp/project')
    npm.emit('close', 0)

    await expect(installation).resolves.toBeUndefined()
    expect(spawn).toHaveBeenCalledWith('npm', ['install'], {
      cwd: '/tmp/project',
      stdio: 'pipe',
    })
  })

  test('rejects when npm exits unsuccessfully', async () => {
    const npm = new EventEmitter()
    spawn.mockReturnValue(npm)

    const installation = installDependencies('/tmp/project')
    npm.emit('close', 2)

    await expect(installation).rejects.toThrow('npm install failed with code 2')
  })

  test('rejects when npm cannot be started', async () => {
    const npm = new EventEmitter()
    spawn.mockReturnValue(npm)

    const installation = installDependencies('/tmp/project')
    npm.emit('error', new Error('spawn failed'))

    await expect(installation).rejects.toThrow('spawn failed')
  })
})
