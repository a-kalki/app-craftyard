import { cp, mkdir, rmdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

const projectDir = cwd();
const publicDir = join(projectDir, 'src/zzz-app-run/public');
const staticDir = join(projectDir, 'src/zzz-app-run/static');
const assetsDir = join(publicDir, 'assets');

await rmdir(publicDir, { recursive: true });
await mkdir(assetsDir, { recursive: true });

await Bun.build({
  entrypoints: ['src/zzz-app-run/bootstrap.ts'],
  outdir: assetsDir,
  target: 'browser',
  format: 'esm',
  sourcemap: 'external',
  minify: false,
});

// 💡 Копируем Shoelace assets (папка assets внутри assetsDir)
const shoelaceSource = join(projectDir, 'node_modules/@shoelace-style/shoelace/dist/assets');
await cp(shoelaceSource, assetsDir, { recursive: true });

// Копируем стили с указанием имени файла
await cp(join(staticDir, 'global.css'), join(assetsDir, 'global.css'));
await cp('node_modules/@shoelace-style/shoelace/dist/themes/light.css', join(assetsDir, 'light.css'));

// Копируем основные файлы в publicDir (вне assets)
await cp(join(staticDir, 'index.html'), join(publicDir, 'index.html'));
await cp(join(staticDir, 'favicon.ico'), join(publicDir, 'favicon.ico'));

// Копируем статики приложения (в assets)
const appStaticSource = join(projectDir, 'src/app/ui/page/assets');
await cp(appStaticSource, assetsDir, { recursive: true });

console.log('✅ Build complete, assets copied.');
