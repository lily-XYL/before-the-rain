const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js'), engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(s, ds, visit = () => {}) {
  let i=0,steps=0;
  while(!s.ending){assert.ok(++steps<limit,s.node);visit(s);s=engine.advance(story,s,story.nodes[s.node].choices?ds[i++]:undefined)}
  visit(s);assert.equal(i,ds.length);return s;
}
function boundary(work, omitted, pending, seventh) {
  const focus=(work+omitted)%2?4:2,handling=focus===4?2:0,friend=(work+omitted+pending)%2?2:0;
  const ds=[[work,omitted%3,friend],[0,focus%4,omitted%3,0,work%2,friend],
    [0,work,omitted,0,0,work],[0,focus%4,omitted%3,handling,0,friend,omitted],
    [0,pending,work,0,pending?2:0,1,2],[1,1,2,work%2],
    seventh || [1,work%3,pending,work%3,pending?1:0,omitted%3]];
  let s=engine.create(story);
  for(const d of ds){if(s.ending)s=engine.continueChapter(story,s);s=finish(s,d)}return s;
}
const contexts=[];
for(let work=0;work<3;work++)for(let omitted=0;omitted<4;omitted++)for(let pending=0;pending<2;pending++)contexts.push(boundary(work,omitted,pending));
const inherited=['selectedRoute','routeFocusReady','L_present','X_need','Z_reality','Y_withoutCamera','priorityCompleted','keptPromise','plannedCost','plannedCopies','plannedPages','budgetReserve','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateLetterPublic','privateClipRecorded','videoPlaybackApproved','pendingLuConversation','luMoveDate','luDeparturePlan','equipmentRepairCompleted'];

test('All 216 eighth-chapter combinations across 24 real histories cover every line and retain old facts, permissions and missed appointments',()=>{
  const source=require('../chapter-eight-zhou.js'),ids=[...source.scenes,...source.gates].map(x=>x.id);
  assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(contexts.map(s=>s.flags.z7Outcome)),new Set(['open','slow','distance']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let repair=0;repair<2;repair++)for(let sample=0;sample<2;sample++)for(let response=0;response<3;response++)for(let relationship=0;relationship<3;relationship++)for(let evening=0;evening<3;evening++)for(let feedback=0;feedback<2;feedback++){
    const visited=new Set(),old=before.flags;
    const s=finish(engine.continueChapter(story,before),[repair,sample,response,relationship,evening,feedback],at=>{seen.add(at.node);visited.add(at.node)}),f=s.flags;
    const ready=old.z7Outcome!=='distance'||repair===0,privateTalk=ready&&response===0;
    const initial=!privateTalk||relationship===2?'paused':relationship===0?'together':'slow';
    const initialCouple=initial!=='paused'&&(relationship===0||old.z7Outcome==='open');
    const outcome=feedback===1?'paused':initial;
    assert.equal(s.ending,'z8_'+outcome);assert.equal(s.choices.length,45);assert.equal(f.z8Outcome,outcome);endings.add(s.ending);
    assert.equal(f.z8EntryOutcome,old.z7Outcome);assert.equal(f.z8PriorReady,ready);
    assert.equal(f.pendingOmittedConversation,old.pendingOmittedConversation&&repair===1);
    assert.equal(f.z8OldRepairKept,old.pendingOmittedConversation&&repair===0);assert.equal(f.z8CurrentResponsePrepared,repair===0);
    assert.equal(f.z8CallKind,!ready?'workMessage':old.z7Outcome==='distance'?'newTalk':'oldCall');
    assert.equal(f.z8CallStatus,old.z7Outcome==='open'?'girlfriends':old.z7Outcome==='slow'?'tryingDates':'needsConversation');
    assert.equal(f.z8CallAgreed,ready);assert.equal(f.z8CallKept,ready);assert.equal(f.z8ReplyKept,ready&&old.z7Outcome==='slow');
    assert.equal(Boolean(f.z8WorkMessageKept),!ready);assert.equal(f.z8CallFinishedAt,ready?'6-22 18:10':undefined);
    assert.equal(f.z8PrivateAppointmentBooked,ready);assert.equal(f.z8OriginalMeetingKept,false);
    assert.equal(f.z8FirstChangeNotified,ready);assert.equal(f.z8FirstRebookAgreed,ready);assert.equal(f.z8FirstRebookKept,false);
    assert.equal(f.z8FirstChangeNoticeAt,ready?'6-22 19:30':undefined);assert.equal(f.z8FirstChangeLeadMinutes,ready?60:undefined);
    assert.equal(f.z8FirstRebookTime,ready?'6-23 16:00-16:20':undefined);
    assert.equal(f.z8SecondLateNotice,ready);assert.equal(f.z8PrivateMeetingMissed,ready);
    assert.equal(f.z8SecondNoticeAt,ready?'6-23 15:55':undefined);assert.equal(f.z8SecondLeadMinutes,ready?5:undefined);assert.equal(f.z8ShenArrivedAt,ready?'6-23 15:50':undefined);
    assert.equal(f.z8TalkKind,privateTalk?'private':ready&&response===1?'pausePhone':'workMessage');
    assert.equal(f.z8RebookAccepted,privateTalk);assert.equal(f.z8RebookKept,privateTalk);assert.equal(f.z8PrivateTalkKept,privateTalk);assert.equal(f.z8RulesDiscussed,privateTalk);assert.equal(f.z8TalkKept,true);
    assert.equal(f.z8RelationshipAnswer,initial);assert.equal(f.z8EveningMode,initial==='paused'?'paused':initialCouple?'couple':'dates');
    assert.equal(f.z8EveningMet,initial!=='paused'&&evening<2);assert.equal(f.z8HeldHands,initialCouple&&evening===0);
    assert.equal(f.z8RuleFeedbackKept,feedback===0&&initial!=='paused');assert.equal(Boolean(f.z8FinalPauseNew),feedback===1&&initial!=='paused');
    assert.equal(f.relationshipStatus,outcome==='paused'?'needsConversation':initialCouple?'girlfriends':'tryingDates');
    assert.equal(f.z8RelationshipConfirmed,outcome!=='paused'&&initialCouple);assert.equal(f.z8ExclusiveAgreed,outcome!=='paused'&&initialCouple);assert.equal(f.z8RelationshipPublic,false);
    assert.equal(f.z8DecisionRespected,response!==2);assert.equal(f.z8ControlDemandMade,response===2);assert.equal(f.z8ControlDemandWithdrawn,response===2&&feedback===0);
    assert.equal(f.z8ControlWithdrawalAt,response===2&&feedback===0?'6-23 21:35':undefined);
    assert.equal(f.z8TourInquiryReceived,true);assert.equal(f.z8TourAccepted,false);assert.equal(f.z8TourCancelled,false);assert.equal(f.z8BusinessDecisionByZhou,true);
    assert.equal(f.z8TourReplyDue,'6-26 17:00');assert.equal(f.z8TourProposedStart,'7-05');assert.equal(f.z8TourProposedEnd,'7-19');assert.equal(f.z8TourProposedShows,5);
    assert.equal(f.z8BooksReceived,true);assert.equal(f.z8DeliveredCopies,old.plannedCopies);assert.equal(f.z8SamplesChecked,true);assert.equal(f.z8SampleCount,3);assert.equal(f.z8ShenSampleChecked,sample===0);
    assert.equal(f.z8OwnWorkStartedAt,'6-22 10:40');assert.equal(f.z8SampleTime,'6-22 10:10-10:30');assert.equal(f.z8ShenFeedbackSentAt,'6-22 17:30');
    assert.equal(f.z8RecordingCompleted,true);assert.equal(f.z8RecordingTime,'6-22 20:00-21:00');assert.equal(f.z8EpFileSent,true);assert.equal(f.z8EpFileSentAt,'6-23 17:30');
    assert.equal(visited.has('z8_change_second_0'),ready);assert.equal(visited.has('z8_private_talk_0'),privateTalk);assert.equal(visited.has('z8_couple_hand_0'),initialCouple&&evening===0);
    for(const flag of [...inherited,...Object.keys(old).filter(k=>/^z7/.test(k))])assert.deepEqual(f[flag],old[flag],flag);
    assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'chapter');assert.equal(engine.nextChapterNode(story,s),'z9_morning_0');const next=engine.continueChapter(story,s);assert.equal(next.node,'z9_morning_0');assert.deepEqual(next.flags,s.flags);assert.deepEqual(next.choices,s.choices);assert.deepEqual(next.history,s.history);paths++;
  }
  assert.equal(paths,5184);assert.equal(endings.size,3);
  for(const [id,node]of Object.entries(story.nodes))if(node.chapter==='zhou8'&&!node.redirectBy)assert.ok(seen.has(id),'Unvisited Zhou eighth-chapter line: '+id);
});

test('Released seventh-chapter endings restore and explicitly continue without rewriting previous decisions or permissions',()=>{
  const legacy={...story,nodes:{...story.nodes,zhou_seven_complete:{chapter:'zhou7',resolve:true}}};
  for(const s of contexts){assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);assert.equal(engine.nextChapterNode(story,s),'z8_morning_0');const n=engine.continueChapter(story,s);assert.equal(n.node,'z8_morning_0');assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}
});

test('Representative checkpoints restore across seven boundaries and require actual delivery, calls, missed appointments, touch and withdrawals',()=>{
  const open=contexts.find(s=>s.flags.z7Outcome==='open'),slow=contexts.find(s=>s.flags.z7Outcome==='slow'),paused=contexts.find(s=>s.flags.z7Outcome==='distance');
  for(const [before,ds]of [[open,[0,0,0,0,0,0]],[open,[1,1,0,1,2,1]],[slow,[1,0,0,1,1,0]],[slow,[0,1,1,0,0,0]],[paused,[1,1,0,0,0,0]],[paused,[0,0,0,0,1,0]],[open,[0,1,2,0,0,0]]])finish(engine.continueChapter(story,before),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    if(/^z8_delivery_\d+$/.test(s.node))assert.equal(s.flags.z8BooksReceived,undefined);
    if(/^z8_sample_done_\d+$/.test(s.node))assert.equal(s.flags.z8SamplesChecked,undefined);
    if(/^z8_call_(couple|reply|new)_\d+$/.test(s.node))assert.equal(s.flags.z8CallKept,undefined);
    if(/^z8_change_second_\d+$/.test(s.node))assert.equal(s.flags.z8PrivateMeetingMissed,undefined);
    if(/^z8_private_talk_\d+$/.test(s.node))assert.equal(s.flags.z8RebookKept,undefined);
    if(/^z8_couple_hand_\d+$/.test(s.node))assert.equal(s.flags.z8HeldHands,undefined);
    if(/^z8_feedback_control_\d+$/.test(s.node))assert.equal(s.flags.z8ControlDemandWithdrawn,false);
    assert.equal(s.flags.z8TourDepartureKept,undefined);
  });
});

test('Rest, no touch and separate checking preserve a consensual relationship; trials distinguish existing girlfriends and fresh dates',()=>{
  const open=contexts.find(s=>s.flags.z7Outcome==='open');
  for(let sample=0;sample<2;sample++)for(let evening=0;evening<3;evening++){
    const s=finish(engine.continueChapter(story,open),[0,sample,0,0,evening,0]);assert.equal(s.ending,'z8_together');assert.equal(s.flags.relationshipStatus,'girlfriends');assert.equal(s.flags.z8HeldHands,evening===0);
  }
  const trial=finish(engine.continueChapter(story,open),[0,0,0,1,2,0]);assert.equal(trial.ending,'z8_slow');assert.equal(trial.flags.relationshipStatus,'girlfriends');assert.equal(trial.flags.z8ExclusiveAgreed,true);
  const fresh=finish(engine.continueChapter(story,contexts.find(s=>s.flags.z7Outcome==='distance')),[0,1,0,1,0,0]);assert.equal(fresh.ending,'z8_slow');assert.equal(fresh.flags.relationshipStatus,'tryingDates');assert.equal(fresh.flags.z8HeldHands,false);
  const latePause=finish(engine.continueChapter(story,open),[0,0,0,0,0,1]);assert.equal(latePause.ending,'z8_paused');assert.equal(latePause.flags.z8HeldHands,true);assert.equal(latePause.flags.z8RelationshipAnswer,'together');assert.equal(latePause.flags.z8FinalPauseNew,true);
});

test('A genuine change is different from a never-approved date; withdrawing career control cannot buy immediate reconciliation',()=>{
  const paused=contexts.find(s=>s.flags.z7Outcome==='distance');
  const held=finish(engine.continueChapter(story,paused),[1,0,0,0,0,0]);assert.equal(held.ending,'z8_paused');assert.equal(held.flags.z8PrivateAppointmentBooked,false);assert.equal(held.flags.z8PrivateMeetingMissed,false);assert.equal(held.flags.z8CallKept,false);assert.equal(held.flags.z8EveningMet,false);
  const open=contexts.find(s=>s.flags.z7Outcome==='open');
  const control=finish(engine.continueChapter(story,open),[0,0,2,0,0,0]);assert.equal(control.ending,'z8_paused');assert.equal(control.flags.z8ControlDemandMade,true);assert.equal(control.flags.z8ControlDemandWithdrawn,true);assert.equal(control.flags.z8TourCancelled,false);assert.equal(control.flags.z8PrivateTalkKept,false);
  const pending=boundary(0,0,1,[1,0,0,0,0,0]);assert.equal(pending.flags.pendingOmittedConversation,true);assert.notEqual(pending.flags.omittedPerson,'zhou');assert.equal(pending.flags.z7Outcome,'open');
  const independent=finish(engine.continueChapter(story,pending),[1,0,0,0,2,0]);assert.equal(independent.ending,'z8_together');assert.equal(independent.flags.pendingOmittedConversation,true);
});

test('Tampered intimacy, permissions, business and missed dates fail recovery; rewind discards both Zhou chapters',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.z7Outcome==='open')),[0,0,0,0,2,0]);
  for(const changes of [{z8Outcome:'paused'},{z8HeldHands:true},{z8PrivateMeetingMissed:false},{z8TourAccepted:true},{z8TourCancelled:true},{z8RuleFeedbackKept:false},{z7MelodyRecorded:true},{z7DedicatedSongPublic:true},{privateLetterPublic:true},{plannedCopies:1000},{selectedRoute:'xu'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'x8_together'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^z[78]/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
