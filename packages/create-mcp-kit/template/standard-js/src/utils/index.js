export function getOptions(argv, pkg) {
  return {
    name: pkg.name,
    version: pkg.version,
    port: argv.port,
  }
}
