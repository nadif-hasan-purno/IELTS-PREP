/* eslint-disable */

import { copyFileSync, existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const src = join(root, 'static.json');
const destDir = join(root, 'dist');
const dest = join(destDir, 'static.json');

if (!existsSync(src)) {
  console.error('ERROR: static.json not found at repo root:', src);
  process.exit(1);
}
if (!existsSync(destDir)) {
  console.error('ERROR: dist directory not found; run the build first:', destDir);
  process.exit(1);
}
copyFileSync(src, dest);
console.log('Copied static.json to dist/static.json');
