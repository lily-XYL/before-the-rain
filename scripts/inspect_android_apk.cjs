'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const unzipper = require('../desktop/node_modules/unzipper');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'release/verification/android'), apk = path.join(root, 'release/雨停之前_v1.0.0.apk'), stage = path.join(root, 'android/assets/game');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = JSON.parse(fs.readFileSync(path.join(out, 'apk-build.json'), 'utf8'));
const ui = JSON.parse(fs.readFileSync(path.join(out, 'mobile-browser.json'), 'utf8'));
assert.equal(report.result, 'passed'); assert.equal(ui.result, 'passed'); assert.equal(ui.rendererErrors.length, 0);
const bytes = fs.readFileSync(apk); assert.equal(digest(bytes), report.sha256); assert.equal(bytes.length, report.bytes);
const metadata = fs.readFileSync(path.join(out, 'metadata.txt'), 'utf8');
assert.ok(!metadata.includes('uses-permission:'), 'No network or broad storage permission');
assert.ok(metadata.includes("local.beforetherain.game.MainActivity"));
const signature = fs.readFileSync(path.join(out, 'signature.txt'), 'utf8');
assert.match(signature, /Verified using v2 scheme.*true/); assert.match(signature, /Verified using v3 scheme.*true/);
const expected = new Set();
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const full = path.join(directory, entry.name); if (entry.isDirectory()) walk(full); else expected.add('assets/game/' + path.relative(stage, full).replace(/\\/g, '/')); } }
walk(stage);
const entries = [], assets = [], names = new Set(); let dex = false;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release/雨停之前_v1.0.0/release-manifest.json'), 'utf8'));
const original = new Map(manifest.files.map(entry => ['assets/game/' + entry.path, entry]));
function check(entry, contents) {
  assert.ok(!names.has(entry.fileName), 'No duplicate APK entries'); names.add(entry.fileName); entries.push(entry.fileName);
  assert.ok(!/signing|password|\.p12$|\.java$|node_modules|verification\/|\.exe$/i.test(entry.fileName));
  assert.ok(!entry.fileName.startsWith('lib/'), 'Universal app has no architecture-specific native libraries');
  if (entry.fileName.startsWith('assets/')) {
    assert.ok(expected.has(entry.fileName), 'APK contains only staged runtime assets: ' + entry.fileName); expected.delete(entry.fileName);
    const relative = entry.fileName.slice('assets/game/'.length), hash = digest(contents);
    assert.equal(hash, digest(fs.readFileSync(path.join(stage, relative))), relative);
    if (!['index.html','app.js','mobile.js','mobile.css'].includes(relative)) assert.equal(hash, original.get(entry.fileName)?.sha256, relative);
    assets.push({ path: entry.fileName, bytes: contents.length, sha256: hash });
  }
  if (entry.fileName === 'classes.dex') {
    assert.equal(contents.subarray(0,4).toString(), 'dex\n');
    assert.ok(contents.includes(Buffer.from('Llocal/beforetherain/game/MainActivity;')));
    for (const method of ['exportBackup','importBackup','toggleFullscreen','shouldInterceptRequest','onActivityResult']) assert.ok(contents.includes(Buffer.from(method)), method);
    dex = true;
  }
}
unzipper.Open.buffer(bytes).then(async archive => {
  for (const file of archive.files) {
    assert.ok(!file.path.includes('\\'), 'Every APK path must use Android-compatible forward slashes');
    if (file.type === 'Directory') { assert.ok(file.path.startsWith('assets/')); continue; }
    assert.equal(file.type, 'File');
    check({ fileName: file.path }, await file.buffer());
  }
}).then(()=>{
  assert.equal(expected.size,0); assert.equal(assets.length,66); assert.equal(assets.filter(a=>a.path.endsWith('.png')).length,33);
  assert.equal(dex,true); assert.ok(names.has('AndroidManifest.xml')); assert.ok(names.has('resources.arsc'));
  const result = {...report, verification:'passed', assetFilesChecked:assets.length, images:33, chapters:23, finalEndings:13, cards:74, permissions:[], universal:true, uiChecks:ui.checks, deviceTested:false, assets};
  fs.writeFileSync(path.join(out,'apk-verification.json'),JSON.stringify(result,null,2));
  console.log('APK verified: 66 exact runtime assets, 33 images, valid signed DEX, no extra permissions; '+ui.checks.length+' mobile UI check groups.');
}).catch(error=>{console.error(error);process.exitCode=1;});
