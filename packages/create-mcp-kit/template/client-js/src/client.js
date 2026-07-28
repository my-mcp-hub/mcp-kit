import { Client } from '@modelcontextprotocol/client'

export const createClient = name =>
  new Client(
    {
      name,
      version: '1.0.0',
    },
    {
      versionNegotiation: {
        mode: 'auto',
      },
    },
  )
