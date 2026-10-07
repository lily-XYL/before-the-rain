'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), source = path.join(root, 'release/雨停之前_v1.0.0'), target = path.join(root, 'android/assets/game');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'release-manifest.json'), 'utf8'));
assert.equal(manifest.verification, 'passed'); fs.mkdirSync(target, { recursive: true });
for (const entry of manifest.files) {
  if (!/\.(js|css|html|png)$/.test(entry.path)) continue;
  const input = path.resolve(source, entry.path), output = path.resolve(target, entry.path);
  assert.ok(input.startsWith(source + path.sep) && output.startsWith(target + path.sep));
  const bytes = fs.readFileSync(input);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, bytes);
}
let html = fs.readFileSync(path.join(target, 'index.html'), 'utf8');
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
html = html.replace('<head>', '<head>\n  <meta http-equiv="Content-Security-Policy" content="' + csp + '">');
html = html.replace('width=device-width, initial-scale=1', 'width=device-width, initial-scale=1, viewport-fit=cover');
html = html.replace('</head>', '  <link rel="stylesheet" href="mobile.css">\n</head>');
html = html.replace('</body>', '  <script src="mobile.js"></script>\n</body>');
fs.writeFileSync(path.join(target, 'index.html'), html);
const appFile = path.join(target, 'app.js');
const app = fs.readFileSync(appFile, 'utf8');
assert.ok(/\}\)\(\);\s*$/.test(app));
fs.writeFileSync(appFile, app.replace(/\}\)\(\);\s*$/, `  window.RainMobileActivity = {
    pause() { clearTimeout(autoTimer); clearInterval(musicTimer); if (audioContext) audioContext.suspend().catch(() => {}); },
    resume() { scheduleAuto(); if (audioContext && settings.music) syncMusic(); }
  };
})();\n`));
for (const name of ['mobile.css', 'mobile.js']) fs.copyFileSync(path.join(root, 'android', name), path.join(target, name));
console.log('Android assets staged: ' + manifest.chapters + ' chapter modules, 33 images.');
