// Isolated local Edge context; does not access the user's profile.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/xing/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {story,engine,finish,ninthBoundary}=require('../tests/ye-helpers.cjs'),source=require('../chapter-ten-ye.js');
const out=path.resolve(__dirname,'../剧本'),key='before-the-rain-chapter-one-v1:',url='file:///'+path.resolve(__dirname,'../index.html').replace(/\\/g,'/');
const limit=Object.keys(story.nodes).length*2;
function checkpoint(before,ds,target){let s=engine.continueChapter(story,before),i=0,n=0;while(s.node!==target){assert.ok(!s.ending&&++n<limit,target);s=engine.advance(story,s,story.nodes[s.node].choices?ds[i++]:undefined);}return s;}
const last=id=>id+'_'+(source.scenes.find(s=>s.id===id).lines.length-1);
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();
 const errors=[],checks=[],layouts=[],screenshots=[];page.on('pageerror',e=>errors.push(e.message));
 async function load(state){await page.goto(url);await page.evaluate(({key,state})=>{localStorage.setItem(key+'auto',JSON.stringify({savedAt:new Date().toISOString(),state}));localStorage.setItem(key+'settings',JSON.stringify({speed:'instant',music:false,volume:25}));},{key,state});await page.reload();await page.locator('#continue-button').click();await page.waitForTimeout(100);}
 const flags=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state.flags,key);
 async function shot(name){await page.waitForTimeout(2900);const file='ye-ten-'+name+'.png';await page.screenshot({path:path.join(out,file),fullPage:true});screenshots.push(file);}
 const couple=ninthBoundary(0,2,0),paused=ninthBoundary(1,3,1),ds=[0,0,0,0,0,0,0];
 assert.equal(couple.flags.relationshipStatus,'girlfriends');assert.equal(paused.flags.y9Outcome,'paused');
 await load(couple);assert.match(await page.locator('#next-chapter-button').innerText(),/继续叶澄线第十章/);await page.locator('#next-chapter-button').click();
 const carried=await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state,key);assert.equal(carried.node,'y10_start_0');assert.deepEqual(carried.flags,couple.flags);assert.deepEqual(carried.choices,couple.choices);assert.deepEqual(carried.history,couple.history);checks.push('legacyYe9Continuation');
 await load(checkpoint(couple,ds,'y10_future_choice_0'));
 await page.locator('[data-panel="save"]').click();await page.locator('.slot').first().click();await page.locator('#close-panel').click();
 for(const[width,height]of [[1440,900],[390,844],[320,668],[844,390]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);
  const m=await page.evaluate(()=>{const c=document.getElementById('choice-box').getBoundingClientRect(),d=document.getElementById('dialogue-box').getBoundingClientRect();return{documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,choiceBottom:c.bottom+scrollY,dialogueTop:d.top+scrollY,buttons:document.querySelectorAll('#choices button').length,roleSmallText:Boolean(document.getElementById('speaker-role'))};});
  assert.ok(m.documentWidth<=width);assert.ok(m.choiceBottom<=m.dialogueTop);assert.equal(m.buttons,3);assert.equal(m.roleSmallText,false);
  await page.locator('#choices button').last().scrollIntoViewIfNeeded();const accessible=await page.locator('#choices button').last().evaluate(b=>{const r=b.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;});assert.ok(accessible);layouts.push({width,height,...m,lastChoiceAccessibleByScroll:accessible});await page.evaluate(()=>scrollTo(0,0));await shot('choices-'+width);
 }
 await page.setViewportSize({width:1440,height:900});await page.locator('#menu-button').click();await page.locator('#menu-home').click();await page.locator('[data-panel="load"]').first().click();await page.locator('.slot').filter({hasText:'书签 1'}).click();assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'auto')).state.node,key),'y10_future_choice_0');checks.push('manualBookmarkRestore');
 await load(checkpoint(couple,ds,last('y10_public_environment')));assert.match(await page.locator('#sprite-right').getAttribute('src'),/ye_cheng\.png/);assert.ok(!(await flags()).y10NewEnvironmentRecorded);await page.locator('#advance-button').click();assert.equal((await flags()).y10NewEnvironmentRecorded,true);assert.equal((await flags()).y10FilmPublicApproved,true);assert.equal((await flags()).videoPlaybackApproved,couple.flags.videoPlaybackApproved);checks.push('newRecordingAndOnsiteConsentKeepOriginalPrivatePermissions');
 await load(checkpoint(couple,ds,last('y10_screening')));assert.equal((await flags()).y10FilmScreened,false);await shot('screening');await page.locator('#advance-button').click();assert.equal((await flags()).y10FilmScreened,true);checks.push('screeningMustActuallyFinish');
 await load(checkpoint(couple,ds,last('y10_stay_agree')));assert.match(await page.locator('#sprite-right').getAttribute('src'),/ye_cheng_no_camera/);assert.equal((await flags()).y10Kissed,false);assert.equal((await flags()).y10StayedOvernight,false);await shot('home');await page.locator('#advance-button').click();assert.equal((await flags()).y10Kissed,true);assert.equal((await flags()).y10StayedOvernight,false);
 await load(checkpoint(couple,ds,last('y10_overnight')));assert.match(await page.locator('.scenery').evaluate(e=>e.style.backgroundImage),/ye_home_morning/);assert.equal((await flags()).y10StayedOvernight,false);await page.locator('#advance-button').click();assert.equal((await flags()).y10StayedOvernight,true);assert.equal((await flags()).y10BreakfastKept,false);checks.push('homeInvitationTouchOvernightAndBreakfastRemainSeparate');
 for(const[id,fact]of [['y10_packing','y10EquipmentReturned'],['y10_lu_depart','y10LuDepartureKept'],['y10_lights','y10LightsOff'],['y10_july_job','y10ShenJobStarted'],['y10_project_depart','y10ProjectStarted'],['y10_first_call','y10FirstCallKept'],['y10_second_call','y10SecondCallKept'],['y10_project_complete','y10ProjectCompleted']]){await load(checkpoint(couple,ds,last(id)));assert.ok(!(await flags())[fact]);await page.locator('#advance-button').click();assert.equal((await flags())[fact],true);}
 assert.equal((await flags()).y10ProjectFeePaid,false);checks.push('closureJobsCallsAndProjectCompletionActualTiming');
 await load(checkpoint(paused,[1,0,1,0,0,0,0],'y10_night_closed_0'));assert.equal((await flags()).y10PrivateMode,'closed');assert.equal((await flags()).y10CallsBooked,false);await shot('paused-own-arrangements');
 const repaired=finish(engine.continueChapter(story,paused),[0,0,1,1,0,0,0]);assert.equal(repaired.ending,'ye_ne');assert.equal(repaired.flags.y10HomeEntered,false);assert.equal(repaired.flags.y10NewDatesStartedAt,'6-30 11:20');checks.push('pauseRepairsOnlyBecomeNewDatesAfterFinalAgreement');
 const endedDs=[0,0,1,1,0,0,1];await load(checkpoint(couple,endedDs,last('y10_cancel_calls')));assert.equal((await flags()).y10CallsBooked,true);assert.equal((await flags()).y10CallsCancelled,false);await page.locator('#advance-button').click();assert.equal((await flags()).y10CallsCancelled,true);assert.equal((await flags()).y10StayedOvernight,true);checks.push('farewellCancelsActualBookedCallsAndKeepsPastIntimacy');
 for(const[before,choices,name,id]of [[couple,ds,'he','y10_he_autumn'],[paused,[0,1,1,1,2,1,0],'ne','y10_ne_autumn'],[couple,endedDs,'farewell','y10_farewell_autumn']]){
  const expected=finish(engine.continueChapter(story,before),choices);assert.equal(expected.ending,'ye_'+name);
  await load(checkpoint(before,choices,last(id)));assert.equal(await page.locator('#ending-screen').isVisible(),false);assert.equal((await flags()).y10AutumnKept,false);await shot('autumn-'+name);
  const unlockedBefore=await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'endings')||'{}'),key);assert.ok(!unlockedBefore[expected.ending]);
  await page.locator('#advance-button').click();assert.equal(await page.locator('#ending-title').innerText(),story.endings[expected.ending].title);assert.equal(await page.locator('#next-chapter-button').isVisible(),false);await shot(name+'-desktop');
 }
 checks.push('threeFinalsCollectedOnlyAfterEachCompleteAutumn');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-panel="gallery"]').click();assert.equal(await page.locator('.gallery-card').count(),73);
 const collected=await page.evaluate(key=>JSON.parse(localStorage.getItem(key+'endings')),key);for(const id of ['ye_he','ye_ne','ye_farewell'])assert.ok(collected[id]);assert.match(await page.locator('.panel-note').innerText(),/六十一种章节回忆与十二个最终结局/);
 await page.locator('.gallery-card').filter({hasText:'没有镜头的约会'}).scrollIntoViewIfNeeded();await shot('gallery-mobile');checks.push('threeFinalsAnd73CollectionCards');
 const assets=await page.evaluate(async()=>{const urls=[...Object.values(window.RainStory.locations).map(l=>l.image),...window.RainCast.map(p=>'assets/characters/v1/'+p.id+'.png'),'assets/characters/v1/ye_cheng_no_camera.png'];const all=await Promise.all(urls.map(url=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({url,ok:true});i.onerror=()=>resolve({url,ok:false});i.src=url;})));return{count:all.length,failed:all.filter(a=>!a.ok)};});assert.equal(assets.count,31);assert.equal(assets.failed.length,0);assert.equal(errors.length,0);
 const result={date:'2026-10-06',checks,layouts,assets,errors,screenshots};fs.writeFileSync(path.join(out,'ye-ten-browser-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();});
