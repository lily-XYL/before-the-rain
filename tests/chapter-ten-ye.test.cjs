const {test} = require('node:test');
const assert = require('node:assert/strict');
const {story,engine,finish,ninthBoundary} = require('./ye-helpers.cjs');
const contexts=[];
for(let w=0;w<3;w++) for(let o=0;o<4;o++) for(let m=0;m<2;m++) contexts.push(ninthBoundary(w,o,m));
const frozen=['cameraScope','privateClipRecorded','privateLetterPublic','letterScope','letterRecipientPrivate','videoPlaybackApproved','plannedCopies','plannedPages','plannedCost','budgetReserve','workflow','withdrawnSubmission','selectedRoute','equipmentRepairCompleted','priorityCompleted','rebookKept','sixthRepairActionKept','sixthFriendTalkKept','luMoveDate','luDeparturePlan'];

test('All 288 Ye final-chapter combinations across 24 real histories reach three complete endings without rewriting footage, relationships or career decisions',()=>{
 const source=require('../chapter-ten-ye.js'), seen=new Set(), endings=new Set();let paths=0;
 assert.deepEqual(new Set(contexts.map(s=>s.flags.relationshipStatus)),new Set(['girlfriends','tryingDates','gettingToKnow','needsConversation']));
 assert.deepEqual(new Set(contexts.filter(s=>s.flags.pendingOmittedConversation).map(s=>s.flags.omittedPerson)),new Set(['lin','xu','zhou','ye']));
 assert.ok(contexts.some(s=>s.flags.y9UnauthorizedFilmUseOccurred&&!s.flags.y9OwnBadAdviceWithdrawn));
 assert.ok(contexts.some(s=>s.flags.y8AllHistoryDemanded&&!s.flags.y8DemandWithdrawn&&!s.flags.y9OldDemandWithdrawn));
 assert.equal(new Set([...source.scenes,...source.gates].map(s=>s.id)).size,source.scenes.length+source.gates.length);
 for(const before of contexts) for(let prior=0;prior<2;prior++) for(let future=0;future<3;future++) for(let film=0;film<2;film++) for(let role=0;role<2;role++) for(let night=0;night<3;night++) for(let contact=0;contact<2;contact++) for(let final=0;final<2;final++) {
  const old=before.flags, ready=prior===0||old.y9Outcome!=='paused', eligible=ready&&future!==2;
  const mode=eligible?old.relationshipStatus==='girlfriends'?'couple':'talk':'closed';
  const outcome=!eligible||final===1?'farewell':mode==='couple'&&future===0&&contact===0?'he':'ne';
  const visits=new Set(); const s=finish(engine.continueChapter(story,before),[prior,future,film,role,night,contact,final],at=>{seen.add(at.node);visits.add(at.node)}), f=s.flags;
  assert.equal(s.ending,'ye_'+outcome);endings.add(s.ending);assert.equal(s.choices.length,60);
  assert.equal(f.y10EntryStatus,old.relationshipStatus);assert.equal(f.y10PriorReady,ready);assert.equal(f.y10CareerRespected,future!==2);assert.equal(f.y10CurrentResponseKept,future!==2);assert.equal(f.y10PrivateMode,mode);
  assert.equal(f.pendingOmittedConversation,Boolean(old.pendingOmittedConversation&&prior===1));
  assert.equal(Boolean(f.y10OldDemandWithdrawn),prior===0&&old.y8AllHistoryDemanded&&!old.y8DemandWithdrawn&&!old.y9OldDemandWithdrawn);
  assert.equal(Boolean(f.y10OwnBadAdviceWithdrawn),prior===0&&old.y9UnauthorizedFilmUseOccurred&&!old.y9OwnBadAdviceWithdrawn);
  assert.equal(f.y10FilmSource,film===0?'newApprovedEnvironmentOnly':'yeOriginalObjectsSilent');
  assert.equal(Boolean(f.y10NewEnvironmentRecorded),film===0);assert.equal(f.y10FilmMinutes,4);assert.equal(f.y10FilmApprovalScope,'6-27 onsite once 15:10-15:14');
  for(const k of ['y10PrivateRecorded','y10OldPrivateClipImported','y10JointPhotoImported','y10MaintenanceClipImported','y10OriginalWetEquipmentReenergized','y10ReprintOrdered','y10ReplacementPaid','y10AllOthersForgaveClaimed','y10FilmOnlineApproved','y10PublicUploadOccurred','y10ProjectFeePaid','y10ProjectCancelled','y10ProjectPrivateMaterialTransferred','y10RelationshipPublic','y10AutumnPhotoRecorded']) assert.equal(f[k],false,k);
  for(const k of ['y10ShenOfferAccepted','y10NewProjectionKitChecked','y10ProjectionTestKept','y10DamagedCopiesExcluded','y10UsableCopiesReady','y10FilmPublicApproved','y10MasterDelivered','y10ProjectAccepted','y10BusinessDecisionByYe','y10LuBoxesMoved','y10RoleKept','y10FilmScreened','y10ExhibitHeld','y10ExhibitWrapKept','y10OriginalsReturnArranged','y10OwnerRestKept','y10PackingKept','y10EquipmentReturned','y10PlaybackDeviceFileDeleted','y10LuDinnerKept','y10LuEntryChecked','y10LuDepartureStarted','y10LuDepartureKept','y10LightsOff','y10KeysReturned','y10ShenJobStarted','y10ShenFirstTrainingKept','y10ProjectStarted','y10ProjectDepartureKept','y10ProjectCompleted','y10AutumnKept']) assert.equal(f[k],true,k);
  assert.equal(f.y10QuarantinedCopies,4);assert.equal(f.y10OwnerRestAt,'6-27 19:30');assert.equal(f.y10ClosureTime,'6-30 10:00');assert.equal(f.y10LuDepartureTime,'6-29 09:20');
  assert.equal(f.y10MasterDeliveredAt,'6-26 16:10');assert.equal(f.y10ProjectReplySentAt,'6-26 16:30');assert.equal(f.y10ProjectWeeks,4);assert.equal(f.y10ProjectFee,8000);assert.equal(f.y10ProjectStartedAt,'7-08');assert.equal(f.y10ProjectCompletedAt,'8-04');assert.equal(f.y10ProjectActualWeeks,4);assert.equal(f.y10ShenJobStartedAt,'7-01');
  assert.equal(f.y10HomeEntered,mode==='couple'&&night<2);assert.equal(f.y10StayedOvernight,mode==='couple'&&night===0);assert.equal(f.y10BreakfastKept,mode==='couple'&&night===0);assert.equal(f.y10Kissed,mode==='couple'&&night===0);assert.equal(f.y10HeldHands,false);
  assert.equal(f.y10PrivateMeetingKept,eligible&&night<2);assert.equal(Boolean(f.y10MorningCallKept),mode==='couple'&&night>0);assert.equal(Boolean(f.y10PrivateMeetingCancelled),mode==='talk'&&night===2);
  assert.equal(f.y10CallsBooked,eligible);assert.equal(f.y10CallsCancelled,eligible&&final===1);
  assert.equal(Boolean(f.y10FirstCallKept),outcome!=='farewell');assert.equal(Boolean(f.y10SecondCallKept),outcome!=='farewell'&&future===0&&contact===0);
  assert.equal(Boolean(f.y10TrialReviewKept),outcome!=='farewell'&&(future===1||contact===1));
  assert.equal(f.y10NewDatesStarted,outcome==='ne'&&!['girlfriends','tryingDates'].includes(old.relationshipStatus));
  assert.equal(f.relationshipStatus,outcome==='farewell'?'notDating':old.relationshipStatus==='girlfriends'?'girlfriends':'tryingDates');
  assert.equal(f.y10AutumnHeldHands,outcome==='he');assert.equal(f.y10ExclusiveActive,outcome!=='farewell'&&old.relationshipStatus==='girlfriends');
  assert.equal(visits.has('y10_cancel_calls_0'),eligible&&final===1);assert.equal(visits.has('y10_second_change_0'),Boolean(f.y10SecondCallKept));
  if(f.y10SecondCallKept){assert.equal(f.y10SecondCallNoticeMinutes,150);assert.equal(f.y10SecondCallRebookAt,'7-17 21:00');assert.equal(f.y10SecondCallKeptAt,'7-17 21:00-21:20');}
  for(const k of [...frozen,...Object.keys(old).filter(k=>/^y[789]/.test(k))]) assert.deepEqual(f[k],old[k],k);
  assert.deepEqual(s.choices.slice(0,before.choices.length),before.choices);assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10|^z[789]|^z10/.test(k)),false);
  assert.equal(story.endings[s.ending].kind,'final');assert.equal(engine.nextChapterNode(story,s),null);assert.strictEqual(engine.continueChapter(story,s),s);paths++;
 }
 assert.equal(paths,6912);assert.equal(endings.size,3);
 for(const[id,n]of Object.entries(story.nodes)) if(n.chapter==='ye10'&&!n.redirectBy) assert.ok(seen.has(id),'Unvisited: '+id);
});

test('Released ninth-chapter saves explicitly continue into the final chapter with every earlier fact, decision and dialogue retained',()=>{
 const legacy={...story,nodes:{...story.nodes,ye_nine_complete:{chapter:'ye9',resolve:true}}};
 for(const s of contexts){assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);const n=engine.continueChapter(story,s);assert.equal(n.node,'y10_start_0');assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history);}
});

test('Checkpoints restore across nine boundaries; public recording, screening, nights, departures, calls and autumn must actually happen',()=>{
 const couple=contexts.find(s=>s.flags.relationshipStatus==='girlfriends'),dates=contexts.find(s=>s.flags.relationshipStatus==='tryingDates'),learning=contexts.find(s=>s.flags.relationshipStatus==='gettingToKnow'),paused=contexts.find(s=>s.flags.y9Outcome==='paused');
 const facts={y10_public_environment:'y10NewEnvironmentRecorded',y10_projection:'y10ProjectionTestKept',y10_master:'y10MasterDelivered',y10_business:'y10ProjectAccepted',y10_lu_boxes:'y10LuBoxesMoved',y10_screening:'y10FilmScreened',y10_home_dinner:'y10HomeEntered',y10_stay_agree:'y10Kissed',y10_overnight:'y10StayedOvernight',y10_breakfast:'y10BreakfastKept',y10_packing:'y10EquipmentReturned',y10_lu_depart:'y10LuDepartureKept',y10_lights:'y10LightsOff',y10_july_job:'y10ShenJobStarted',y10_project_depart:'y10ProjectStarted',y10_first_call:'y10FirstCallKept',y10_second_call:'y10SecondCallKept',y10_project_complete:'y10ProjectCompleted',y10_he_autumn:'y10AutumnKept',y10_ne_autumn:'y10AutumnKept',y10_farewell_autumn:'y10AutumnKept'};
 for(const[b,ds]of [[couple,[0,0,0,0,0,0,0]],[couple,[1,1,1,1,2,0,0]],[couple,[0,0,1,0,1,0,1]],[dates,[1,0,1,1,0,0,0]],[learning,[0,1,0,0,2,1,0]],[paused,[0,0,0,1,0,0,0]],[paused,[1,2,1,1,0,1,0]]])finish(engine.continueChapter(story,b),ds,s=>{
  assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
  for(const[id,flag]of Object.entries(facts)) if(new RegExp('^'+id+'_\\d+$').test(s.node)) assert.ok(!s.flags[flag],s.node+': premature '+flag);
  if(!s.ending) assert.equal(s.node==='ye_ten_complete',false);
 });
});

test('No overnight, silent film, separate rest and either venue role preserve HE; actual past intimacy is kept after later farewell',()=>{
 const b=contexts.find(s=>s.flags.relationshipStatus==='girlfriends');
 for(let film=0;film<2;film++)for(let role=0;role<2;role++)for(let night=0;night<3;night++){
  const s=finish(engine.continueChapter(story,b),[1,0,film,role,night,0,0]);assert.equal(s.ending,'ye_he');assert.equal(s.flags.y10StayedOvernight,night===0);assert.equal(s.flags.y10MorningCallKept,night>0?true:undefined);
 }
 const s=finish(engine.continueChapter(story,b),[0,0,0,0,0,0,1]);assert.equal(s.ending,'ye_farewell');assert.equal(s.flags.y10StayedOvernight,true);assert.equal(s.flags.y10Kissed,true);assert.equal(s.flags.y10CallsCancelled,true);assert.equal(s.flags.y10FirstCallKept,undefined);
});

test('A held pause allows no private night or call; repairing it only starts new dates after final mutual agreement, and career control is refused',()=>{
 const b=contexts.find(s=>s.flags.y9Outcome==='paused'&&s.flags.y9UnauthorizedFilmUseOccurred&&!s.flags.y9OwnBadAdviceWithdrawn);assert.ok(b);
 const held=finish(engine.continueChapter(story,b),[1,0,0,0,0,0,0]);assert.equal(held.ending,'ye_farewell');assert.equal(held.flags.y10PrivateMode,'closed');assert.equal(held.flags.y10CallsBooked,false);assert.equal(held.flags.y10CallsCancelled,false);
 const fixed=finish(engine.continueChapter(story,b),[0,0,0,0,0,0,0]);assert.equal(fixed.ending,'ye_ne');assert.equal(fixed.flags.y10PrivateMode,'talk');assert.equal(fixed.flags.y10HomeEntered,false);assert.equal(fixed.flags.y10NewDatesStartedAt,'6-30 11:20');assert.equal(fixed.flags.y10OwnBadAdviceWithdrawn,true);assert.equal(fixed.flags.y9OwnBadAdviceWithdrawn,false);
 const control=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='girlfriends')),[0,2,0,0,0,0,0]);assert.equal(control.ending,'ye_farewell');assert.equal(control.flags.y10ProjectAccepted,true);assert.equal(control.flags.y10PrivateMode,'closed');assert.equal(control.flags.y10CallsCancelled,false);
});

test('Recovery rejects erased misuse, forged public scope, stock, nights, jobs or final endings, and rewind discards all personal-route futures',()=>{
 const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='girlfriends'&&s.flags.y9UnauthorizedFilmUseOccurred)),[0,0,0,0,2,0,0]);
 for(const change of [{y9UnauthorizedFilmUseOccurred:false},{y10MaintenanceClipImported:true},{videoPlaybackApproved:true},{y10FilmOnlineApproved:true},{y10FilmSource:'privateClip'},{y10ReplacementPaid:true},{y10QuarantinedCopies:0},{y10StayedOvernight:true},{y10ProjectFeePaid:true},{y10ProjectCancelled:true},{y10ProjectCompleted:false},{y10ShenJobStarted:false},{y10CallsCancelled:true},{y10Outcome:'farewell'},{y10AutumnKept:false}]) assert.equal(engine.restore(story,{...s,flags:{...s.flags,...change}}),null);
 assert.equal(engine.restore(story,{...s,ending:'ye_ne'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
 const r=engine.rewind(story,s,story.routeReviewNode);assert.equal(r.node,'c4_choose_priority_0');assert.equal(Object.keys(r.flags).some(k=>/^y[789]|^y10/.test(k)),false);assert.deepEqual(engine.restore(story,r),r);
});
