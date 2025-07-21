import { cp, mkdir, rmdir, readFile, writeFile, rename } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { createHash } from 'crypto';

const projectDir = cwd();
const publicDir = join(projectDir, 'src/zzz-app-run/public');
const bootstrapDir = join(projectDir, 'src/zzz-app-run/bootstrap');
const assetsDir = join(publicDir, 'assets');
const shoelaceAssetsDir = join(assetsDir, 'assets');

await rmdir(publicDir, { recursive: true });
await mkdir(shoelaceAssetsDir, { recursive: true });

const buildOutdir = assetsDir;

await Bun.build({
  entrypoints: ['src/zzz-app-run/bootstrap/index.ts'],
  outdir: buildOutdir,
  target: 'browser',
  format: 'esm',
  sourcemap: 'linked',
  minify: false,
  env: "inline",
});

// Хешируем собранный JS
const jsOut = join(buildOutdir, 'index.js');
const content = await readFile(jsOut, 'utf8');
const hash = createHash('sha256').update(content).digest('hex').slice(0, 8);

// Переименовываем index.js → index-<hash>.js
const hashedJsName = `index-${hash}.js`;
const hashedJsPath = join(buildOutdir, hashedJsName);
await rename(jsOut, hashedJsPath);

// Обновляем HTML
let html = await readFile(join(bootstrapDir, 'index.html'), 'utf8');
html = html.replace('index-{{hash}}.js', hashedJsName);
await writeFile(join(publicDir, 'index.html'), html, 'utf8');

// Копируем оставшиеся файлы
const shoelaceSource = join(projectDir, 'node_modules/@shoelace-style/shoelace/dist/assets');
await cp(shoelaceSource, shoelaceAssetsDir, { recursive: true });

await cp(join(bootstrapDir, 'global.css'), join(assetsDir, 'global.css'));
await cp(join(bootstrapDir, 'favicon.svg'), join(assetsDir, 'favicon.svg'));
await cp('node_modules/@shoelace-style/shoelace/dist/themes/light.css', join(assetsDir, 'light.css'));
await cp(join(projectDir, 'src/app/ui/page/assets'), assetsDir, { recursive: true });

console.log(`✅ Build complete: index-${hash}.js`);
