const { existsSync } = require('node:fs')
const path = require('node:path')

const buildRoot = path.resolve(__dirname, '../build')

function toModuleSpecifier(filePath) {
  const normalized = filePath.split(path.sep).join('/')
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function resolveFullPath(importPath, sourceDir, extension = '.js') {
  if (!importPath.startsWith('.') || importPath.endsWith(extension)) return importPath

  const asFilePath = `${importPath}${extension}`
  if (existsSync(path.resolve(sourceDir, asFilePath))) return asFilePath

  const asIndexPath = path.join(importPath, `index${extension}`)
  if (existsSync(path.resolve(sourceDir, asIndexPath))) return toModuleSpecifier(asIndexPath)

  return importPath
}

exports.default = ({ orig, file }) => {
  if (!orig.includes('@/')) return orig

  return orig.replace(/(['\"])@\/([^'\"]+)\1/g, (_match, quote, subpath) => {
    const relativePath = toModuleSpecifier(path.relative(path.dirname(file), path.resolve(buildRoot, subpath)))
    return `${quote}${resolveFullPath(relativePath, path.dirname(file))}${quote}`
  })
}
