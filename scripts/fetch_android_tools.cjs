'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const directory = path.resolve(__dirname, '../.build-cache/android-tools');
fs.mkdirSync(directory, { recursive: true });
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(response.status + ' ' + url);
  return response;
}
(async () => {
  const base = 'https://dl.google.com/dl/android/maven2/com/android/tools/r8/';
  const metadata = await (await get(base + 'maven-metadata.xml')).text();
  const version = Array.from(metadata.matchAll(/<version>([^<]+)<\/version>/g), match => match[1]).filter(value => /^[\d.]+$/.test(value)).at(-1);
  if (!version || !/^[\d.]+$/.test(version)) throw new Error('No stable R8 version in official metadata');
  const url = base + version + '/r8-' + version + '.jar';
  const expected = (await (await get(url + '.sha1')).text()).trim();
  if (!/^[\da-f]{40}$/i.test(expected)) throw new Error('Invalid published checksum');
  const bytes = Buffer.from(await (await get(url)).arrayBuffer());
  const actual = crypto.createHash('sha1').update(bytes).digest('hex');
  if (actual !== expected.toLowerCase()) throw new Error('R8 checksum mismatch');
  fs.writeFileSync(path.join(directory, 'r8.jar'), bytes);
  const record = { version, url, bytes: bytes.length, publishedSha1: expected, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
  fs.writeFileSync(path.join(directory, 'r8-lock.json'), JSON.stringify(record, null, 2));
  console.log(JSON.stringify(record, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
