const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {story,engine,finish,source,contexts,checkpoint,last,frozen}=require('./self-helpers.cjs');
const report={date:'2026-10-06',historicalContexts:contexts.length,combinations:384,checks:[]};
test('All 9216 self paths terminate, preserve old facts and cover every visible dialogue',()=>{
 const seen=new Set();let paths=0;
 for(const old of contexts)for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<4;c++)for(let d=0;d<3;d++)for(let e=0;e<2;e++)for(let f=0;f<2;f++)for(let g=0;g<2;g++){
  const s=finish(engine.continueChapter(story,old),[a,b,c,d,e,f,g],v=>seen.add(v.node)),x=s.flags;
  assert.equal(s.ending,'self_forward');assert.equal(s.choices.length,40);assert.equal(x.relationshipStatus,'notDating');assert.equal(x.romanceRouteLocked,false);
  for(const k of frozen)assert.equal(x[k],old.flags[k],k);
  assert.equal(x.pendingOmittedConversation,Boolean(old.flags.pendingOmittedConversation&&a));assert.equal(x.pendingLuConversation,Boolean(old.flags.pendingLuConversation&&b));
  assert.equal(x.s7OldRepairKept,Boolean(old.flags.pendingOmittedConversation&&!a));assert.equal(x.s7FriendTalkKept,Boolean(old.flags.pendingLuConversation&&!b));assert.equal(x.s7FriendTalkReleased,Boolean(old.flags.pendingLuConversation&&b));
  assert.equal(x.s7PressureOccurred,d===2);assert.equal(x.s7PressureWithdrawn,d===2);assert.equal(x.s7HelpKept,d===0);assert.equal(x.s7LateInventoryChecked,d!==0);assert.equal(x.s7InventoryChecked,true);
  assert.equal(x.s7WetCopies,4);assert.equal(x.s7ReplacementQuote,48);assert.equal(x.s7LetterOrigin,old.flags.selfAfternoon==='quiet'?'june18Draft':'june19Draft');assert.equal(x.s7LetterSealed,g===1);assert.equal(x.s7LetterLeftOpen,g===0);
  for(const k of ['s7ReplacementPaid','s7ReprintOrdered','s7OriginalWetEquipmentReenergized','s7LetterPublic','s7PrivateClipImported','s7NewRecording','s7RomanceStarted','s7OldPrivateMaterialUsed','s7NewCardsOnlineApproved'])assert.equal(x[k],false,k);
  for(const k of ['s7PrintHandoffKept','s7ThreeCopiesChecked','s7CompleteMaterialsSent','s7ProgrammeConfirmed','s7ShenJobAccepted','s7RentalSigned','s7LuBoxesMoved','s7EventShiftKept','s7EventCompleted','s7CardsReturned','s7LuPackingKept','s7FriendDinnerKept','s7LuEntranceChecked','s7LuDepartureKept','s7LightsOff','s7KeysReturned','s7HomeMoved','s7OwnKeysReceived','s7ShenJobStarted','s7FriendCallBooked','s7FriendCallKept','s7AutumnLetterRead','s7AutumnKept'])assert.equal(x[k],true,k);
  assert.strictEqual(engine.continueChapter(story,s),s);paths++;
 }
 for(const [id,n]of Object.entries(story.nodes))if(n.chapter==='self7'&&!n.redirectBy)assert.ok(seen.has(id),'Unseen '+id);
 assert.equal(paths,9216);report.paths=paths;report.visibleNodes=seen.size;report.checks.push('allPathsCoverageFrozenFactsAndSingleFinal');
});
test('Legacy sixth-chapter self saves resume without rewriting histories or earlier cards',()=>{
 for(const old of contexts){const restored=engine.restore(story,JSON.parse(JSON.stringify(old)));assert.deepEqual(restored,old);const next=engine.continueChapter(story,restored);assert.equal(next.node,'s7_morning_0');assert.deepEqual(next.flags,old.flags);assert.deepEqual(next.history,old.history);assert.deepEqual(next.choices,old.choices);assert.equal(story.endings.c6_self.kind,'chapter');}
 assert.equal(Object.keys(story.chapters).length,23);assert.equal(Object.values(story.endings).filter(e=>e.kind==='final').length,13);assert.equal(Object.keys(story.endings).length,74);report.checks.push('legacySavesAnd74Cards');
});
test('Actual work, moving, departure and final facts appear only after the actual scenes',()=>{
 const old=contexts[0],ds=[0,0,0,0,0,0,0];
 for(const [id,k]of [['s7_complete_submit','s7CompleteMaterialsSent'],['s7_job_offer','s7ShenJobAccepted'],['s7_rental','s7RentalSigned'],['s7_boxes','s7LuBoxesMoved'],['s7_event_close','s7EventCompleted'],['s7_pack','s7LuPackingKept'],['s7_train','s7LuDepartureKept'],['s7_lights','s7LightsOff'],['s7_move','s7HomeMoved'],['s7_job_start','s7ShenJobStarted'],['s7_call','s7FriendCallKept'],['s7_autumn','s7AutumnKept']]){
  const before=checkpoint(old,ds,last(id));assert.equal(Boolean(before.flags[k]),false,k);assert.equal(before.ending,null);const after=engine.advance(story,before);assert.equal(after.flags[k],true,k);if(id==='s7_autumn')assert.equal(after.ending,'self_forward');
 }
 report.checks.push('actualTimingBeforeAndAfterScene');
});
test('Bookmarks and rewind replay the branch without trusting fabricated flags',()=>{
 const old=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.pendingLuConversation),ds=[1,1,3,2,1,1,1];assert.ok(old);
 const full=finish(engine.continueChapter(story,old),ds);
 for(const id of ['s7_repair_choice_0','s7_friend_choice_0','s7_ordinary_choice_0','s7_help_choice_0','s7_programme_choice_0','s7_station_choice_0','s7_letter_choice_0',last('s7_autumn')]){
  const saved=checkpoint(old,ds,id),fake=JSON.parse(JSON.stringify(saved));fake.flags.s7AutumnKept=true;fake.flags.s7ShenJobStarted=true;fake.flags.s7PressureOccurred=false;fake.flags.relationshipStatus='girlfriends';assert.equal(engine.restore(story,fake),null,id);assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(saved))),saved,id);assert.deepEqual(engine.rewind(story,full,id),saved,id);
 }
 report.checks.push('bookmarksRewindAndUntrustedFlags');
});
test('Every declared destination and new room asset resolves; dialogue name has no identity hints',()=>{
 for(const n of Object.values(story.nodes))if(n.chapter==='self7'){if(n.next)assert.ok(story.nodes[n.next],n.next);for(const c of n.choices||[])assert.ok(story.nodes[c.next],c.next);for(const id of Object.values(n.targets||{}))assert.ok(story.nodes[id],id);}
 for(const l of Object.values(story.locations))assert.ok(fs.existsSync(path.resolve(__dirname,'..',l.image)),l.image);
 assert.equal(Object.keys(story.locations).length,23);assert.ok(!fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8').includes('speaker-role'));assert.equal(source.scenes.filter(s=>s.choices).length,7);report.scenes=source.scenes.length;report.gates=source.gates.length;report.checks.push('graphAssetsAndNoRoleHints');
});
test('Both independent letters remain private through the two real autumn readings',()=>{
 for(const quiet of [true,false])for(const sealed of [0,1]){
  const old=contexts.find(s=>(s.flags.selfAfternoon==='quiet')===quiet),ds=[1,1,2,1,1,1,sealed],s=finish(engine.continueChapter(story,old),ds);
  assert.equal(s.flags.s7LetterOrigin,quiet?'june18Draft':'june19Draft');assert.equal(s.flags.s7LetterSealed,Boolean(sealed));assert.equal(s.flags.s7LetterPublic,false);assert.equal(s.flags.s7AutumnLetterRead,true);assert.equal(s.flags.s7NewRecording,false);assert.equal(s.flags.s7RomanceStarted,false);
 }
 report.checks.push('letterOriginsSealingAndIndependentLife');fs.writeFileSync(path.resolve(__dirname,'../剧本/self-epilogue-verification-summary.json'),JSON.stringify(report,null,2));
});
