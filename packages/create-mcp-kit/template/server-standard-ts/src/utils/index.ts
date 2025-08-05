import type { ArgumentsCamelCase } from 'yargs'
import type { OptionsType } from '@/types'

export function getOptions(
  argv: ArgumentsCamelCase,
  pkg: {
    name: string
    version: string
  },
) {
  return {
    name: pkg.name,
    version: pkg.version,
    port: argv.port,
  } as OptionsType
}
