import { context } from 'esbuild'
import { config } from './base.js'

const ctx = await context(config)
await ctx.watch()

console.log('🔍 Watching for changes...')
