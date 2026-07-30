import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { runCli } from '@/cli'

const clack = vi.hoisted(() => ({
  intro: vi.fn(),
  select: vi.fn(),
  text: vi.fn(),
  multiselect: vi.fn(),
  confirm: vi.fn(),
  group: vi.fn(),
  cancel: vi.fn(),
  log: {
    error: vi.fn(),
  },
  outro: vi.fn(),
  spinner: vi.fn(),
}))

const shared = vi.hoisted(() => ({
  createProject: vi.fn(),
  fileExists: vi.fn(),
  installDependencies: vi.fn(),
  sleep: vi.fn(),
}))

vi.mock('@clack/prompts', () => clack)
vi.mock('@mcp-tool-kit/shared', () => shared)
vi.mock('gradient-string', () => ({
  default: vi.fn(() => (value: string) => value),
}))
vi.mock('picocolors', () => ({
  default: {
    magentaBright: (value: string) => value,
    greenBright: (value: string) => value,
    cyanBright: (value: string) => value,
    yellowBright: (value: string) => value,
    redBright: (value: string) => value,
    blueBright: (value: string) => value,
    green: (value: string) => value,
    cyan: (value: string) => value,
    dim: (value: string) => value,
  },
}))

type Prompt = (context: { results: Record<string, unknown> }) => unknown

describe('runCli', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.exitCode = undefined
    clack.group.mockImplementation(async (prompts: Record<string, Prompt>) => {
      const results: Record<string, unknown> = {}
      for (const [name, prompt] of Object.entries(prompts)) {
        results[name] = await prompt({ results })
      }
      return results
    })
    clack.spinner.mockReturnValue({
      start: vi.fn(),
      stop: vi.fn(),
    })
  })

  afterEach(() => {
    process.exitCode = undefined
  })

  test('creates a standard server project without installing dependencies', async () => {
    clack.select.mockResolvedValueOnce('server').mockResolvedValueOnce('ts').mockResolvedValueOnce('standard')
    clack.text.mockResolvedValue('mcp-server-starter')
    clack.multiselect.mockResolvedValueOnce(['stdio'])
    clack.confirm.mockResolvedValue(false)
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    await runCli()

    expect(shared.createProject).toHaveBeenCalledWith(
      expect.stringContaining('mcp-server-starter'),
      expect.stringContaining('template/server-ts'),
      expect.objectContaining({
        projectName: 'mcp-server-starter',
        transports: ['stdio'],
        plugins: ['github-action', 'vitest', 'inspector', 'style', 'commitlint', 'changelog'],
      }),
    )
    expect(shared.installDependencies).not.toHaveBeenCalled()
    expect(clack.outro).toHaveBeenCalledWith(expect.stringContaining('npm install'))
  })

  test('creates a standard client project without the inspector plugin', async () => {
    clack.select.mockResolvedValueOnce('client').mockResolvedValueOnce('ts').mockResolvedValueOnce('standard')
    clack.text.mockResolvedValue('mcp-client-starter')
    clack.multiselect.mockResolvedValueOnce(['stdio'])
    clack.confirm.mockResolvedValue(false)
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    await runCli()

    expect(shared.createProject).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        plugins: ['github-action', 'vitest', 'style', 'commitlint', 'changelog'],
      }),
    )
  })

  test('creates a custom client project and installs dependencies', async () => {
    clack.select.mockResolvedValueOnce('client').mockResolvedValueOnce('js').mockResolvedValueOnce('custom')
    clack.text.mockResolvedValue('custom-client')
    clack.multiselect.mockResolvedValueOnce(['stdio', 'streamable']).mockResolvedValueOnce(['vitest'])
    clack.confirm.mockResolvedValue(true)
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    await runCli()

    expect(shared.createProject).toHaveBeenCalledWith(
      expect.stringContaining('custom-client'),
      expect.stringContaining('template/client-js'),
      expect.objectContaining({
        transports: ['stdio', 'streamable'],
        plugins: ['vitest'],
      }),
    )
    expect(shared.installDependencies).toHaveBeenCalledWith(expect.stringContaining('custom-client'))
    expect(clack.spinner).toHaveBeenCalledOnce()
    expect(clack.outro).toHaveBeenCalledWith(expect.not.stringContaining('npm install'))
  })

  test('offers the inspector plugin for a custom server project', async () => {
    clack.select.mockResolvedValueOnce('server').mockResolvedValueOnce('ts').mockResolvedValueOnce('custom')
    clack.text.mockResolvedValue('custom-server')
    clack.multiselect.mockResolvedValueOnce(['stdio']).mockResolvedValueOnce(['inspector'])
    clack.confirm.mockResolvedValue(false)
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

    await runCli()

    const pluginPrompt = clack.multiselect.mock.calls[1][0]
    expect(pluginPrompt.options).toContainEqual(
      expect.objectContaining({
        value: 'inspector',
      }),
    )
    expect(shared.createProject).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        plugins: ['inspector'],
      }),
    )
  })

  test('reports a missing template', async () => {
    clack.group.mockResolvedValue({
      type: 'server',
      language: 'ts',
      name: 'missing-template',
    })
    shared.fileExists.mockResolvedValue(false)

    await runCli()

    expect(clack.log.error).toHaveBeenCalledWith(expect.stringContaining('Template not found'))
    expect(shared.createProject).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })

  test('does not overwrite an existing target directory', async () => {
    clack.group.mockResolvedValue({
      type: 'server',
      language: 'ts',
      name: 'existing-project',
    })
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(true)

    await runCli()

    expect(clack.log.error).toHaveBeenCalledWith('Directory existing-project already exists')
    expect(shared.createProject).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })

  test('reports project creation errors', async () => {
    clack.group.mockResolvedValue({
      type: 'server',
      language: 'ts',
      name: 'broken-project',
      transports: ['stdio'],
      plugins: [],
      install: false,
    })
    shared.fileExists.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    shared.createProject.mockRejectedValue(new Error('copy failed'))

    await runCli()

    expect(clack.log.error).toHaveBeenCalledWith('copy failed')
    expect(clack.outro).not.toHaveBeenCalled()
    expect(process.exitCode).toBe(1)
  })

  test('cancels the prompt group', async () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit 0')
    }) as never)
    clack.group.mockImplementation(async (_prompts: Record<string, Prompt>, options: { onCancel: () => void }) => {
      options.onCancel()
    })

    await expect(runCli()).rejects.toThrow('exit 0')
    expect(clack.cancel).toHaveBeenCalledWith('Operation cancelled.')
    expect(exit).toHaveBeenCalledWith(0)
    exit.mockRestore()
  })
})
