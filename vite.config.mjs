import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: 'src/zzz-app-run/bootstrap',
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    outDir: '../public',
    emptyOutDir: true,
    target: 'esnext',
    sourcemap: true,
    minify: false,
  },
});
