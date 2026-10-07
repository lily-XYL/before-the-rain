'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), source = path.join(root, 'release/雨停之前_v1.0.0'), target = path.join(root, 'desktop/game');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'release-manifest.json'), 'utf8'));
assert.equal(manifest.verification, 'passed');
fs.mkdirSync(target, { recursive: true });
for (const entry of manifest.files) {
  if (!/\.(js|css|html|png)$/.test(entry.path)) continue;
  const input = path.resolve(source, entry.path), output = path.resolve(target, entry.path);
  assert.ok(input.startsWith(source + path.sep) && output.startsWith(target + path.sep));
  const bytes = fs.readFileSync(input);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), entry.sha256, 'Release hash: ' + entry.path);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, bytes);
}
let html = fs.readFileSync(path.join(target, 'index.html'), 'utf8');
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'";
html = html.replace('<head>', '<head>\n  <meta http-equiv="Content-Security-Policy" content="' + csp + '">');
html = html.replace('</head>', '  <link rel="stylesheet" href="window.css">\n</head>');
html = html.replace('</body>', '  <script src="window.js"></script>\n</body>');
fs.writeFileSync(path.join(target, 'index.html'), html);
for (const name of ['window.css', 'window.js']) fs.copyFileSync(path.join(root, 'desktop', name), path.join(target, name));
console.log('Staged verified complete game: ' + manifest.chapters + ' chapters, ' + manifest.finalEndings + ' endings.');
