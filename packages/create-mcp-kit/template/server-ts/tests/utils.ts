export function waitForValue<T>(
  getterFn: () => T | undefined | null,
  checkInterval = 100,
  timeout = 10000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const intervalId = setInterval(() => {
      const value = getterFn()
      if (value) {
        clearInterval(intervalId)
        resolve(value)
      } else if (Date.now() - start > timeout) {
        clearInterval(intervalId)
        reject(new Error('Timeout waiting for value'))
      }
    }, checkInterval)
  })
}
