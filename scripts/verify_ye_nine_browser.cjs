// Isolated local browser QA; never opens the user's browser profile.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { chromium } = require('C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { story, engine, finish, eighthBoundary } = require('../tests/ye-helpers.cjs');
const source = require('../chapter-nine-ye.js');
const out = path.resolve(__dirname, '../剧本'), key = 'before-the-rain-chapter-one-v1:';
const url = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
const limit = Object.keys(story.nodes).length * 2;
function checkpoint(before, ds, target) {
 let s = engine.continueChapter(story, before), i = 0, steps = 0;
 while (s.node !== target) {
  assert.ok(!s.ending && ++steps < limit, 'Missing checkpoint ' + target);
  s = engine.advance(story, s, story.nodes[s.node].choices ? ds[i++] : undefined);
 }
 return s;
}
const last = id => id + '_' + (source.scenes.find(s => s.id === id).lines.length - 1);
let browser;
(async () => {
 browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
 const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
 const page = await context.newPage(), errors = [], checks = [], layouts = [], screenshots = [];
 page.on('pageerror', e => errors.push(e.message));
 async function load(state) {
  await page.goto(url);
  await page.evaluate(({ key, state }) => {
   localStorage.setItem(key + 'auto', JSON.stringify({ savedAt: new Date().toISOString(), state }));
   localStorage.setItem(key + 'settings', JSON.stringify({ speed: 'instant', music: false, volume: 25 }));
  }, { key, state });
  await page.reload(); await page.locator('#continue-button').click(); await page.waitForTimeout(100);
 }
 const flags = () => page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state.flags, key);
 async function shot(name) {
  await page.waitForTimeout(2900);
  const file = 'ye-nine-' + name + '.png'; await page.screenshot({ path: path.join(out, file), fullPage: true }); screenshots.push(file);
 }
 const couple = eighthBoundary(0, 2, 0), paused = eighthBoundary(0, 3, 1);
 assert.equal(couple.flags.relationshipStatus, 'girlfriends'); assert.equal(paused.flags.relationshipStatus, 'needsConversation');
 const ds = [1, 2, 0, 0, 0, 0];
 await load(couple); assert.match(await page.locator('#next-chapter-button').innerText(), /继续叶澄线第九章/);
 await page.locator('#next-chapter-button').click();
 assert.equal(await page.locator('#chapter-label').innerText(), story.chapters.ye9.title);
 const carried = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state, key);
 assert.deepEqual(carried.flags, couple.flags); assert.deepEqual(carried.choices, couple.choices); assert.deepEqual(carried.history, couple.history); checks.push('legacyYe8Continuation');
 await load(checkpoint(couple, ds, 'y9_film_choice_0'));
 await page.locator('[data-panel="save"]').click(); await page.locator('.slot').first().click(); await page.locator('#close-panel').click();
 for (const [width,height] of [[1440,900],[390,844],[320,668],[844,390]]) {
  await page.setViewportSize({ width, height }); await page.waitForTimeout(100);
  const m = await page.evaluate(() => { const c = document.getElementById('choice-box').getBoundingClientRect(), d = document.getElementById('dialogue-box').getBoundingClientRect(); return { documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight, choiceBottom: c.bottom + scrollY, dialogueTop: d.top + scrollY, buttonHeights: [...document.querySelectorAll('#choices button')].map(b => b.getBoundingClientRect().height), roleSmallText: Boolean(document.getElementById('speaker-role')) }; });
  assert.ok(m.documentWidth <= width); assert.ok(m.choiceBottom <= m.dialogueTop); assert.equal(m.roleSmallText, false); assert.equal(m.buttonHeights.length, 3);
  await page.locator('#choices button').last().scrollIntoViewIfNeeded();
  const visibleChoice = await page.locator('#choices button').last().evaluate(b => { const r = b.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; });
  assert.equal(visibleChoice,true); layouts.push({ width, height, ...m, lastChoiceAccessibleByScroll: visibleChoice });
  await page.evaluate(() => scrollTo(0,0)); await shot('choices-' + width);
 }
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.locator('#menu-button').click(); await page.locator('#menu-home').click(); await page.locator('[data-panel="load"]').first().click();
 await page.locator('.slot').filter({ hasText: '书签 1' }).click();
 assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'auto')).state.node, key), 'y9_film_choice_0'); checks.push('manualBookmarkRestore');
 await load(checkpoint(couple,ds,'y9_rain_1'));
 assert.equal(await page.locator('#speaker').innerText(),'陈序宁');
 assert.match(await page.locator('#sprite-right').getAttribute('src'),/chen_xuning\.png/); checks.push('supportingCharacterNameAndPortrait');
 await load(checkpoint(couple, ds, last('y9_repair_clip')));
 assert.match(await page.locator('#sprite-right').getAttribute('src'), /ye_cheng\.png/);
 assert.ok(!(await flags()).y9MaintenanceClipRecorded);
 await page.locator('#advance-button').click(); assert.equal((await flags()).y9MaintenanceClipRecorded, true); checks.push('newRepairRecordingActualTiming');
 for (const [id, fact, name] of [['y9_film_use','y9UnauthorizedFilmUseOccurred','misuse'],['y9_use_disclose','y9UnauthorizedDisclosureKept','disclosure'],['y9_use_remove','y9UnauthorizedFilmUseRemoved','removal']]) {
  await load(checkpoint(couple, ds, last(id))); assert.ok(!(await flags())[fact]);
  await shot(name); await page.locator('#advance-button').click(); assert.equal((await flags())[fact], true);
 }
 assert.equal((await flags()).y9UnauthorizedFilmUseOccurred, true); assert.equal((await flags()).y9UnauthorizedPublicScreeningOccurred, false); checks.push('misuseDisclosureRemovalRemainSeparateFacts');
 await load(checkpoint(couple, ds, last('y9_station_hand')));
 assert.match(await page.locator('#sprite-right').getAttribute('src'), /ye_cheng_no_camera/); assert.ok(!(await flags()).y9HeldHands);
 await shot('station-desktop'); await page.locator('#advance-button').click(); assert.equal((await flags()).y9HeldHands, true); checks.push('noCameraPrivateMeetingAndActualTouch');
 for (const [id, fact] of [['y9_maintenance_delete','y9YeMaintenanceCopyDeleted'],['y9_work_check','y9WorkCheckKept'],['y9_publisher','y9PublisherMaterialsSent'],['y9_business','y9YeProjectInquiryReceived']]) {
  await load(checkpoint(couple, ds, last(id))); assert.ok(!(await flags())[fact]); await page.locator('#advance-button').click(); assert.equal((await flags())[fact], true);
 }
 assert.equal((await flags()).y9YeProjectAccepted, false); checks.push('actualMaintenanceDeletionOriginalWorkDeliveryAndInquiryOnly');
 for (const [before, choices, name] of [[couple,ds,'together'],[paused,[0,1,1,0,0,0],'reopen'],[paused,[1,2,0,1,0,0],'paused']]) {
  const end = finish(engine.continueChapter(story,before),choices); assert.equal(end.ending,'y9_' + name);
  if (name === 'reopen') { assert.equal(end.flags.relationshipStatus,'needsConversation'); assert.equal(end.flags.y9HeldHands,false); }
  if (name === 'paused') { assert.equal(end.flags.y9PrivateMeetingKept,false); assert.equal(end.flags.y9PrivateMeetingCancelledByAgreement,undefined); }
  await load(checkpoint(before,choices,last('y9_noon'))); await page.locator('#advance-button').click();
  assert.equal(await page.locator('#ending-title').innerText(),story.endings[end.ending].title);
  assert.equal(await page.locator('#next-chapter-button').isVisible(),Boolean(engine.nextChapterNode(story,end))); await shot(name + '-desktop');
 }
 const rested = finish(engine.continueChapter(story,couple),[0,1,1,0,0,2]);
 assert.equal(rested.ending,'y9_together'); assert.equal(rested.flags.y9HeldHands,false); assert.equal(rested.flags.y9PrivateMeetingCancelledByAgreement,true);
 await load(rested); checks.push('restDoesNotReduceRelationshipAndCancellationNeedsAgreement');
 await page.setViewportSize({ width: 390, height: 844 }); await page.locator('[data-panel="gallery"]').click();
 assert.equal(await page.locator('.gallery-card').count(),Object.keys(story.endings).length);
 const unlocked = await page.evaluate(key => JSON.parse(localStorage.getItem(key + 'endings')),key);
 for (const ending of ['y9_together','y9_reopen','y9_paused']) assert.ok(unlocked[ending]);
 assert.match(await page.locator('.panel-note').innerText(),/六十一种章节回忆/);
 await page.locator('.gallery-card').filter({ hasText: '雨停以后，仍愿意听你' }).scrollIntoViewIfNeeded(); await shot('gallery-mobile'); checks.push('allThreeStageMemoriesAndCurrentCollectionCards');
 const assets = await page.evaluate(async () => {
  const urls = [...Object.values(window.RainStory.locations).map(l => l.image),...window.RainCast.map(p => 'assets/characters/v1/' + p.id + '.png'),'assets/characters/v1/ye_cheng_no_camera.png'];
  const results = await Promise.all(urls.map(url => new Promise(resolve => { const img = new Image(); img.onload = () => resolve({ url, ok: true }); img.onerror = () => resolve({ url, ok: false }); img.src = url; })));
  return { count: results.length, failed: results.filter(r => !r.ok) };
 });
 assert.equal(assets.count,31); assert.equal(assets.failed.length,0); assert.equal(errors.length,0);
 const result = { date: '2026-10-06', checks, layouts, assets, errors, screenshots };
 fs.writeFileSync(path.join(out,'ye-nine-browser-verification.json'),JSON.stringify(result,null,2)); console.log(JSON.stringify(result));
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); });
