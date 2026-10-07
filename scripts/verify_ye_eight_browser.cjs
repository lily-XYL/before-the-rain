// Local browser QA; uses an isolated browser context and never the user's profile.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require(process.env.YE_QA_PLAYWRIGHT || 'C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { story, engine, finish, seventhBoundary } = require('../tests/ye-helpers.cjs');
const root = path.resolve(__dirname, '..'), out = path.join(root, '剧本');
const key = 'before-the-rain-chapter-one-v1:', url = 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/');
const checkpointLimit = Object.keys(story.nodes).length * 2;
const envelope = state => ({ savedAt: new Date().toISOString(), state });
function checkpoint(before, ds, target) {
  let s = engine.continueChapter(story, before), i = 0, steps = 0;
  while (s.node !== target) {
    assert.ok(!s.ending && ++steps < checkpointLimit, 'Missing checkpoint ' + target);
    s = engine.advance(story, s, story.nodes[s.node].choices ? ds[i++] : undefined);
  }
  return s;
}
let qaBrowser;
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.YE_QA_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  qaBrowser = browser;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage(), errors = [], screenshots = [], layouts = [], checks = [];
  page.on('pageerror', e => errors.push(e.message));
  async function load(state) {
    await page.goto(url);
    await page.evaluate(({ key, saved }) => { localStorage.setItem(key + 'auto', JSON.stringify(saved)); localStorage.setItem(key + 'settings', JSON.stringify({ speed: 'instant', music: false, volume: 25 })); }, { key, saved: envelope(state) });
    await page.reload(); await page.locator('#continue-button').click();
    await page.waitForTimeout(100);
  }
  async function shot(name) { const file = 'ye-eight-' + name + '.png'; await page.waitForTimeout(2900); await page.screenshot({ path: path.join(out, file), fullPage: true }); screenshots.push(file); }
  const date = seventhBoundary(0, 2), slow = seventhBoundary(0, 1, 0), paused = seventhBoundary(0, 3);
  assert.equal(date.flags.y7Outcome, 'open'); assert.equal(slow.flags.y7Outcome, 'slow'); assert.equal(paused.flags.y7Outcome, 'distance');
  await load(date);
  assert.match(await page.locator('#next-chapter-button').innerText(), /继续叶澄线第八章/);
  await page.locator('#next-chapter-button').click();
  assert.equal(await page.locator('#chapter-label').innerText(), story.chapters.ye8.title);
  const carried = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state, key);
  assert.deepEqual(carried.flags, date.flags); assert.deepEqual(carried.choices, date.choices); checks.push('legacyYe7Continuation');
  const ds = [0, 0, 0, 1, 0, 0, 0, 0];
  await load(checkpoint(date, ds, 'y8_response_private_0'));
  await page.locator('[data-panel="save"]').click(); await page.locator('.slot').first().click(); await page.locator('#close-panel').click();
  for (const [width, height] of [[1440, 900], [390, 844], [320, 668], [844, 390]]) {
    await page.setViewportSize({ width, height }); await page.waitForTimeout(100);
    const m = await page.evaluate(() => { const c = document.getElementById('choice-box').getBoundingClientRect(), d = document.getElementById('dialogue-box').getBoundingClientRect(); return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, choiceBottom: c.bottom, dialogueTop: d.top, buttons: [...document.querySelectorAll('#choices button')].map(b => b.getBoundingClientRect().height), roleSmallText: Boolean(document.getElementById('speaker-role')) }; });
    assert.ok(m.documentWidth <= width); assert.ok(m.choiceBottom <= m.dialogueTop); assert.equal(m.roleSmallText, false); layouts.push({ width, height, ...m });
    await shot('choices-' + width);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('#menu-button').click(); await page.locator('#menu-home').click(); await page.locator('[data-panel="load"]').first().click();
  const slots = page.locator('.slot'); await slots.filter({ hasText: '书签 1' }).click();
  const restored = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state, key);
  assert.equal(restored.node, 'y8_response_private_0'); checks.push('manualBookmarkRestore');
  await load(checkpoint(date, ds, 'y8_home_invite_2')); await page.waitForTimeout(250); await shot('home-desktop');
  assert.match(await page.locator('#sprite-right').getAttribute('src'), /ye_cheng_no_camera/);
  assert.match(await page.locator('.scenery').evaluate(e => e.style.backgroundImage), /chapter-eight-ye/); checks.push('newHomeAndNoCameraSprite');
  await load(checkpoint(date, ds, 'y8_breakfast_1')); await shot('breakfast-desktop');
  assert.match(await page.locator('.scenery').evaluate(e => e.style.backgroundImage), /ye_home_morning/);
  const bk = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state.flags, key);
  assert.equal(bk.y8StayedOvernight, true); assert.equal(bk.y8BreakfastKept, undefined); assert.equal(bk.y8MorningContactKept, undefined); checks.push('breakfastActualTiming');
  const workDs = [1, 1, 0, 1, 0, 0, 0, 0];
  await load(checkpoint(paused, workDs, 'y8_work_response_demand_0')); await shot('work-desktop');
  const wf = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state.flags, key);
  assert.equal(wf.y8PrivateContactKept, false); assert.equal(wf.y8PrivateMeetingKept, false); assert.equal(wf.y8MotherStoryShared, false); checks.push('pauseCannotBypassPrivateMeeting');
  const slowDs = [0, 1, 1, 0, 1, 2, 1, 2];
  for (const [before, choices, name] of [[date, ds, 'together'], [slow, slowDs, 'slow'], [paused, workDs, 'paused']]) {
    const end = finish(engine.continueChapter(story, before), choices);
    assert.equal(end.ending, 'y8_' + name);
    await load(checkpoint(before, choices, 'y8_close_7'));
    await page.locator('#advance-button').click();
    assert.equal(await page.locator('#ending-title').innerText(), story.endings[end.ending].title);
    assert.equal(await page.locator('#next-chapter-button').isVisible(), Boolean(engine.nextChapterNode(story, end))); await shot(name + '-desktop');
  }
  const repaired = finish(engine.continueChapter(story, paused), [0, 1, 1, 1, 0, 2, 1, 0]);
  assert.equal(repaired.ending, 'y8_together'); assert.equal(repaired.flags.y8ContactKind, 'new'); assert.equal(repaired.flags.y7NextContactBooked, false);
  await load(repaired); await shot('repaired-desktop'); checks.push('newContactAfterActualRepair');
  await page.setViewportSize({ width: 390, height: 844 }); await shot('together-mobile');
  await page.locator('[data-panel="gallery"]').click();
  assert.equal(await page.locator('.gallery-card').count(), Object.keys(story.endings).length);
  const unlocked = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'endings')), key);
  for (const ending of ['y8_together', 'y8_slow', 'y8_paused']) assert.ok(unlocked[ending], ending + ' not collected');
  assert.match(await page.locator('.panel-note').innerText(), /章节回忆/);
  await page.locator('.gallery-card').filter({ hasText: '今天，听见你说喜欢' }).scrollIntoViewIfNeeded();
  await shot('gallery-mobile'); checks.push('allThreeStageMemoriesAndCurrentCollectionCards');
  await page.locator('#close-panel').click(); await page.locator('#ending-home-button').click(); await page.setViewportSize({ width: 320, height: 668 }); await shot('title-320');
  const assets = await page.evaluate(async () => {
    const urls = [...Object.values(window.RainStory.locations).map(l => l.image), ...window.RainCast.map(p => 'assets/characters/v1/' + p.id + '.png'), 'assets/characters/v1/ye_cheng_no_camera.png'];
    const results = await Promise.all(urls.map(url => new Promise(resolve => { const img = new Image(); img.onload = () => resolve({ url, ok: true, width: img.naturalWidth, height: img.naturalHeight }); img.onerror = () => resolve({ url, ok: false }); img.src = url; })));
    return { count: results.length, failed: results.filter(r => !r.ok), home: results.find(r => r.url.endsWith('ye_home.png')), morning: results.find(r => r.url.endsWith('ye_home_morning.png')) };
  });
  assert.equal(assets.failed.length, 0); assert.equal(errors.length, 0);
  const result = { date: '2026-10-06', checks, layouts, assets, errors, screenshots };
  fs.writeFileSync(path.join(out, 'ye-eight-browser-verification.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result)); await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => { if (qaBrowser) await qaBrowser.close(); });
