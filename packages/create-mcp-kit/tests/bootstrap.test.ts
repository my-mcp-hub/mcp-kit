import { expect, test, vi } from 'vitest'

const runCli = vi.hoisted(() => vi.fn())

vi.mock('../src/cli', () => ({
  runCli,
}))

test('starts the CLI from the executable entry point', async () => {
  await import('../src/index')

  expect(runCli).toHaveBeenCalledOnce()
})
