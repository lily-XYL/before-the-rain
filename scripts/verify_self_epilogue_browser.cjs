// Isolated Edge context; no user browser profile or user save access.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {story,engine,finish,contexts,checkpoint,last}=require('../tests/self-helpers.cjs');
const out=path.resolve(__dirname,'../剧本'),key='before-the-rain-chapter-one-v1:',url='file:///'+path.resolve(__dirname,'../index.html').replace(/\\/g,'/');
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const errors=[],checks=[],layouts=[],screenshots=[];page.on('pageerror',e=>errors.push(e.message));
 async function load(state){await page.goto(url);await page.evaluate(({key,state})=>{localStorage.setItem(key+'auto',JSON.stringify({savedAt:new Date().toISOString(),state}));localStorage.setItem(key+'settings',JSON.stringify({speed:'instant',music:false,volume:25}));},{key,state});await page.reload();await page.locator('#continue-button').click();await page.waitForTimeout(100);}
 const flags=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state.flags,key);
 async function shot(name){await page.waitForTimeout(2900);const file='self-epilogue-'+name+'.png';await page.screenshot({path:path.join(out,file),fullPage:true});screenshots.push(file);}
 const old=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.pendingLuConversation),ds=[0,0,0,0,0,0,0];assert.ok(old);
 await load(old);assert.match(await page.locator('#next-chapter-button').innerText(),/继续独身群像收束篇/);await page.locator('#next-chapter-button').click();
 const carried=await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state,key);assert.equal(carried.node,'s7_morning_0');assert.deepEqual(carried.flags,old.flags);assert.deepEqual(carried.choices,old.choices);assert.deepEqual(carried.history,old.history);checks.push('legacySelfContinuation');
 await load(checkpoint(old,ds,'s7_ordinary_choice_0'));assert.equal(await page.locator('#bond-label').innerText(),'自己的日子');
 await page.locator('[data-panel="save"]').click();await page.locator('.slot').first().click();await page.locator('#close-panel').click();
 for(const [width,height]of [[1440,900],[390,844],[320,668],[844,390]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);
  const m=await page.evaluate(()=>{const c=document.getElementById('choice-box').getBoundingClientRect(),d=document.getElementById('dialogue-box').getBoundingClientRect();return {documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,choiceBottom:c.bottom+scrollY,dialogueTop:d.top+scrollY,buttons:document.querySelectorAll('#choices button').length,roleSmallText:Boolean(document.getElementById('speaker-role'))};});
  assert.ok(m.documentWidth<=width);assert.ok(m.choiceBottom<=m.dialogueTop);assert.equal(m.buttons,4);assert.equal(m.roleSmallText,false);
  await page.locator('#choices button').last().scrollIntoViewIfNeeded();const accessible=await page.locator('#choices button').last().evaluate(b=>{const r=b.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;});assert.ok(accessible);layouts.push({width,height,...m,lastChoiceAccessibleByScroll:accessible});await page.evaluate(()=>scrollTo(0,0));await shot('choices-'+width);
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#menu-button').click();await page.locator('#menu-home').click();await page.locator('[data-panel="load"]').first().click();await page.locator('.slot').filter({hasText:'书签 1'}).click();assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state.node,key),'s7_ordinary_choice_0');checks.push('manualBookmarkRestore');
 for(const [id,k]of [['s7_lu_repair','s7FriendTalkKept'],['s7_complete_submit','s7CompleteMaterialsSent'],['s7_job_offer','s7ShenJobAccepted'],['s7_boxes','s7LuBoxesMoved'],['s7_event_close','s7EventCompleted'],['s7_train','s7LuDepartureKept'],['s7_lights','s7LightsOff'],['s7_move','s7HomeMoved'],['s7_job_start','s7ShenJobStarted'],['s7_call','s7FriendCallKept']]){
  await load(checkpoint(old,ds,last(id)));assert.equal(Boolean((await flags())[k]),false);if(['s7_move','s7_train','s7_job_start'].includes(id))await shot(id);if(id==='s7_move')assert.match(await page.locator('.scenery').evaluate(e=>e.style.backgroundImage),/self_home/);await page.locator('#advance-button').click();assert.equal((await flags())[k],true);
 }
 checks.push('actualFriendTalkWorkBoxesEventDepartureClosureMovingJobCallTiming');
 const held=[1,1,3,2,1,1,1];
 for(const [id,sprite]of [['s7_owner','lin_lan'],['s7_inventory_late','chen_xuning']]){await load(checkpoint(old,held,last(id)));assert.match(await page.locator('#sprite-right').getAttribute('src'),new RegExp(sprite+'\\.png'));assert.equal(await page.locator('#sprite-right').evaluate(i=>i.complete&&i.naturalWidth>0),true);}
 checks.push('ownerAndChenSpritesExistAndRender');
 await load(checkpoint(old,held,last('s7_pressure_withdraw')));assert.equal((await flags()).s7PressureOccurred,true);assert.equal((await flags()).s7PressureWithdrawn,false);await shot('pressure-withdraw');await page.locator('#advance-button').click();assert.equal((await flags()).s7PressureWithdrawn,true);assert.equal((await flags()).s7PressureOccurred,true);assert.equal((await flags()).pendingOmittedConversation,true);assert.equal((await flags()).pendingLuConversation,true);checks.push('pressureWithdrawalKeepsOccurrenceAndUnfinishedOldMatters');
 for(const [before,choices,label,letter]of [[old,ds,'open','s7_autumn_open'],[contexts.find(s=>s.flags.selfAfternoon==='friend'),held,'sealed','s7_autumn_sealed']]){
  await load(checkpoint(before,choices,last(letter)));assert.match(await page.locator('.scenery').evaluate(e=>e.style.backgroundImage),/self_home/);await shot('letter-'+label);
  await load(checkpoint(before,choices,last('s7_autumn')));assert.equal(await page.locator('#ending-screen').isVisible(),false);assert.equal((await flags()).s7AutumnKept,false);
  // Clear only this isolated context's test collection to verify final timing twice.
  await page.evaluate(key=>{const x=JSON.parse(localStorage.getItem(key+'endings')||'{}');delete x.self_forward;localStorage.setItem(key+'endings',JSON.stringify(x));},key);
  assert.ok(!(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'endings')||'{}'),key)).self_forward);await page.locator('#advance-button').click();assert.equal(await page.locator('#ending-title').innerText(),story.endings.self_forward.title);assert.equal(await page.locator('#next-chapter-button').isVisible(),false);assert.equal((await flags()).relationshipStatus,'notDating');await shot('ending-'+label);
 }
 checks.push('twoLettersOneIndependentFinalOnlyAfterCompleteAutumn');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-panel="gallery"]').click();assert.equal(await page.locator('.gallery-card').count(),74);assert.match(await page.locator('.panel-note').innerText(),/六十一种章节回忆与十三个最终结局/);await page.locator('.gallery-card').filter({hasText:'雨停后，我也向前走'}).scrollIntoViewIfNeeded();await shot('gallery-mobile');checks.push('74CardsAnd13Finals');
 const assets=await page.evaluate(async()=>{const urls=[...Object.values(window.RainStory.locations).map(l=>l.image),...window.RainCast.map(p=>'assets/characters/v1/'+p.id+'.png'),'assets/characters/v1/ye_cheng_no_camera.png'];const all=await Promise.all(urls.map(url=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({url,ok:true});i.onerror=()=>resolve({url,ok:false});i.src=url;})));return {count:all.length,failed:all.filter(a=>!a.ok)};});assert.equal(assets.count,32);assert.equal(assets.failed.length,0);assert.equal(errors.length,0);
 const result={date:'2026-10-06',checks,layouts,assets,errors,screenshots};fs.writeFileSync(path.join(out,'self-epilogue-browser-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();});
