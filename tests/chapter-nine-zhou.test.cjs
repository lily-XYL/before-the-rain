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
  const focus=(work+omitted)%2?4:2,handling=focus===4?2:0,friend=(work+omitted+pending)%2?2:0;
  const ds=[[work,omitted%3,friend],[0,focus%4,omitted%3,0,work%2,friend],
    [0,work,omitted,0,0,work],[0,focus%4,omitted%3,handling,0,friend,omitted],
    [0,pending,work,0,pending?2:0,1,2],[1,1,2,work%2],
    [1,work%3,pending,work%3,pending?1:0,omitted%3],
    pending?[1,work%2,omitted%3,work%3,omitted%3,work%2]:[1,work%2,0,work===0?0:1,omitted%3,omitted===3?1:0]];
  let s=engine.create(story);
  for(const d of ds){if(s.ending)s=engine.continueChapter(story,s);s=finish(s,d)}return s;
}
const contexts=[];
for(let work=0;work<3;work++)for(let omitted=0;omitted<4;omitted++)for(let pending=0;pending<2;pending++)contexts.push(boundary(work,omitted,pending));
const inherited=['selectedRoute','routeFocusReady','L_present','X_need','Z_reality','Y_withoutCamera','priorityCompleted','keptPromise','plannedCost','plannedCopies','plannedPages','budgetReserve','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateLetterPublic','privateClipRecorded','videoPlaybackApproved','pendingLuConversation','luMoveDate','luDeparturePlan','equipmentRepairCompleted'];

test('All 144 Zhou ninth-chapter combinations across 24 real histories cover every line and keep old permissions, appointments and business facts',()=>{
  const source=require('../chapter-nine-zhou.js'),ids=[...source.scenes,...source.gates].map(x=>x.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(contexts.map(s=>s.flags.z8Outcome)),new Set(['together','slow','paused']));
  assert.deepEqual(new Set(contexts.filter(s=>s.flags.pendingOmittedConversation).map(s=>s.flags.omittedPerson)),new Set(['lin','xu','zhou','ye']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let prior=0;prior<2;prior++)for(let plan=0;plan<3;plan++)for(let help=0;help<2;help++)for(let reply=0;reply<2;reply++)for(let evening=0;evening<3;evening++)for(let morning=0;morning<2;morning++){
    const visited=new Set(),old=before.flags;
    const s=finish(engine.continueChapter(story,before),[prior,plan,help,reply,evening,morning],at=>{seen.add(at.node);visited.add(at.node)}),f=s.flags;
    const ready=old.z8Outcome!=='paused'||prior===0,allowed=ready&&reply===0;
    const outcome=!allowed?'paused':old.relationshipStatus==='girlfriends'?'together':'reopen';
    assert.equal(s.ending,'z9_'+outcome);assert.equal(s.choices.length,51);assert.equal(f.z9Outcome,outcome);endings.add(s.ending);
    assert.equal(f.z9EntryStatus,old.relationshipStatus);assert.equal(f.z9PriorReady,ready);assert.equal(f.z9PriorResponseGiven,prior===0);
    assert.equal(f.pendingOmittedConversation,old.pendingOmittedConversation&&prior===1);
    assert.equal(f.z9OldRepairKept,old.pendingOmittedConversation&&prior===0);
    assert.equal(f.z9ControlWithdrawalKept,prior===0&&old.z8ControlDemandMade&&!old.z8ControlDemandWithdrawn);
    assert.equal(f.z9ControlWithdrawalAt,f.z9ControlWithdrawalKept?'6-24 10:05':undefined);
    assert.equal(f.z9CurrentAdjustmentKept,reply===0);assert.equal(f.z9PrivateConversationAllowed,allowed);
    assert.equal(f.relationshipStatus,allowed?old.relationshipStatus:'needsConversation');
    assert.equal(f.z9ExistingRelationshipContinued,allowed&&old.z8Outcome!=='paused');assert.equal(f.z9DatingResumed,false);
    assert.equal(f.z9ExclusiveAgreed,outcome==='together');assert.equal(f.z9RelationshipPublic,false);
    assert.equal(f.z9EveningMet,allowed&&evening<2);assert.equal(f.z9HeldHands,outcome==='together'&&evening===0);
    assert.equal(visited.has('z9_station_hand_0'),outcome==='together'&&evening===0);
    assert.equal(visited.has('z9_reopen_paused_0'),allowed&&old.z8Outcome==='paused');
    assert.equal(f.z9AffectedAreaPowerOff,true);assert.equal(f.z9ElectricPlanWithdrawn,true);assert.equal(f.z9EquipmentStopped,true);assert.equal(f.z9EquipmentTestedLive,false);
    assert.equal(f.z9DamageLogged,true);assert.equal(f.z9WetCopies,4);assert.equal(f.z9WetOriginals,0);assert.equal(f.z9QuarantinedCopies,4);assert.equal(f.z9AvailableCopies,old.plannedCopies-4);
    assert.equal(f.z9ReprintQuoteAmount,48);assert.equal(f.z9ReprintOrdered,false);assert.equal(f.z9ExtraCost,0);
    assert.equal(f.z9MusicChoice,['acoustic','short','none'][plan]);assert.equal(f.z9MusicTargetMinutes,[15,8,0][plan]);assert.equal(f.z9MusicPlanConfirmed,true);
    assert.equal(f.z9AmplifiedSetCancelled,true);assert.equal(f.z9BorrowRevisionNotified,true);assert.equal(f.z9MusicPerformed,false);assert.equal(f.z9DedicatedSongPublic,false);
    assert.equal(f.z9NightPlanReady,false);assert.equal(f.z9MusicPlanReady,morning===0);assert.equal(f.z9DryRouteChecked,morning===0);
    assert.equal(f.z9ConfirmedSetMinutes,morning===0?[15,8,0][plan]:null);assert.equal(f.z9MorningCheckKept,morning===0);assert.equal(f.z9MorningStatusNotified,true);
    assert.equal(f.z9EquipmentMoved,true);assert.equal(f.z9OwnGuitarChecked,true);assert.equal(f.z9WorkStatusReceived,true);
    assert.equal(f.z9HelpKept,help===0);assert.equal(f.z9HelpMinutes,help===0?20:0);assert.equal(f.z9ShenTechnicalCheckSigned,false);
    assert.equal(f.z9OwnerRestKept,true);assert.equal(f.z9OwnerRestAt,'6-24 19:30');assert.equal(f.z9AuthorsNotified,true);
    assert.equal(f.z9PrivateAccidentRecorded,false);assert.equal(f.z9TourConditionsRequested,true);assert.equal(f.z9TourAccepted,false);assert.equal(f.z9TourCancelled,false);
    assert.equal(f.z9OwnDraftRoundDone,true);assert.equal(f.z9OwnDraftRoundFinishedAt,'6-24 20:30');
    assert.equal(f.z9WindowRepaired,true);assert.equal(f.z9BriefingNotCancelled,true);assert.equal(f.z9BriefingAttended,true);assert.equal(f.z9BriefingFinishedAt,'6-24 20:45');
    assert.equal(f.z9PublisherMaterialsSent,true);assert.equal(f.z9PublisherMaterialsSentAt,'6-25 11:00');assert.equal(f.z9PublisherDeadline,'6-25 12:00');assert.equal(f.z9PublisherDeadlineKept,true);assert.equal(f.z9PublisherWorkDelegated,false);
    for(const flag of [...inherited,...Object.keys(old).filter(k=>/^z[78]/.test(k))])assert.deepEqual(f[flag],old[flag],flag);
    assert.deepEqual(s.choices.slice(0,before.choices.length),before.choices);assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'chapter');assert.equal(engine.nextChapterNode(story,s),'z10_start_0');const next=engine.continueChapter(story,s);assert.equal(next.node,'z10_start_0');assert.deepEqual(next.flags,s.flags);assert.deepEqual(next.choices,s.choices);assert.deepEqual(next.history,s.history);paths++;
  }
  assert.equal(paths,3456);assert.equal(endings.size,3);
  for(const [id,node]of Object.entries(story.nodes))if(node.chapter==='zhou9'&&!node.redirectBy)assert.ok(seen.has(id),'Unvisited ninth-chapter line: '+id);
});

test('Released Zhou eighth-chapter endings restore and explicitly continue without rewriting their original choices, flags and dialogue',()=>{
  const legacy={...story,nodes:{...story.nodes,zhou_eight_complete:{chapter:'zhou8',resolve:true}}};
  for(const s of contexts){assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);assert.equal(engine.nextChapterNode(story,s),'z9_morning_0');const n=engine.continueChapter(story,s);assert.equal(n.node,'z9_morning_0');assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}
});

test('Checkpoints restore across eight boundaries; rain damage, withdrawal, help, intimacy, new preparation and publishing need actual scenes',()=>{
  const couple=contexts.find(s=>s.flags.z8Outcome==='together'),trial=contexts.find(s=>s.flags.z8Outcome==='slow'&&s.flags.relationshipStatus==='girlfriends'),dates=contexts.find(s=>s.flags.relationshipStatus==='tryingDates'),paused=contexts.find(s=>s.flags.z8ControlDemandMade&&!s.flags.z8ControlDemandWithdrawn);
  for(const [before,ds]of [[couple,[1,0,0,0,0,0]],[trial,[0,1,1,0,2,1]],[dates,[1,2,0,0,1,0]],[paused,[0,2,1,0,0,0]],[paused,[1,1,0,0,0,1]],[couple,[0,0,0,1,1,0]]])finish(engine.continueChapter(story,before),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    if(/^z9_control_withdraw_\d+$/.test(s.node))assert.equal(s.flags.z9ControlWithdrawalKept,false);
    if(/^z9_damage_\d+$/.test(s.node))assert.equal(s.flags.z9DamageLogged,undefined);
    if(/^z9_music_(acoustic|short|none)_\d+$/.test(s.node))assert.equal(s.flags.z9MusicPlanConfirmed,undefined);
    if(/^z9_help_finite_\d+$/.test(s.node))assert.equal(s.flags.z9HelpKept,undefined);
    if(/^z9_station_hand_\d+$/.test(s.node))assert.equal(s.flags.z9HeldHands,undefined);
    if(/^z9_morning_finish_\d+$/.test(s.node))assert.equal(s.flags.z9DryRouteChecked,undefined);
    if(/^z9_plan_(acoustic|short|none)_\d+$/.test(s.node))assert.equal(s.flags.z9MusicPlanReady,false);
    if(/^z9_publisher_sent_\d+$/.test(s.node))assert.equal(s.flags.z9PublisherMaterialsSent,undefined);
    assert.equal(s.flags.z9TourDepartureKept,undefined);assert.equal(s.flags.z9FarewellExhibitHeld,undefined);
  });
});

test('Music size or cancellation, finite help, no physical touch and delaying preparation do not decide mutual girlfriends',()=>{
  const before=contexts.find(s=>s.flags.z8Outcome==='slow'&&s.flags.relationshipStatus==='girlfriends');assert.ok(before);
  for(let plan=0;plan<3;plan++)for(let help=0;help<2;help++)for(let evening=0;evening<3;evening++)for(let morning=0;morning<2;morning++){
    const s=finish(engine.continueChapter(story,before),[1,plan,help,0,evening,morning]);assert.equal(s.ending,'z9_together');assert.equal(s.flags.relationshipStatus,'girlfriends');assert.equal(s.flags.z9MusicPlanReady,morning===0);assert.equal(s.flags.z9MusicPerformed,false);assert.equal(s.flags.z9HeldHands,evening===0);
  }
  const dates=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='tryingDates')),[1,0,1,0,0,0]);assert.equal(dates.ending,'z9_reopen');assert.equal(dates.flags.relationshipStatus,'tryingDates');assert.equal(dates.flags.z9HeldHands,false);
});

test('Repairing a prior pause only permits new conversation; withholding old responses cannot be bypassed by helping or current good words',()=>{
  const paused=contexts.find(s=>s.flags.z8ControlDemandMade&&!s.flags.z8ControlDemandWithdrawn);assert.ok(paused);
  const repaired=finish(engine.continueChapter(story,paused),[0,2,1,0,0,0]);assert.equal(repaired.ending,'z9_reopen');assert.equal(repaired.flags.z9ControlWithdrawalKept,true);assert.equal(repaired.flags.z8ControlDemandWithdrawn,false);assert.equal(repaired.flags.relationshipStatus,'needsConversation');assert.equal(repaired.flags.z9DatingResumed,false);assert.equal(repaired.flags.z9HeldHands,false);
  const held=finish(engine.continueChapter(story,paused),[1,0,0,0,0,0]);assert.equal(held.ending,'z9_paused');assert.equal(held.flags.z9CurrentAdjustmentKept,true);assert.equal(held.flags.z9HelpKept,true);assert.equal(held.flags.z9EveningMet,false);assert.equal(held.flags.pendingOmittedConversation,true);
  const fresh=finish(engine.continueChapter(story,contexts.find(s=>s.flags.z8Outcome==='together')),[0,1,0,1,0,0]);assert.equal(fresh.ending,'z9_paused');assert.equal(fresh.flags.z9HeldHands,false);assert.equal(fresh.flags.z8RelationshipConfirmed,true);
});

test('Forged business, future performance, stock, money and intimacy fail recovery; rewind discards all three Zhou chapters',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.z8Outcome==='together')),[0,2,1,0,2,1]);
  for(const changes of [{z9Outcome:'paused'},{z9HeldHands:true},{z9MusicPerformed:true},{z9ConfirmedSetMinutes:15},{z9EquipmentTestedLive:true},{z9AvailableCopies:60},{z9ReprintOrdered:true},{z9ExtraCost:48},{z9TourAccepted:true},{z9PublisherWorkDelegated:true},{z8PrivateMeetingMissed:false},{z7MelodyRecorded:true},{privateLetterPublic:true},{selectedRoute:'xu'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'x9_together'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^z[789]/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
