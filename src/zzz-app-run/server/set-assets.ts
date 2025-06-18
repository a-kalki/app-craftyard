import { cp, mkdir, rmdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

const projectDir = cwd();
const publicDir = join(projectDir, 'src/zzz-app-run/public');
const assetsDir = join(publicDir, 'assets');
const shoelaceAssetsDir = join(assetsDir, 'assets');

// 💡 Копируем Shoelace assets (папка assets внутри assetsDir)
const shoelaceSource = join(projectDir, 'node_modules/@shoelace-style/shoelace/dist/assets');
await cp(shoelaceSource, shoelaceAssetsDir, { recursive: true });

// Копируем статики приложения (в assets)
const appStaticSource = join(projectDir, 'src/app/ui/page/assets');
await cp(appStaticSource, assetsDir, { recursive: true });

console.log('✅ Assets copied completed.');
