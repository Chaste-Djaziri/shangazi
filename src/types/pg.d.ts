// Minimal module declaration to satisfy TypeScript during build
declare module 'pg' {
  // Export any to avoid requiring full type package in CI
  const anything: any
  export = anything
}
