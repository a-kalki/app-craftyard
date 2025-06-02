import { cp, mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';

const outDir = 'src/zzz-app-run/public';
const projectDir = cwd();

await Bun.build({
  entrypoints: ['src/app/ui/base/bootstrap.ts'],
  outdir: `${outDir}/assets`,
  target: 'browser',
  format: 'esm',
  sourcemap: 'external',
  minify: false,
});

// 💡 Копируем Shoelace assets
const shoelaceSource = join(projectDir, 'node_modules/@shoelace-style/shoelace/dist/assets');
const shoelaceTarget = join(projectDir, outDir, 'assets');

await mkdir(shoelaceTarget, { recursive: true });
await cp(shoelaceSource, shoelaceTarget, { recursive: true });

// 💡 Копируем статики сервера
const serverStaticSource = join(projectDir, 'src/zzz-app-run/static');
const serverStaticTarget = join(projectDir, outDir);

await mkdir(serverStaticTarget, { recursive: true });
await cp(serverStaticSource, serverStaticTarget, { recursive: true });

// 💡 Копируем статики приложения
const appStaticSource = join(projectDir, 'src/app/ui/page/assets');
const appStaticTarget = join(projectDir, outDir, 'assets');

await mkdir(appStaticTarget, { recursive: true });
await cp(appStaticSource, appStaticTarget, { recursive: true });

console.log('✅ Build complete, assets copied.');
