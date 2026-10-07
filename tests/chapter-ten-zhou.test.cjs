const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js'), engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(s, ds, visit = () => {}) {
  let i=0, steps=0;
  while(!s.ending){assert.ok(++steps<limit,s.node);visit(s);s=engine.advance(story,s,story.nodes[s.node].choices?ds[i++]:undefined)}
  visit(s);assert.equal(i,ds.length);return s;
}
function boundary(work, omitted, pending) {
  const focus=(work+omitted)%2?4:2, handling=focus===4?2:0, friend=(work+omitted+pending)%2?2:0;
  const ds=[[work,omitted%3,friend],[0,focus%4,omitted%3,0,work%2,friend],
    [0,work,omitted,0,0,work],[0,focus%4,omitted%3,handling,0,friend,omitted],
    [0,pending,work,0,pending?2:0,1,2],[1,1,2,work%2],
    [1,work%3,pending,work%3,pending?1:0,omitted%3],
    pending?[1,work%2,omitted%3,work%3,omitted%3,work%2]:[1,work%2,0,work===0?0:1,omitted%3,omitted===3?1:0],
    pending?[1,work%3,work%2,work%2,omitted%3,work%2]:[0,work%3,work%2,0,omitted%3,work%2]];
  let s=engine.create(story);
  for(const d of ds){if(s.ending)s=engine.continueChapter(story,s);s=finish(s,d)}return s;
}
const contexts=[];
for(let w=0;w<3;w++)for(let o=0;o<4;o++)for(let p=0;p<2;p++)contexts.push(boundary(w,o,p));
const inherited=['selectedRoute','routeFocusReady','L_present','X_need','Z_reality','Y_withoutCamera','priorityCompleted','keptPromise','plannedCost','plannedCopies','plannedPages','budgetReserve','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateLetterPublic','privateClipRecorded','videoPlaybackApproved','pendingLuConversation','luMoveDate','luDeparturePlan','equipmentRepairCompleted'];

test('All 288 Zhou final-chapter combinations across 24 real histories cover every line and preserve earlier facts and permissions',()=>{
  const source=require('../chapter-ten-zhou.js'),ids=[...source.scenes,...source.gates].map(x=>x.id);
  assert.equal(source.scenes.length,88);assert.equal(source.gates.length,24);assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(new Set(contexts.map(s=>s.flags.z9Outcome)),new Set(['together','reopen','paused']));
  assert.deepEqual(new Set(contexts.filter(s=>s.flags.pendingOmittedConversation).map(s=>s.flags.omittedPerson)),new Set(['lin','xu','zhou','ye']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let repair=0;repair<2;repair++)for(let future=0;future<2;future++)for(let privacy=0;privacy<3;privacy++)for(let role=0;role<2;role++)for(let evening=0;evening<3;evening++)for(let contact=0;contact<2;contact++)for(let last=0;last<2;last++){
    const old=before.flags,s=finish(engine.continueChapter(story,before),[repair,future,privacy,role,evening,contact,last],at=>seen.add(at.node)),f=s.flags;
    const ready=old.z9Outcome!=='paused'||repair===0,mode=ready&&future===0?(old.z9Outcome==='together'?'couple':'learning'):'paused';
    const outcome=mode==='paused'||last===1?'farewell':mode==='couple'&&contact===0?'he':'ne',overnight=mode==='couple'&&evening===0;
    assert.equal(s.ending,'zhou_'+outcome);assert.equal(f.z10Outcome,outcome);assert.equal(s.choices.length,58);endings.add(s.ending);
    assert.equal(f.z10EntryReady,ready);assert.equal(f.z10ResponseGiven,repair===0);assert.equal(f.z10PrivateMode,mode);
    assert.equal(f.pendingOmittedConversation,old.pendingOmittedConversation&&repair===1);assert.equal(f.z10OldRepairKept,old.pendingOmittedConversation&&repair===0);
    const withdraw=repair===0&&old.z8ControlDemandMade&&!old.z8ControlDemandWithdrawn&&!old.z9ControlWithdrawalKept;
    assert.equal(f.z10ControlWithdrawalKept,withdraw);assert.equal(f.z10ControlWithdrawalAt,withdraw?'6-25 16:15':undefined);
    assert.equal(f.z10DecisionRespected,future===0);assert.equal(f.z10NewControlDemandMade,future===1);
    assert.equal(f.relationshipStatus,outcome==='farewell'?'ended':mode==='couple'?'girlfriends':'tryingDates');assert.equal(f.z10ExclusiveAgreed,outcome!=='farewell'&&mode==='couple');
    assert.equal(f.z10PrivateInviteAgreed,mode!=='paused');assert.equal(f.z10RelationshipPublic,false);assert.equal(f.z10MutualContinue,outcome!=='farewell');
    assert.equal(Boolean(f.z10DatingStartedAtFinal),outcome==='ne'&&mode==='learning'&&old.relationshipStatus==='needsConversation');
    assert.equal(f.z10DedicationApproved,privacy===2&&mode==='couple'&&old.z7MelodyShared);assert.equal(f.z10DedicationDisplayed,f.z10DedicationApproved);
    assert.equal(f.z10WorkNoteApproved,privacy===1);assert.equal(f.z10WorkNoteDisplayed,privacy===1);
    assert.equal(f.z10PrivateSongPublic,false);assert.equal(f.z10PrivateSongRecorded,false);assert.equal(f.z10PrivateSongHeard,overnight);
    assert.equal(f.z10DinnerKept,mode==='couple');assert.equal(f.z10EveningMet,mode!=='paused');assert.equal(f.z10OvernightAgreed,overnight);assert.equal(f.z10OvernightKept,overnight);assert.equal(f.z10Kissed,overnight);
    assert.equal(f.z10MorningContactKept,mode!=='paused');assert.equal(f.z10MorningContactKind,mode==='couple'?overnight?'breakfast':'phone':mode==='learning'?'workMessage':'none');
    assert.equal(f.z10JulyContactBooked,mode!=='paused');assert.equal(Boolean(f.z10JulyContactCancelled),outcome==='farewell'&&mode!=='paused');
    for(const k of ['z10JulyContactKept','z10AdvanceChangeNotified','z10RebookAgreed','z10RebookKept'])assert.equal(f[k],outcome!=='farewell',k);
    assert.equal(f.z10RebookTime,outcome!=='farewell'?'7-14 21:00-21:10':undefined);
    assert.equal(f.z10PreparationTime,old.z9MusicPlanReady?'6-26 10:00-10:20':'6-26 10:00-11:00');assert.equal(f.z10SetMinutes,old.z9MusicTargetMinutes);
    assert.equal(f.z10MusicPerformed,old.z9MusicChoice!=='none');assert.equal(f.z10PerformedMinutes,old.z9MusicTargetMinutes);assert.equal(f.z10MusicCancelledForExhibit,old.z9MusicChoice==='none');
    assert.equal(f.z10QuarantinedCopies,4);assert.equal(f.z10ReprintOrdered,false);assert.equal(f.z10ExtraCost,0);
    for(const k of ['z10PreparationKept','z10DryRouteChecked','z10ProgramReady','z10DamagedCopiesExcluded','z10LuBoxesMoved','z10RoleKept','z10ExhibitHeld','z10OriginalsReturnArranged','z10ExhibitWrapKept','z10EquipmentReturnArranged','z10PackingKept','z10OwnerRestKept','z10LuDinnerKept','z10LuEntryChecked','z10LuDepartureKept','z10LightsOff','z10KeysReturned','z10ShenJobOfferAccepted','z10ShenJobStarted','z10TourAccepted','z10BusinessDecisionByZhou','z10TourStarted','z10TourDepartureKept','z10TourCompleted','z10AutumnKept'])assert.equal(f[k],true,k);
    assert.equal(f.z10OwnerRestAt,'6-27 19:30');assert.equal(f.z10LuDepartureTime,'6-29 09:20');assert.equal(f.z10ClosureTime,'6-30 10:00');
    assert.equal(f.z10TourReplySentAt,'6-26 16:20');assert.equal(f.z10TourStart,'7-05');assert.equal(f.z10TourEnd,'7-19');assert.equal(f.z10TourCities,3);assert.equal(f.z10TourShows,5);assert.equal(f.z10TourFeePerShow,1200);assert.equal(f.z10TourTotalPerformanceFee,6000);assert.equal(f.z10TourCancelled,false);assert.equal(f.z10TourDepartureAt,'7-05');assert.equal(f.z10TourCompletedAt,'7-19');assert.equal(f.z10TourCompletedShows,5);assert.equal(f.z10ShenJobStartedAt,'7-01');
    for(const flag of [...inherited,...Object.keys(old).filter(k=>/^z[789]/.test(k))])assert.deepEqual(f[flag],old[flag],flag);
    assert.deepEqual(s.choices.slice(0,before.choices.length),before.choices);assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'final');assert.equal(engine.nextChapterNode(story,s),null);assert.strictEqual(engine.continueChapter(story,s),s);paths++;
  }
  assert.equal(paths,6912);assert.equal(endings.size,3);
  for(const[id,n]of Object.entries(story.nodes))if(n.chapter==='zhou10'&&!n.redirectBy)assert.ok(seen.has(id),'Unvisited final-chapter line: '+id);
});

test('Released Zhou ninth-chapter saves explicitly continue without rewriting choices, flags or dialogue',()=>{
  const legacy={...story,nodes:{...story.nodes,zhou_nine_complete:{chapter:'zhou9',resolve:true}}};
  for(const s of contexts){assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);assert.equal(engine.nextChapterNode(story,s),'z10_start_0');const n=engine.continueChapter(story,s);assert.equal(n.node,'z10_start_0');assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}
});

test('Checkpoints restore across nine boundaries; performance, intimacy, departures, career and autumn flags need actual dialogue',()=>{
  const couple=contexts.find(s=>s.flags.z9Outcome==='together'),dates=contexts.find(s=>s.flags.z9Outcome==='reopen'&&s.flags.relationshipStatus==='tryingDates'),newDates=contexts.find(s=>s.flags.z9Outcome==='reopen'&&s.flags.relationshipStatus==='needsConversation'),paused=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.z8ControlDemandMade&&!s.flags.z8ControlDemandWithdrawn);
  assert.ok(couple&&dates&&newDates&&paused);
  for(const[b,ds]of [[couple,[1,0,2,0,0,0,0]],[couple,[0,0,0,1,2,1,0]],[couple,[0,0,1,1,0,0,1]],[dates,[1,0,2,0,0,0,0]],[newDates,[0,0,1,1,1,1,0]],[paused,[0,0,2,1,0,0,0]],[paused,[1,0,0,0,0,0,0]],[couple,[0,1,2,1,0,0,0]]])finish(engine.continueChapter(story,b),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    const expected={z10_tour_decision:'z10TourAccepted',z10_exhibit:'z10ExhibitHeld',z10_dinner:'z10DinnerKept',z10_stay_ask:'z10OvernightAgreed',z10_private_song:'z10PrivateSongHeard',z10_private_night:'z10Kissed',z10_breakfast:'z10MorningContactKept',z10_pack:'z10OwnerRestKept',z10_lu_dinner:'z10LuDinnerKept',z10_lu_departure:'z10LuDepartureKept',z10_lights:'z10LightsOff',z10_contact_private:'z10JulyContactBooked',z10_july_work:'z10ShenJobStarted',z10_tour_departure:'z10TourDepartureKept',z10_tour_complete:'z10TourCompleted'};
    for(const[id,k]of Object.entries(expected))if(new RegExp('^'+id+'_\\d+$').test(s.node))assert.equal(s.flags[k],undefined,s.node+': '+k);
    if(/^z10_music_(acoustic|short|none)_\d+$/.test(s.node))assert.equal(s.flags.z10MusicPerformed,false);
    if(/^z10_(he|ne|farewell)_autumn_\d+$/.test(s.node)){assert.equal(s.flags.z10AutumnKept,undefined);assert.equal(s.ending,null)}
  });
});

test('Intimacy, publicity, music size and activity role do not select HE; NE preserves existing girlfriends and distinguishes old versus new dates',()=>{
  const couple=contexts.find(s=>s.flags.z9Outcome==='together');
  for(const before of contexts.filter(s=>s.flags.z9Outcome==='together'))for(let privacy=0;privacy<3;privacy++)for(let role=0;role<2;role++)for(let evening=0;evening<3;evening++){
    const s=finish(engine.continueChapter(story,before),[1,0,privacy,role,evening,0,0]);assert.equal(s.ending,'zhou_he');assert.equal(s.flags.z10OvernightKept,evening===0);
  }
  const trial=finish(engine.continueChapter(story,couple),[0,0,0,0,2,1,0]);assert.equal(trial.ending,'zhou_ne');assert.equal(trial.flags.relationshipStatus,'girlfriends');assert.equal(trial.flags.z10ExclusiveAgreed,true);assert.equal(trial.flags.z10DatingStartedAtFinal,false);
  for(const before of contexts.filter(s=>s.flags.z9Outcome==='reopen')){
    const s=finish(engine.continueChapter(story,before),[0,0,0,0,0,0,0]);assert.equal(s.ending,'zhou_ne');assert.equal(s.flags.z10Kissed,false);assert.equal(s.flags.z10DinnerKept,false);assert.equal(s.flags.relationshipStatus,'tryingDates');assert.equal(s.flags.z10DatingStartedAtFinal,before.flags.relationshipStatus==='needsConversation');
  }
});

test('A held pause or fresh career control cannot be overridden; ending after an overnight keeps history and mutually cancels future calls',()=>{
  const paused=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.z8ControlDemandMade&&!s.flags.z8ControlDemandWithdrawn),couple=contexts.find(s=>s.flags.z9Outcome==='together');
  const held=finish(engine.continueChapter(story,paused),[1,0,2,0,0,0,0]);assert.equal(held.ending,'zhou_farewell');assert.equal(held.flags.pendingOmittedConversation,true);assert.equal(held.flags.z10JulyContactBooked,false);assert.equal(held.flags.z10JulyContactCancelled,false);assert.equal(held.flags.z10EveningMet,false);
  const repair=finish(engine.continueChapter(story,paused),[0,0,2,0,0,0,0]);assert.equal(repair.ending,'zhou_ne');assert.equal(repair.flags.z10ControlWithdrawalKept,true);assert.equal(repair.flags.z8ControlDemandWithdrawn,false);assert.equal(repair.flags.z10DatingStartedAtFinal,true);assert.equal(repair.flags.z10Kissed,false);
  const cancel=finish(engine.continueChapter(story,couple),[0,1,2,1,0,0,0]);assert.equal(cancel.ending,'zhou_farewell');assert.equal(cancel.flags.z10TourAccepted,true);assert.equal(cancel.flags.z10TourCancelled,false);assert.equal(cancel.flags.z10JulyContactCancelled,false);
  const ended=finish(engine.continueChapter(story,couple),[0,0,2,1,0,0,1]);assert.equal(ended.ending,'zhou_farewell');assert.equal(ended.flags.z10OvernightKept,true);assert.equal(ended.flags.z10Kissed,true);assert.equal(ended.flags.z10JulyContactBooked,true);assert.equal(ended.flags.z10JulyContactCancelled,true);assert.equal(ended.flags.z10JulyContactKept,false);assert.equal(ended.flags.z10TourCompleted,true);
});

test('Forged final events, fee, privacy, contact cancellation and old facts fail recovery; rewind discards all four Zhou chapters',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.z9Outcome==='together')),[0,0,0,1,2,0,0]);
  for(const changes of [{z10Outcome:'ne'},{z10OvernightKept:true},{z10Kissed:true},{z10PrivateSongPublic:true},{z10TourFeePerShow:1500},{z10TourTotalPerformanceFee:7500},{z10TourCompleted:false},{z10AutumnKept:false},{z10ReprintOrdered:true},{z10ExtraCost:48},{z10JulyContactCancelled:true},{z10RebookKept:false},{z9MusicPerformed:true},{z8TourAccepted:true},{z7MelodyRecorded:true},{privateLetterPublic:true},{selectedRoute:'xu'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'xu_he'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^z[789]|^z10/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
