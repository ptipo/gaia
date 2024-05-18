import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts', 'src/items/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['cjs', 'esm'],
    minify: !options.watch,
}));
