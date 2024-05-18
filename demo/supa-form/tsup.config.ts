import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/config/index.ts'],
    outDir: 'dist/config',
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    format: ['esm'],
    minify: !options.watch,
}));
