// Minimal module declaration to satisfy TypeScript during build
declare module 'pg' {
  // Named exports used by the project (keep as `any` to avoid pulling full types)
  export const Pool: any;
  export const Client: any;
  export const types: any;
  export const native: any;

  export type PoolConfig = any;

  // Default export (commonjs/interop)
  const pg: any;
  export default pg;
}
