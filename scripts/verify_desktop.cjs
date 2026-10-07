'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { _electron, chromium } = require('C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { spawn } = require('node:child_process');
const { finals, story } = require('./release_fixtures.cjs');
const root = path.resolve(__dirname, '..'), out = path.join(root, 'release/verification/desktop');
fs.mkdirSync(out, { recursive: true });
const key = 'before-the-rain-chapter-one-v1:', profile = path.join(out, 'test-profile'), checks = [], errors = [];
const unpacked = path.join(root, 'release/desktop-build/win-unpacked/雨停之前.exe');
let electron, remote, child;
const env = { ...process.env, RAIN_DESKTOP_TEST_PROFILE: profile };
delete env.ELECTRON_RUN_AS_NODE;
async function launch() {
  electron = await _electron.launch({ executablePath: unpacked, args: ['--rain-test'], env, timeout: 60000 });
  const page = await electron.firstWindow();
  // Windows only reports native fullscreen for a visible HWND. Keep the test window
  // completely transparent and off the taskbar so it can exercise that state without appearing.
  await electron.evaluate(({ BrowserWindow }) => {
    const w = BrowserWindow.getAllWindows()[0]; w.setOpacity(0); w.setSkipTaskbar(true); w.showInactive();
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.waitForFunction(() => window.RainDesktop && window.RainStory && window.RainSaveBackup);
  return page;
}
async function waitState(predicate) {
  for (let i = 0; i < 100; i++) {
    if (await electron.evaluate(async ({ BrowserWindow }, source) => {
      const win = BrowserWindow.getAllWindows()[0];
      const logical = await win.webContents.executeJavaScript('window.RainDesktop.state()');
      const state = { maximized: win.isMaximized(), minimized: win.isMinimized(), fullscreen: logical.fullscreen };
      return new Function('s', 'return ' + source)(state);
    }, predicate)) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Window state timeout: ' + predicate);
}
async function closeByButton(page) {
  const closed = electron.waitForEvent('close');
  await page.locator('#window-close').click();
  await closed;
  electron = null;
}
async function connect(port) {
  for (let i = 0; i < 240; i++) {
    try {
      const result = await fetch('http://127.0.0.1:' + port + '/json/version');
      if (result.ok) return chromium.connectOverCDP((await result.json()).webSocketDebuggerUrl);
    } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('Portable EXE did not expose a ready test window');
}
(async () => {
  const samples = finals();
  let page = await launch();
  assert.equal(page.url(), 'rain://game/index.html');
  assert.equal(await page.evaluate(() => typeof require), 'undefined');
  const prefs = await electron.evaluate(({ BrowserWindow, app }) => {
    const w = BrowserWindow.getAllWindows()[0];
    return { prefs: w.webContents.getLastWebPreferences(), menu: w.isMenuBarVisible(), packaged: app.isPackaged, profile: app.getPath('userData'), bounds: w.getBounds(), content: w.getContentBounds() };
  });
  assert.equal(prefs.packaged, true);
  assert.equal(prefs.menu, false);
  assert.equal(prefs.prefs.contextIsolation, true);
  assert.equal(prefs.prefs.nodeIntegration, false);
  assert.equal(prefs.prefs.sandbox, true);
  assert.equal(prefs.profile, profile);
  assert.deepEqual(prefs.bounds, prefs.content, 'Native frame must not occupy any space');
  assert.equal(await page.locator('#speaker-role').count(), 0);
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.topbar')).getPropertyValue('-webkit-app-region')), 'drag');
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#window-close')).getPropertyValue('-webkit-app-region')), 'no-drag');
  checks.push('packagedFramelessWindowAndIsolatedRenderer');
  await page.locator('#window-maximize').click();
  await waitState('s.maximized');
  await page.waitForFunction(() => document.getElementById('window-maximize').title === '还原窗口');
  await page.locator('#window-maximize').click();
  await waitState('!s.maximized');
  await page.locator('#window-minimize').click();
  await waitState('s.minimized');
  await electron.evaluate(({ BrowserWindow }) => { BrowserWindow.getAllWindows()[0].restore(); BrowserWindow.getAllWindows()[0].showInactive(); });
  await page.keyboard.press('F11'); await waitState('s.fullscreen');
  const fullBounds = await electron.evaluate(({ BrowserWindow, screen }) => {
    const bounds = BrowserWindow.getAllWindows()[0].getBounds(); return { bounds, display: screen.getDisplayMatching(bounds).bounds };
  });
  assert.deepEqual(fullBounds.bounds, fullBounds.display, 'Fullscreen must fill the actual display');
  await page.keyboard.press('Escape'); await waitState('!s.fullscreen');
  assert.equal(await page.evaluate(() => innerWidth), prefs.content.width, 'Esc restores the original width');
  assert.equal(await page.evaluate(() => innerHeight), prefs.content.height, 'Esc restores the original height');
  await page.locator('[data-panel="settings"]').click();
  await page.locator('#fullscreen-button').click(); await waitState('s.fullscreen');
  await page.locator('#fullscreen-button').click(); await waitState('!s.fullscreen');
  await page.locator('#close-panel').click();
  checks.push('customMinimizeMaximizeRestoreAndFullscreenKeys');
  for (const width of [1440, 960]) {
    await electron.evaluate(({ BrowserWindow }, width) => BrowserWindow.getAllWindows()[0].setSize(width, 900), width);
    await page.waitForFunction(width => innerWidth === width, width);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const bounds = await page.evaluate(() => {
      const nav = document.querySelector('.topbar nav').getBoundingClientRect(), controls = document.querySelector('.window-controls').getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > innerWidth, overlap: nav.right > controls.left };
    });
    assert.equal(bounds.overflow, false); assert.equal(bounds.overlap, false);
  }
  await electron.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(1440, 900));
  await page.waitForFunction(() => innerWidth === 1440);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.screenshot({ path: path.join(out, 'desktop-title.png') });
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'release/雨停之前_v1.0.0/release-manifest.json'), 'utf8'));
  const images = manifest.files.filter(f => f.path.endsWith('.png')).map(f => f.path);
  const imageChecks = await page.evaluate(async images => Promise.all(images.map(src => new Promise(resolve => {
    const image = new Image(); image.onload = () => resolve({ src, ok: image.naturalWidth > 0 }); image.onerror = () => resolve({ src, ok: false }); image.src = src;
  }))), images);
  assert.equal(imageChecks.length, 33); assert.ok(imageChecks.every(i => i.ok));
  checks.push('all33ImagesLoadOfflineAndControlsFitMinimumWindow');
  const denied = await page.evaluate(async () => {
    let external = false; try { await fetch('https://example.com'); external = true; } catch (_) {}
    return { external };
  });
  const wrongHost = await electron.evaluate(async ({ net }) => (await net.fetch('rain://other/index.html')).status);
  assert.equal(wrongHost, 404); assert.equal(denied.external, false);
  checks.push('externalNetworkAndWrongProtocolHostDenied');
  for (const [id, state] of Object.entries(samples)) {
    await page.evaluate(({ key, state }) => {
      localStorage.setItem(key + 'auto', JSON.stringify({ savedAt: new Date().toISOString(), state }));
      localStorage.setItem(key + 'settings', JSON.stringify({ speed: 'instant', music: false, volume: 25 }));
    }, { key, state });
    await page.reload(); await page.locator('#continue-button').click();
    assert.equal(await page.locator('#ending-title').innerText(), story.endings[id].title);
    assert.match(await page.locator('#ending-note').innerText(), /秋日尾声已读完/);
    assert.equal(await page.locator('#next-chapter-button').isVisible(), false);
  }
  await page.locator('[data-panel="gallery"]').click();
  assert.equal(await page.locator('.gallery-card').count(), 74);
  assert.equal(await page.locator('.gallery-card:not(.locked)').count(), 13);
  await page.locator('#close-panel').click();
  await page.screenshot({ path: path.join(out, 'desktop-final.png') });
  checks.push('all13CanonicalEndingsAnd74CollectionCards');
  await page.locator('[data-panel="settings"]').click();
  await electron.evaluate(({ session }) => {
    global.rainDownloadResult = null;
    session.defaultSession.once('will-download', (_event, item) => {
      item.once('done', (_done, state) => { global.rainDownloadResult = { state, file: item.getSavePath() }; });
    });
  });
  await page.locator('#export-backup').click();
  let download;
  for (let i = 0; i < 200; i++) {
    download = await electron.evaluate(() => global.rainDownloadResult);
    if (download) break;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.equal(download?.state, 'completed', 'Native Electron backup download completes');
  assert.ok(download.file.startsWith(profile + path.sep));
  fs.copyFileSync(download.file, path.join(out, 'desktop-backup.json'));
  const backup = JSON.parse(fs.readFileSync(path.join(out, 'desktop-backup.json'), 'utf8'));
  assert.equal(Object.keys(backup.endings).length, 13);
  await page.locator('#backup-file').setInputFiles(path.join(out, 'desktop-backup.json'));
  await page.locator('#confirm-action').click();
  await page.locator('#continue-button').click();
  assert.equal(await page.locator('#ending-title').innerText(), story.endings.self_forward.title);
  await closeByButton(page);
  page = await launch(); await page.locator('#continue-button').click();
  assert.equal(await page.locator('#ending-title').innerText(), story.endings.self_forward.title);
  await closeByButton(page);
  checks.push('backupFileImportAndSavePersistenceAfterCustomCloseAndRelaunch');

  if (process.argv.includes('--unpacked-only')) {
    fs.writeFileSync(path.join(out, 'unpacked-verification.json'), JSON.stringify({ result: 'passed', checks, errors, packagedPreferences: prefs }, null, 2));
    console.log('Unpacked desktop checks passed: ' + checks.join(', '));
    return;
  }
  // Run the delivered one-file launcher in a different directory, using the same isolated save profile.
  const portable = path.resolve(process.argv[2] || path.join(root, 'release/desktop-build/雨停之前_v1.0.0.exe'));
  const moved = path.join(out, '移动后的游戏.exe'); fs.copyFileSync(portable, moved);
  const port = 19473;
  child = spawn(moved, ['--rain-test', '--remote-debugging-port=' + port, '--remote-debugging-address=127.0.0.1'], { env, windowsHide: true, stdio: 'ignore', cwd: out });
  const exited = new Promise(resolve => child.once('exit', resolve));
  remote = await connect(port);
  page = remote.contexts()[0].pages().find(p => p.url().startsWith('rain://game'));
  assert.ok(page, 'Actual portable launcher must load the game');
  page.on('pageerror', error => errors.push(error.message));
  await page.waitForFunction(() => window.RainDesktop && window.RainStory);
  await page.keyboard.press('F11');
  await page.waitForFunction(async () => (await window.RainDesktop.state()).fullscreen);
  await page.waitForFunction(() => innerWidth === screen.width && innerHeight === screen.height);
  await page.keyboard.press('Escape');
  await page.waitForFunction(async () => !(await window.RainDesktop.state()).fullscreen);
  await page.waitForFunction(() => innerWidth === 1440 && innerHeight === 900);
  await page.locator('#continue-button').click();
  assert.equal(await page.locator('#ending-title').innerText(), story.endings.self_forward.title);
  assert.equal(await page.evaluate(() => location.origin), 'rain://game');
  await page.screenshot({ path: path.join(out, 'portable-moved.png') });
  await page.locator('#window-close').click();
  await Promise.race([exited, new Promise((_resolve, reject) => setTimeout(() => reject(new Error('Portable launcher did not exit')), 15000).unref())]);
  remote = null; child = null;
  assert.equal(errors.length, 0, errors.join('\n'));
  checks.push('actualSingleExeStartsFromAnotherDirectoryAndRestoresSameSave');
  const report = { result: 'passed', verifiedAt: new Date().toISOString(), checks, rendererErrors: errors, packagedPreferences: prefs, images: imageChecks.length, portable: { file: portable, bytes: fs.statSync(portable).size } };
  fs.writeFileSync(path.join(out, 'desktop-verification.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
})().catch(async error => {
  console.error(error);
  fs.writeFileSync(path.join(out, 'desktop-verification-failure.json'), JSON.stringify({ checks, errors, failure: error.stack }, null, 2));
  if (electron) await electron.close().catch(() => {});
  if (remote) await remote.close().catch(() => {});
  if (child) child.kill();
  process.exitCode = 1;
});
