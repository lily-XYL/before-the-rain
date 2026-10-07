'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), android = path.join(root, 'android'), build = path.join(android, 'build'), out = path.join(root, 'release/verification/android');
const sdk = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || path.join(process.env.LOCALAPPDATA, 'Android/Sdk');
const javaHome = process.env.JAVA_HOME || 'C:/Program Files/Eclipse Adoptium/jdk-21.0.12.8-hotspot';
const java = name => path.join(javaHome, 'bin', name + '.exe');
const tools = path.join(sdk, 'build-tools/34.0.0'), platform = path.join(sdk, 'platforms/android-34/android.jar');
for (const directory of [build, out, path.join(build, 'classes'), path.join(build, 'dex'), path.join(android, 'signing')]) fs.mkdirSync(directory, { recursive: true });
function run(program, args) {
  let text;
  try { text = execFileSync(program, args, { cwd: root, windowsHide: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 8 * 1024 * 1024 }); }
  catch (error) { console.error(String(error.stderr || error.message).slice(0, 4000)); throw new Error(path.basename(program) + ' failed at exit ' + error.status); }
  if (text.trim()) console.log(text.trim()); return text;
}
console.log('Building Android APK with SDK 34 / Build Tools 34.0.0.');
require('./stage_android.cjs');
run(java('javac'), ['-J-Duser.language=en', '-J-Dfile.encoding=UTF-8', '-encoding', 'UTF-8', '--release', '8', '-g', '-classpath', platform, '-d', path.join(build, 'classes'), path.join(android, 'src/local/beforetherain/game/MainActivity.java')]);
run(java('jar'), ['--create', '--file', path.join(build, 'app-classes.jar'), '-C', path.join(build, 'classes'), '.']);
const modernD8 = path.join(root, '.build-cache/android-tools/r8.jar');
run(java('java'), ['-cp', fs.existsSync(modernD8) ? modernD8 : path.join(tools, 'lib/d8.jar'), 'com.android.tools.r8.D8', '--release', '--min-api', '26', '--lib', platform, '--output', path.join(build, 'dex'), path.join(build, 'app-classes.jar')]);
run(path.join(tools, 'aapt2.exe'), ['compile', '--dir', path.join(android, 'res'), '-o', path.join(build, 'resources.zip')]);
const unsigned = path.join(build, 'game-unsigned.apk'), aligned = path.join(build, 'game-aligned.apk'), target = path.join(root, 'release/雨停之前_v1.0.0.apk');
run(path.join(tools, 'aapt2.exe'), ['link', '-I', platform, '--manifest', path.join(android, 'AndroidManifest.xml'), '--min-sdk-version', '26', '--target-sdk-version', '34', '-o', unsigned, path.join(build, 'resources.zip')]);
// AAPT2 34 on Windows can emit backslashes in asset entry names. JAR writes portable
// forward-slash ZIP paths, which Android AssetManager requires at runtime.
run(java('jar'), ['--update', '--file', unsigned, '--no-manifest', '-C', android, 'assets', '-C', path.join(build, 'dex'), 'classes.dex']);
run(path.join(tools, 'zipalign.exe'), ['-f', '-p', '4', unsigned, aligned]);
const keystore = path.join(android, 'signing/rain-release.p12'), password = path.join(android, 'signing/store-password.txt');
if (!fs.existsSync(keystore)) {
  if (!fs.existsSync(password)) fs.writeFileSync(password, crypto.randomBytes(32).toString('hex'));
  run(java('keytool'), ['-genkeypair', '-keystore', keystore, '-storetype', 'PKCS12', '-storepass:file', password, '-alias', 'rain', '-keyalg', 'RSA', '-keysize', '3072', '-validity', '10000', '-dname', 'CN=Before The Rain, O=Before The Rain, C=CN']);
}
const signer = path.join(tools, 'lib/apksigner.jar');
run(java('java'), ['-jar', signer, 'sign', '--ks', keystore, '--ks-key-alias', 'rain', '--ks-pass', 'file:' + password, '--out', target, aligned]);
const signature = run(java('java'), ['-jar', signer, 'verify', '--verbose', '--print-certs', target]);
const alignment = run(path.join(tools, 'zipalign.exe'), ['-c', '-p', '4', target]);
const metadata = run(path.join(tools, 'aapt2.exe'), ['dump', 'badging', target]);
if (!/Verified using v2 scheme.*true/.test(signature) || !metadata.includes("sdkVersion:'26'") || !metadata.includes("targetSdkVersion:'34'")) throw new Error('APK verification failed');
fs.writeFileSync(path.join(out, 'signature.txt'), signature); fs.writeFileSync(path.join(out, 'metadata.txt'), metadata);
const bytes = fs.readFileSync(target);
const result = { result: 'passed', builtAt: new Date().toISOString(), file: target, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), package: 'local.beforetherain.game', minSdk: 26, targetSdk: 34, buildTools: '34.0.0', signed: true, aligned: true, signingKey: 'android/signing/rain-release.p12', nativeLibraries: false, deviceTested: false };
fs.writeFileSync(path.join(out, 'apk-build.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
