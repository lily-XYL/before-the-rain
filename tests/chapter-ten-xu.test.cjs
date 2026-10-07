const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js'), engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(state, choices, visit = () => {}) {
  let i = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, state.node); visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? choices[i++] : undefined);
  }
  visit(state); assert.equal(i, choices.length); return state;
}
function boundary(work, omitted, pending) {
  const focus = (work + omitted) % 2 ? 4 : 1;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [[work, omitted % 3, friend], [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work], [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, pending, work, 0, pending ? 2 : 0, 1, 1], [1,1,1,work%2],
    [1,work,pending,0,pending?1:0,omitted%3],
    pending ? [1,work%2,omitted%3,work%2,0,0] : [1,work%2,0,0,omitted%2,2],
    pending ? [work===2 && omitted===0 ? 0 : 1,work%3,work%2,work%2,0,1] : [0,work%3,0,0,work%3,work%2]];
  let state = engine.create(story);
  for (const choices of ds) { if (state.ending) state=engine.continueChapter(story,state); state=finish(state,choices); }
  return state;
}
const contexts=[];
for(let work=0;work<3;work++)for(let omitted=0;omitted<4;omitted++)for(let pending=0;pending<2;pending++)contexts.push(boundary(work,omitted,pending));
const inherited=['selectedRoute','X_need','L_present','Z_reality','Y_withoutCamera','priorityCompleted','plannedCost','plannedCopies','plannedPages','budgetReserve','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateLetterPublic','privateClipRecorded','videoPlaybackApproved','pendingLuConversation','luMoveDate','luDeparturePlan'];
test('All 288 final-chapter combinations across 24 real histories cover every line, final ending and unchanged historical permissions',()=>{
  const source=require('../chapter-ten-xu.js'),ids=[...source.scenes,...source.gates].map(x=>x.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(contexts.map(s=>s.flags.xu9Outcome)),new Set(['together','reopen','paused']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let repair=0;repair<2;repair++)for(let future=0;future<2;future++)for(let privacy=0;privacy<3;privacy++)for(let role=0;role<2;role++)for(let evening=0;evening<3;evening++)for(let contact=0;contact<2;contact++)for(let last=0;last<2;last++){
    const old=before.flags,visited=new Set();
    const s=finish(engine.continueChapter(story,before),[repair,future,privacy,role,evening,contact,last],at=>{seen.add(at.node);visited.add(at.node)}),f=s.flags;
    const ready=old.xu9Outcome!=='paused'||repair===0;
    const mode=ready&&future===0 ? old.xu9Outcome==='together'?'couple':'learning' : 'paused';
    const outcome=mode==='paused'||last===1?'farewell':mode==='couple'&&contact===0?'he':'ne';
    assert.equal(s.ending,'xu_'+outcome);endings.add(s.ending);assert.equal(s.choices.length,58);
    assert.equal(f.xu10EntryReady,ready);assert.equal(f.xu10PrivateMode,mode);assert.equal(f.xu10DecisionRespected,future===0);
    assert.equal(f.pendingOmittedConversation,old.pendingOmittedConversation&&repair===1);
    assert.equal(f.xu10OldRepairKept,old.pendingOmittedConversation&&repair===0);
    assert.equal(f.xu10CorrectionSent,repair===0&&old.xu8InterferenceMade&&!old.xu8CorrectionSent&&!old.xu9CorrectionSent);
    assert.equal(Boolean(f.xu10HiddenBurdenAcknowledged),repair===0&&old.xu8SampleHidden&&!old.xu8HiddenBurdenAcknowledged&&!old.xu9HiddenBurdenAcknowledged);
    assert.equal(f.xu10PrivateExcerptApproved,privacy===2&&mode==='couple'&&old.xu7PrivateNoteShared);
    assert.equal(f.xu10PrivateExcerptPublished,f.xu10PrivateExcerptApproved);
    assert.equal(f.xu10WorkNoteApproved,privacy===1);assert.equal(f.xu10RelationshipPublic,false);
    assert.equal(f.xu10DinnerKept,mode==='couple');assert.equal(f.xu10EveningMet,mode!=='paused');
    assert.equal(f.xu10OvernightAgreed,mode==='couple'&&evening===0);assert.equal(f.xu10OvernightKept,mode==='couple'&&evening===0);
    assert.equal(f.xu10Kissed,mode==='couple'&&evening===0);assert.equal(visited.has('x10_home_0'),mode==='couple'&&evening===0);
    assert.equal(f.xu10MorningContactKept,mode!=='paused');
    assert.equal(f.xu10MorningContactKind,mode==='couple'?evening===0?'breakfast':'phone':mode==='learning'?'workMessage':'none');
    assert.equal(f.xu10Outcome,outcome);assert.equal(f.xu10MutualContinue,outcome!=='farewell');
    assert.equal(f.relationshipStatus,outcome==='farewell'?'ended':mode==='couple'?'girlfriends':'tryingDates');
    assert.equal(f.xu10CooperationAccepted,true);assert.equal(f.xu10BusinessDecisionByXu,true);
    assert.equal(f.xu10CooperationReplySentAt,'6-26 16:20');assert.equal(f.xu10CooperationDurationWeeks,8);
    assert.equal(f.xu10CooperationStart,'8-01');assert.equal(f.xu10CooperationEnd,'9-25');
    assert.equal(f.xu10InventoryDone,true);assert.equal(f.xu10DisplayReady,true);assert.equal(f.xu10DisplayPages,old.xu9DisplayTargetPages);
    assert.equal(f.xu10DamagedCopiesExcluded,true);assert.equal(f.xu10QuarantinedCopies,4);
    assert.equal(f.xu10ReprintOrdered,false);assert.equal(f.xu10ExtraCost,0);
    for(const flag of ['xu10RoleKept','xu10ExhibitHeld','xu10OriginalsReturnArranged','xu10OwnerRestKept','xu10LuBoxesMoved','xu10PackingKept','xu10LuDinnerKept','xu10LuEntryChecked','xu10LuDepartureKept','xu10LightsOff','xu10KeysReturned','xu10CooperationStarted','xu10CooperationCompleted','xu10ShenJobStarted','xu10AutumnKept'])assert.equal(f[flag],true,flag);
    assert.equal(f.xu10LuDepartureTime,'6-29 09:20');assert.equal(f.xu10ClosureTime,'6-30 10:00');assert.equal(f.xu10CooperationCompletedAt,'9-25');
    for(const flag of [...inherited,...Object.keys(old).filter(k=>/^xu[789]/.test(k))])assert.deepEqual(f[flag],old[flag],flag);
    assert.deepEqual(s.choices.slice(0,before.choices.length),before.choices);assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'final');assert.equal(engine.nextChapterNode(story,s),null);assert.strictEqual(engine.continueChapter(story,s),s);paths++;
  }
  assert.equal(paths,6912);assert.equal(endings.size,3);
  for(const [id,node]of Object.entries(story.nodes))if(node.chapter==='xu10'&&!node.redirectBy)assert.ok(seen.has(id),'Unvisited: '+id);
});
test('Released Xu ninth-chapter saves resume final chapter without altering facts, choices or history',()=>{
  const legacy={...story,nodes:{...story.nodes,xu_nine_complete:{chapter:'xu9',resolve:true}}};
  for(const s of contexts){assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);const n=engine.continueChapter(story,s);assert.equal(n.node,'x10_start_0');assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}
});
test('Representative checkpoints restore across nine boundaries; intimacy and completion require reading actual scenes and autumn',()=>{
  for(const [entry,ds]of [['together',[0,0,2,0,0,0,0]],['together',[1,0,0,1,1,1,0]],['reopen',[0,0,1,0,1,0,0]],['paused',[1,0,2,1,0,0,0]],['paused',[0,1,0,0,2,1,1]]])finish(engine.continueChapter(story,contexts.find(s=>s.flags.xu9Outcome===entry)),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    if(/^x10_business_\d+$/.test(s.node))assert.equal(s.flags.xu10CooperationAccepted,undefined);
    if(/^x10_exhibit_\d+$/.test(s.node))assert.equal(s.flags.xu10ExhibitHeld,undefined);
    if(/^x10_private_night_\d+$/.test(s.node))assert.equal(s.flags.xu10OvernightKept,undefined);
    if(/^x10_lu_departure_\d+$/.test(s.node))assert.equal(s.flags.xu10LuDepartureKept,undefined);
    if(/^x10_lights_\d+$/.test(s.node))assert.equal(s.flags.xu10LightsOff,undefined);
    if(/^x10_(he|ne|farewell)_autumn_\d+$/.test(s.node)){assert.equal(s.flags.xu10AutumnKept,undefined);assert.equal(s.ending,null)}
  });
});
test('HE needs neither overnight nor public writing nor a particular exhibit role; trial and fresh dating retain distinct statuses',()=>{
  const couple=contexts.find(s=>s.flags.xu9Outcome==='together');
  for(let privacy=0;privacy<3;privacy++)for(let role=0;role<2;role++)for(let evening=0;evening<3;evening++){
    const s=finish(engine.continueChapter(story,couple),[0,0,privacy,role,evening,0,0]);assert.equal(s.ending,'xu_he');assert.equal(s.flags.xu10OvernightKept,evening===0);
  }
  const trial=finish(engine.continueChapter(story,couple),[0,0,0,0,2,1,0]);assert.equal(trial.ending,'xu_ne');assert.equal(trial.flags.relationshipStatus,'girlfriends');
  const fresh=finish(engine.continueChapter(story,contexts.find(s=>s.flags.xu9Outcome==='paused')),[0,0,0,0,0,0,0]);assert.equal(fresh.ending,'xu_ne');assert.equal(fresh.flags.relationshipStatus,'tryingDates');assert.equal(fresh.flags.xu10OvernightKept,false);
});
test('A final desire cannot erase an unresolved pause or cancellation demand; either person can end despite completed shared activities',()=>{
  const prior=contexts.find(s=>s.flags.xu9Outcome==='paused');
  const held=finish(engine.continueChapter(story,prior),[1,0,1,0,0,0,0]);assert.equal(held.ending,'xu_farewell');assert.equal(held.flags.xu10EveningMet,false);
  const couple=contexts.find(s=>s.flags.xu9Outcome==='together');
  const cancel=finish(engine.continueChapter(story,couple),[0,1,0,0,0,0,0]);assert.equal(cancel.ending,'xu_farewell');assert.equal(cancel.flags.xu10CooperationAccepted,true);assert.equal(cancel.flags.xu10OvernightKept,false);
  const end=finish(engine.continueChapter(story,couple),[0,0,0,0,0,0,1]);assert.equal(end.ending,'xu_farewell');assert.equal(end.flags.xu10OvernightKept,true);assert.equal(end.flags.xu10ExhibitHeld,true);
});
test('Tampered endings, business, intimacy and permissions fail recovery; rewind discards all four Xu chapters',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.xu9Outcome==='together')),[0,0,0,0,1,0,0]);
  for(const changes of [{xu10Outcome:'farewell'},{xu10OvernightKept:true},{xu10BusinessDecisionByXu:false},{xu10CooperationAccepted:false},{xu10AutumnKept:false},{xu10PrivateExcerptPublished:true},{xu8CooperationAccepted:true},{privateLetterPublic:true},{selectedRoute:'lin'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'lin_he'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^xu[789]|^xu10/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
