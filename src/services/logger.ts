export function info(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`)
}

export function fail(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[ERROR] ${message}`)
}

export function warn(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[WARN] ${message}`)
}

export function ok(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[SUCCESS] ${message}`)
}
