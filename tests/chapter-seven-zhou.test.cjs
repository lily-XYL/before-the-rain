const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js'), engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(s, ds, visit = () => {}) {
  let i = 0, steps = 0;
  while (!s.ending) { assert.ok(++steps < limit, s.node); visit(s); s = engine.advance(story, s, story.nodes[s.node].choices ? ds[i++] : undefined); }
  visit(s); assert.equal(i, ds.length); return s;
}
function boundary(work, omitted, pending, route = 2) {
  const focus = (work + omitted) % 2 ? 4 : 2;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [[work, omitted % 3, friend], [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work], [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, pending, work, 0, pending ? 2 : 0, 1, route], [1, 1, route, work % 2]];
  let s = engine.create(story);
  for (const choices of ds) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, choices); }
  return s;
}
const contexts = [];
for (let work=0;work<3;work++)for(let omitted=0;omitted<4;omitted++)for(let pending=0;pending<2;pending++)contexts.push(boundary(work,omitted,pending));
const preserved = ['selectedRoute','routeFocusReady','L_present','X_need','Z_reality','Y_withoutCamera','keptPromise','priorityCompleted','rebookKept','repairActionKept','sixthRepairActionKept','sixthFriendTalkKept','nextPrivateMeeting','sixthRepairTalkTime','plannedCost','plannedCopies','plannedPages','budgetReserve','finalProofDeadline','printHandoffDate','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateClipRecorded','privateLetterPublic','videoPlaybackApproved','withdrawnSubmission','luMoveDate','luDeparturePlan','equipmentRepairCompleted'];

test('All 216 Zhou seventh-chapter combinations across 24 real histories cover every line and preserve actual earlier facts',()=>{
  const source=require('../chapter-seven-zhou.js'),ids=[...source.scenes,...source.gates].map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(new Set(contexts.map(s=>s.flags.relationshipStatus)),new Set(['tryingDates','gettingToKnow','needsConversation']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let repair=0;repair<2;repair++)for(let work=0;work<3;work++)for(let topic=0;topic<2;topic++)for(let response=0;response<3;response++)for(let follow=0;follow<2;follow++)for(let close=0;close<3;close++){
    const visited=new Set();
    const s=finish(engine.continueChapter(story,before),[repair,work,topic,response,follow,close],at=>{seen.add(at.node);visited.add(at.node)}),old=before.flags,f=s.flags;
    const pending=old.pendingOmittedConversation&&repair===1;
    const privateMeeting=old.relationshipStatus!=='needsConversation'||!(pending&&old.omittedPerson==='zhou');
    const eligible=privateMeeting&&follow===0;
    const outcome=!eligible?'distance':response===1?'slow':'open';
    assert.equal(s.ending,'z7_'+outcome);assert.equal(s.choices.length,39);endings.add(s.ending);
    assert.equal(f.z7EntryStatus,old.relationshipStatus);assert.equal(f.pendingOmittedConversation,pending);
    assert.equal(f.z7RepairCompleted,old.pendingOmittedConversation&&repair===0);
    assert.equal(f.z7MeetingKind,privateMeeting?'private':'workOnly');assert.equal(f.z7PrivateInvitationAccepted,privateMeeting);
    assert.equal(f.z7MeetingBooked,privateMeeting?'6-21 16:00 snack':'6-21 16:00-16:20 work');
    assert.equal(f.z7MeetingKept,true);assert.equal(f.z7PrivateMeetingKept,privateMeeting);assert.equal(f.z7WorkMeetingKept,!privateMeeting);
    assert.equal(f.z7MelodyShared,privateMeeting);assert.equal(f.z7MelodyRecorded,false);assert.equal(f.z7DedicatedSongPublic,false);
    assert.equal(f.z7TopicChoice,privateMeeting?['ordinary','backstage'][topic]:['scope','capacity'][topic]);
    assert.equal(f.z7ResponseActionKept,follow===0);assert.equal(f.z7ConversationReady,eligible);
    assert.equal(f.z7Outcome,outcome);assert.equal(f.z7PrivateMode,outcome==='open'?'girlfriends':outcome==='slow'?'considering':'paused');
    assert.equal(f.relationshipStatus,outcome==='open'?'girlfriends':outcome==='slow'?old.relationshipStatus==='tryingDates'?'tryingDates':'gettingToKnow':'needsConversation');
    assert.equal(f.z7RelationshipConfirmed,outcome==='open');assert.equal(f.z7ExclusiveAgreed,outcome==='open');assert.equal(f.z7RelationshipPublic,false);
    assert.equal(Boolean(f.z7GuessingCorrected),eligible&&response===2);
    assert.equal(f.z7Kissed,outcome==='open'&&close===0);assert.equal(f.z7HeldHands,outcome==='open'&&close===1);
    assert.equal(f.z7ReplyDueBooked,outcome==='slow');assert.equal(f.z7ReplyTime,outcome==='slow'?'6-22 18:00':undefined);
    assert.equal(f.z7NextContactBooked,eligible);assert.equal(f.z7NextContactTime,eligible?'6-22 18:00-18:10':undefined);
    assert.equal(f.z7RehearsalAttended,work!==2);assert.equal(f.z7HelpKept,work===1);assert.equal(f.z7HelpMinutes,work===1?15:0);
    assert.equal(f.z7BorrowApproved,true);assert.equal(f.z7EquipmentCheckDone,true);assert.equal(f.z7RehearsalPlanChecked,true);assert.equal(f.z7SetMinutes,15);assert.equal(f.z7ChangeoverSeparate,true);
    assert.equal(f.z7ShenFeedbackSentAt,'6-20 17:30');assert.equal(f.z7SamplesChecked,false);
    assert.equal(f.z7ProofConfirmed,true);assert.equal(f.z7ProofReceiptTime,'6-19 09:52-10:00');assert.equal(f.layoutReady,true);assert.equal(f.finalLayoutConfirmed,true);
    assert.equal(f.z7PrintHandedOff,true);assert.equal(f.z7PrintHandoffDate,'6-20');assert.equal(f.pendingLuConversation,false);assert.equal(f.z7LuTalkKept,old.pendingLuConversation);
    assert.equal(visited.has('z7_melody_0'),privateMeeting);assert.equal(visited.has('z7_kiss_0'),outcome==='open'&&close===0);
    assert.equal(visited.has('z7_work_meet_0'),!privateMeeting);
    for(const flag of preserved)assert.equal(f[flag],old[flag],flag);
    assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'chapter');assert.equal(engine.nextChapterNode(story,s),'z8_morning_0');
    const next=engine.continueChapter(story,s);assert.equal(next.node,'z8_morning_0');assert.deepEqual(next.flags,s.flags);assert.deepEqual(next.choices,s.choices);assert.deepEqual(next.history,s.history);paths++;
  }
  assert.equal(paths,5184);assert.equal(endings.size,3);
  for(const [id,node]of Object.entries(story.nodes))if(node.chapter==='zhou7'&&!node.redirectBy)assert.ok(seen.has(id),'Unvisited Zhou line: '+id);
});

test('Released sixth-chapter saves continue only into the chosen implemented route without rewriting earlier flags, choices or history',()=>{
  const legacy={...story,nodes:{...story.nodes,chapter_six_complete:{chapter:6,resolve:true}}};
  for(let route=0;route<5;route++)for(let work=0;work<3;work++){
    const s=boundary(work,route%4,1,route),expected=['l7_morning_0','x7_morning_0','z7_morning_0','y7_morning_0','s7_morning_0'][route];
    assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);
    assert.equal(engine.nextChapterNode(story,s),expected);const n=engine.continueChapter(story,s);
    if(expected){assert.equal(n.node,expected);assert.equal(n.ending,null);assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}else assert.strictEqual(n,s);
  }
});

test('Every representative checkpoint restores across six boundaries; work, relationship and touch are marked only after actual scenes',()=>{
  const dates=contexts.find(s=>s.flags.relationshipStatus==='tryingDates'),slow=contexts.find(s=>s.flags.relationshipStatus==='gettingToKnow'),pending=contexts.find(s=>s.flags.relationshipStatus==='needsConversation');
  for(const [before,ds]of [[dates,[0,0,0,0,0,0]],[dates,[1,1,1,1,0,2]],[dates,[0,2,0,2,1,1]],[slow,[1,2,1,2,0,1]],[pending,[0,1,0,0,0,2]],[pending,[1,0,1,0,0,0]],[pending,[1,2,0,1,1,2]]])finish(engine.continueChapter(story,before),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    if(/^z7_proof_done_\d+$/.test(s.node))assert.equal(s.flags.z7ProofConfirmed,undefined);
    if(/^z7_print_\d+$/.test(s.node))assert.equal(s.flags.z7PrintHandedOff,undefined);
    if(/^z7_lu_talk_\d+$/.test(s.node))assert.equal(s.flags.pendingLuConversation,true);
    if(/^z7_melody_\d+$/.test(s.node))assert.equal(s.flags.z7MelodyShared,undefined);
    if(/^z7_confirm_\d+$/.test(s.node))assert.equal(s.flags.z7RelationshipConfirmed,undefined);
    if(/^z7_kiss_\d+$/.test(s.node))assert.equal(s.flags.z7Kissed,undefined);
    if(/^z7_equipment_\d+$/.test(s.node))assert.equal(s.flags.z7BorrowApproved,undefined);
    assert.equal(s.flags.z7NextContactKept,undefined);
  });
});

test('Rehearsal attendance and kiss, hand holding or no touch do not gate a mutual relationship; considering retains prior dating status',()=>{
  const before=contexts.find(s=>s.flags.relationshipStatus==='tryingDates');
  for(let work=0;work<3;work++)for(let topic=0;topic<2;topic++)for(let close=0;close<3;close++){
    const s=finish(engine.continueChapter(story,before),[0,work,topic,2,0,close]);assert.equal(s.ending,'z7_open');assert.equal(s.flags.relationshipStatus,'girlfriends');assert.equal(s.flags.z7GuessingCorrected,true);assert.equal(s.flags.z7Kissed,close===0);assert.equal(s.flags.z7HeldHands,close===1);
  }
  const originalDate=finish(engine.continueChapter(story,before),[0,2,1,1,0,0]);assert.equal(originalDate.ending,'z7_slow');assert.equal(originalDate.flags.relationshipStatus,'tryingDates');
  const learning=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='gettingToKnow')),[0,0,0,1,0,0]);assert.equal(learning.ending,'z7_slow');assert.equal(learning.flags.relationshipStatus,'gettingToKnow');
});

test('Unresolved selected repairs cannot be bypassed by current good words; other partners keep their independent pending work',()=>{
  const before=contexts.find(s=>s.flags.relationshipStatus==='needsConversation');assert.ok(before);
  const held=finish(engine.continueChapter(story,before),[1,1,0,0,0,0]);assert.equal(held.ending,'z7_distance');assert.equal(held.flags.pendingOmittedConversation,true);assert.equal(held.flags.z7MelodyShared,false);assert.equal(held.flags.z7Kissed,false);assert.equal(held.flags.z7NextContactBooked,false);assert.equal(held.flags.z7ResponseActionKept,true);
  const repaired=finish(engine.continueChapter(story,before),[0,2,0,0,0,2]);assert.equal(repaired.ending,'z7_open');assert.equal(repaired.flags.pendingOmittedConversation,false);assert.equal(repaired.flags.z7EntryStatus,'needsConversation');assert.equal(repaired.flags.Z_reality,before.flags.Z_reality);
  const other=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.omittedPerson!=='zhou');assert.ok(other);
  const s=finish(engine.continueChapter(story,other),[1,0,0,0,0,0]);assert.equal(s.ending,'z7_open');assert.equal(s.flags.pendingOmittedConversation,true);assert.equal(s.flags.omittedPerson,other.flags.omittedPerson);
});

test('Tampered permissions, relationship, printing and future replies fail recovery; rewind discards the personal chapter',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='tryingDates')),[0,0,0,0,0,2]);
  for(const changes of [{z7Outcome:'distance'},{z7Kissed:true},{z7DedicatedSongPublic:true},{z7MelodyRecorded:true},{z7NextContactKept:true},{z7SamplesChecked:true},{z7ExclusiveAgreed:false},{plannedCopies:1000},{privateLetterPublic:true},{selectedRoute:'xu'},{xu7Outcome:'open'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'x7_open'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^z7/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
