'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const asar = require('../desktop/node_modules/@electron/asar');
const root = path.resolve(__dirname, '..'), archive = path.join(root, 'release/desktop-build/win-unpacked/resources/app.asar');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release/雨停之前_v1.0.0/release-manifest.json'), 'utf8'));
const checked = [];
function verify(input, entry, expected) {
  const bytes = asar.extractFile(archive, path.normalize(entry));
  assert.equal(digest(bytes), expected || digest(fs.readFileSync(input)), entry);
  checked.push({ path: entry, bytes: bytes.length, sha256: digest(bytes) });
}
for (const entry of manifest.files) {
  if (!/\.(js|css|html|png)$/.test(entry.path)) continue;
  verify(path.join(root, 'desktop/game', entry.path), 'game/' + entry.path, entry.path === 'index.html' ? undefined : entry.sha256);
}
for (const file of ['main.cjs', 'preload.cjs']) verify(path.join(root, 'desktop', file), file);
for (const file of ['window.js', 'window.css']) verify(path.join(root, 'desktop', file), 'game/' + file);
const entries = asar.listPackage(archive).map(p => p.replace(/\\/g, '/').replace(/^\//, ''));
assert.ok(entries.every(p => p === 'package.json' || p === 'main.cjs' || p === 'preload.cjs' || p === 'game' || p.startsWith('game/')), 'Only runtime files belong in the package');
assert.equal(checked.filter(p => p.path.endsWith('.png')).length, 33);
const report = { result: 'passed', verifiedAt: new Date().toISOString(), archive, archiveSha256: digest(fs.readFileSync(archive)), runtimeFilesChecked: checked.length, images: 33, files: checked };
fs.mkdirSync(path.join(root, 'release/verification/desktop'), { recursive: true });
fs.writeFileSync(path.join(root, 'release/verification/desktop/package-integrity.json'), JSON.stringify(report, null, 2));
console.log('ASAR integrity verified: ' + checked.length + ' runtime files, 33 images; no development files.');
