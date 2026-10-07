'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { finals, story, engine } = require('./release_fixtures.cjs');
const root = path.resolve(__dirname, '..'), game = path.join(root, 'android/assets/game'), out = path.join(root, 'release/verification/android');
const home = 'https://appassets.androidplatform.net/game/index.html', key = 'before-the-rain-chapter-one-v1:';
fs.mkdirSync(out, { recursive: true });
let browser;
const checks = [], errors = [], shots = [];
function decisionState(count) {
  let state = engine.create(story);
  for (let steps = 0; steps < Object.keys(story.nodes).length; steps++) {
    const node = story.nodes[state.node];
    if (node.choices?.length === count) return state;
    if (state.ending) { const next = engine.continueChapter(story, state); if (next === state) break; state = next; }
    else state = engine.advance(story, state, node.choices ? 0 : undefined);
  }
  throw new Error('Could not find canonical ' + count + '-choice state');
}
async function context(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'https://appassets.androidplatform.net' || !url.pathname.startsWith('/game/')) return route.abort();
    const file = path.resolve(game, '.' + decodeURIComponent(url.pathname).slice(5));
    if (!file.startsWith(game + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: '' });
    const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream';
    await route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: type });
  });
  await context.addInitScript(() => {
    window.nativeCalls = [];
    window.RainAndroid = { exportBackup: text => window.nativeCalls.push({ kind: 'export', text }), importBackup: () => window.nativeCalls.push({ kind: 'import' }), toggleFullscreen: () => window.nativeCalls.push({ kind: 'fullscreen' }) };
  });
  return context;
}
async function load(page, state) {
  await page.goto(home);
  await page.evaluate(({ key, state }) => {
    localStorage.setItem(key + 'auto', JSON.stringify({ savedAt: new Date().toISOString(), state }));
    localStorage.setItem(key + 'settings', JSON.stringify({ speed: 'instant', music: false, volume: 25 }));
  }, { key, state });
  await page.reload(); await page.locator('#continue-button').click();
}
async function layout(page) {
  const bounds = await page.evaluate(() => {
    const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    return { width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight, toolbar: box('.dialogue-toolbar'), dialogue: box('#dialogue-box'), choice: box('#choice-box'), buttonSizes: [...document.querySelectorAll('.dialogue-toolbar button')].filter(b => getComputedStyle(b).display !== 'none').map(b => ({ width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height })) };
  });
  assert.ok(bounds.documentWidth <= bounds.width, 'No horizontal overflow: ' + JSON.stringify(bounds));
  assert.ok(bounds.documentHeight <= bounds.height + 1, 'Story screen remains within viewport: ' + JSON.stringify(bounds));
  assert.ok(bounds.toolbar.bottom <= bounds.height + 1, 'Toolbar remains visible');
  assert.ok(bounds.toolbar.left >= 0 && bounds.toolbar.right <= bounds.width + 1);
  assert.equal(bounds.buttonSizes.length, 5);
  assert.ok(bounds.buttonSizes.every(b => b.width >= 43 && b.height >= 44), 'Touch controls have sufficient area');
  assert.ok(bounds.choice.height > 45);
  const overlapX = Math.min(bounds.choice.right, bounds.dialogue.right) - Math.max(bounds.choice.left, bounds.dialogue.left);
  const overlapY = Math.min(bounds.choice.bottom, bounds.dialogue.bottom) - Math.max(bounds.choice.top, bounds.dialogue.top);
  assert.ok(overlapX <= 1 || overlapY <= 1, 'Choices do not cover dialogue');
}
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const three = decisionState(3), five = decisionState(5), samples = finals();
  for (const [width, height] of [[320,568],[360,640],[390,844],[412,915],[667,375],[844,390],[915,412],[768,1024]]) {
    const c = await context(width,height), page = await c.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(home); await page.waitForFunction(() => window.RainMobile);
    assert.ok(await page.locator('#start-button').isVisible());
    assert.equal(await page.locator('#speaker-role').count(), 0);
    for (const state of [three,five]) {
      await load(page,state); await layout(page);
      const count = story.nodes[state.node].choices.length;
      assert.equal(await page.locator('#choices button').count(), count);
      await page.locator('#choices button').last().scrollIntoViewIfNeeded();
      await layout(page);
      if (count === 5) { const shot = 'mobile-choices-' + width + 'x' + height + '.png'; await page.screenshot({ path: path.join(out,shot) }); shots.push(shot); }
      await page.locator('#choices button').last().tap();
      assert.notEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key+'auto')).state.node,key),state.node);
    }
    await page.locator('[data-panel="settings"]').tap();
    const panel = await page.evaluate(() => {
      const p=document.getElementById('panel'), r=p.getBoundingClientRect();
      return { left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight,overflow:document.getElementById('panel-content').scrollWidth>document.getElementById('panel-content').clientWidth };
    });
    assert.ok(panel.left>=0 && panel.right<=panel.width+1 && panel.top>=0 && panel.bottom<=panel.height+1);
    assert.equal(panel.overflow,false);
    await page.locator('#export-backup').scrollIntoViewIfNeeded(); await page.locator('#export-backup').tap();
    const backup = await page.evaluate(() => JSON.parse(window.nativeCalls.find(c=>c.kind==='export').text));
    assert.equal(backup.storyId,story.id); assert.ok(engine.restore(story,backup.saves.auto.state));
    await page.locator('#import-backup').tap(); assert.equal(await page.evaluate(()=>window.nativeCalls.at(-1).kind),'import');
    await page.locator('#fullscreen-button').scrollIntoViewIfNeeded(); await page.locator('#fullscreen-button').tap();
    assert.equal(await page.evaluate(()=>window.nativeCalls.at(-1).kind),'fullscreen');
    assert.equal(await page.evaluate(()=>window.RainMobile.back()),'handled'); assert.equal(await page.locator('#panel').isVisible(),false);
    assert.equal(await page.evaluate(()=>window.RainMobile.back()),'handled'); assert.equal(await page.locator('#panel').isVisible(),true);
    await page.locator('#resume-story').tap();
    await page.locator('[data-panel="save"]').tap(); await page.locator('.slot').first().tap();
    assert.ok(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'slot1')),key));
    await page.reload(); await page.locator('#continue-button').tap();
    checks.push('touchLayoutChoicesSettingsBackupContractAndRestart_' + width + 'x' + height);
    await c.close();
  }
  const c = await context(390,844), page = await c.newPage(); page.on('pageerror',error=>errors.push(error.message));
  await load(page,five);
  const before = await page.evaluate(key=>localStorage.getItem(key+'auto'),key);
  await page.setViewportSize({width:844,height:390}); await layout(page);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key+'auto'),key),before);
  await page.setViewportSize({width:390,height:844}); await layout(page);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key+'auto'),key),before);
  checks.push('portraitLandscapeRotationKeepsExactProgress');
  for(const [id,state] of Object.entries(samples)){
    await load(page,state);
    assert.equal(await page.locator('#ending-title').innerText(),story.endings[id].title);
    assert.equal(await page.locator('#next-chapter-button').isVisible(),false);
  }
  await page.locator('[data-panel="gallery"]').tap(); assert.equal(await page.locator('.gallery-card').count(),74); assert.equal(await page.locator('.gallery-card:not(.locked)').count(),13); await page.locator('#close-panel').tap();
  checks.push('13FinalEndingsAnd74CardsOnPhone');
  // This file was genuinely exported from the Windows EXE in the preceding desktop acceptance test.
  const desktopBackup = fs.readFileSync(path.join(root,'release/verification/desktop/desktop-backup.json'),'utf8');
  await page.locator('[data-panel="settings"]').tap();
  await page.evaluate(text=>window.RainMobile.receiveBackup(text),desktopBackup);
  await page.locator('#confirm-action').tap(); await page.locator('#continue-button').tap();
  assert.equal(await page.locator('#ending-title').innerText(),story.endings.self_forward.title);
  checks.push('actualDesktopBackupImportsThroughMobileFileAdapter');
  await page.locator('[data-panel="settings"]').tap();
  const storage = await page.evaluate(()=>JSON.stringify({...localStorage}));
  await page.evaluate(text=>window.RainMobile.receiveBackup(text),'{}'); await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),storage); assert.match(await page.locator('#toast').innerText(),/备份/);
  checks.push('invalidMobileBackupCannotChangeProgress');
  await page.locator('#close-panel').tap(); await page.locator('#ending-home-button').tap();
  assert.equal(await page.evaluate(()=>window.RainMobile.back()),'exit');
  const imagePaths=JSON.parse(fs.readFileSync(path.join(root,'release/雨停之前_v1.0.0/release-manifest.json'),'utf8')).files.filter(e=>e.path.endsWith('.png')).map(e=>e.path);
  const images=await page.evaluate(paths=>Promise.all(paths.map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>0);i.onerror=()=>resolve(false);i.src=src;}))),imagePaths);
  assert.equal(images.length,33); assert.ok(images.every(Boolean));
  checks.push('all33ImagesLoadFromAppAssetsOrigin');
  await page.screenshot({path:path.join(out,'mobile-title.png')}); shots.push('mobile-title.png');
  assert.equal(errors.length,0,errors.join('\n'));
  fs.writeFileSync(path.join(out,'mobile-browser.json'),JSON.stringify({result:'passed',verifiedAt:new Date().toISOString(),checks,rendererErrors:errors,screenshots:shots,testEnvironment:'Chromium touch and viewport emulation; native bridge is a test double; no Android device connected'},null,2));
  console.log('Mobile browser checks passed: '+checks.length+' groups, 0 renderer errors.');
  await browser.close(); browser=null;
})().catch(async error=>{console.error(error);fs.writeFileSync(path.join(out,'mobile-browser-failure.json'),JSON.stringify({checks,errors,failure:error.stack},null,2));if(browser)await browser.close();process.exitCode=1;});
