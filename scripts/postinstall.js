/**
 * Installs the renderer's dependencies after a root install, so a fresh clone
 * only needs one `npm install`.
 *
 * Skipped under CI: nesting an `npm install` inside the postinstall of an
 * `npm ci` makes the child inherit the parent's npm config and lockfile
 * expectations, which is fragile and platform-dependent. CI installs each
 * workspace explicitly instead.
 */
const { execSync } = require('child_process');
const path = require('path');

if (process.env.CI) {
  console.log('[postinstall] CI detected — renderer install is handled by the workflow.');
  process.exit(0);
}

const rendererDir = path.join(__dirname, '..', 'renderer');

console.log('[postinstall] Installing renderer dependencies...');
execSync('npm install', { cwd: rendererDir, stdio: 'inherit' });
