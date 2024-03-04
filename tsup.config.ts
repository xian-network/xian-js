import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Output both CommonJS and ESM formats
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});