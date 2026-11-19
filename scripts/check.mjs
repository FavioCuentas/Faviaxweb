import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { DISCOGRAPHY, TRILOGY, UNIVERSE_ENTRIES, CHRONICLES_COLLAGE, TIMELINE_MILESTONES, MERCH_CONFIG } from '../src/data.js';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const jsFiles = [
  'main.js',
  'src/data.js',
  'src/router.js',
  'src/views.js',
  'scripts/dev-server.mjs',
  'scripts/build.mjs',
  'scripts/check.mjs',
  'tests/e2e.mjs',
];

for (const file of jsFiles) {
  await execFileAsync(process.execPath, ['--check', path.join(ROOT, file)]);
}

const referencedAssets = new Set([
  '/assets/skyline-rain.jpg',
  '/assets/hero-bg.png',
  MERCH_CONFIG.heroImage,
  ...DISCOGRAPHY.map((d) => d.cover),
  ...TRILOGY.map((b) => b.cover),
  ...UNIVERSE_ENTRIES.map((u) => u.image),
  ...CHRONICLES_COLLAGE.map((c) => c.image),
  ...TIMELINE_MILESTONES.map((m) => m.image),
]);

for (const rel of referencedAssets) {
  const full = path.join(ROOT, rel.replace(/^\//, ''));
  const stat = await fs.stat(full);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error(`Missing or empty asset: ${rel}`);
  }
}

console.log(`Syntax check passed (${jsFiles.length} files) and verified ${referencedAssets.size} local assets.`);
