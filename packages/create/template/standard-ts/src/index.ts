#!/usr/bin/env node
import yargs, { type ArgumentsCamelCase } from 'yargs'
import { hideBin } from 'yargs/helpers'
import { startWebServer, startStdioServer } from './services'
import { getOptions } from './utils'
import 'dotenv/config'
import pkg from '../package.json' with { type: 'json' }

const name = 'node-mcp-server'

const argv = await yargs()
  .scriptName(name)
  .usage('$0 <command> [options]')
  .command(
    'stdio',
    'Start the server using the stdio transport protocol.',
    () => {},
    argv => startServer('stdio', argv),
  )
  .command(
    'web',
    'Start the web server transport protocol.',
    () => {},
    argv => startServer('web', argv),
  )
  .options({
    port: {
      describe: 'Specify the port for SSE or streamable transport (default: 8401)',
      type: 'string',
      default: process.env.PORT || '8401',
    },
  })
  .help()
  .parse(hideBin(process.argv))

if (!argv._[0]) {
  startServer('stdio', argv)
}

async function startServer(mode: string, argv: ArgumentsCamelCase) {
  const options = getOptions(argv, {
    name,
    version: pkg.version,
  })
  if (mode === 'stdio') {
    startStdioServer(options).catch(console.error)
  } else if (mode === 'web') {
    startWebServer(options).catch(console.error)
  }
}
