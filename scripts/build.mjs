import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(DIST, { recursive: true });

for (const file of ['index.html', 'index.css', 'main.js']) {
  await fs.copyFile(path.join(ROOT, file), path.join(DIST, file));
}

await fs.cp(path.join(ROOT, 'src'), path.join(DIST, 'src'), { recursive: true });
await fs.cp(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });

console.log('Built FAVIAX static output into dist/');
