const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js'), engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(s, ds, visit = () => {}) {
  let i=0,steps=0;
  while(!s.ending){assert.ok(++steps<limit,s.node);visit(s);s=engine.advance(story,s,story.nodes[s.node].choices?ds[i++]:undefined)}
  visit(s);assert.equal(i,ds.length);return s;
}
function boundary(work,omitted,pending,route=3){
  const focus=(work+omitted)%2?4:3,handling=focus===4?2:0,friend=(work+omitted+pending)%2?2:0;
  const ds=[[work,omitted%3,friend],[0,focus%4,omitted%3,0,work%2,friend],
    [0,work,omitted,0,0,work],[0,focus%4,omitted%3,handling,0,friend,omitted],
    [0,pending,work,0,pending?2:0,1,route],[1,1,route,work%2]];
  let s=engine.create(story);for(const d of ds){if(s.ending)s=engine.continueChapter(story,s);s=finish(s,d)}return s;
}
const contexts=[];
for(let w=0;w<3;w++)for(let o=0;o<4;o++)for(let p=0;p<2;p++)contexts.push(boundary(w,o,p));
const preserved=['selectedRoute','routeFocusReady','L_present','X_need','Z_reality','Y_withoutCamera','keptPromise','priorityCompleted','rebookKept','repairActionKept','sixthRepairActionKept','sixthFriendTalkKept','nextPrivateMeeting','sixthRepairTalkTime','plannedCost','plannedCopies','plannedPages','budgetReserve','finalProofDeadline','printHandoffDate','workflow','readingMode','letterScope','letterRecipientPrivate','cameraScope','privateClipRecorded','privateLetterPublic','videoPlaybackApproved','withdrawnSubmission','luMoveDate','luDeparturePlan','equipmentRepairCompleted'];

test('All 216 Ye seventh-chapter choices across 24 real common histories cover every line without resurrecting deleted or never-filmed clips',()=>{
  const source=require('../chapter-seven-ye.js'),ids=[...source.scenes,...source.gates].map(n=>n.id);
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(new Set(contexts.map(s=>s.flags.relationshipStatus)),new Set(['tryingDates','gettingToKnow','needsConversation']));
  assert.deepEqual(new Set(contexts.map(s=>s.flags.cameraScope)),new Set(['none','private','discuss']));
  assert.deepEqual(new Set(contexts.filter(s=>s.flags.pendingOmittedConversation).map(s=>s.flags.omittedPerson)),new Set(['lin','xu','zhou','ye']));
  const seen=new Set(),endings=new Set();let paths=0;
  for(const before of contexts)for(let repair=0;repair<2;repair++)for(let film=0;film<3;film++)for(let topic=0;topic<2;topic++)for(let response=0;response<3;response++)for(let act=0;act<2;act++)for(let close=0;close<3;close++){
    const old=before.flags,visited=new Set(),s=finish(engine.continueChapter(story,before),[repair,film,topic,response,act,close],at=>{seen.add(at.node);visited.add(at.node)}),f=s.flags;
    const pending=old.pendingOmittedConversation&&repair===1,privateMeeting=old.relationshipStatus!=='needsConversation'||!(pending&&old.omittedPerson==='ye');
    const eligible=privateMeeting&&act===0,existingDates=old.relationshipStatus==='tryingDates',outcome=!eligible||!existingDates&&close===2?'distance':existingDates||close===0?'open':'slow';
    assert.equal(s.ending,'y7_'+outcome);assert.equal(s.choices.length,39);assert.equal(f.y7Outcome,outcome);endings.add(s.ending);
    assert.equal(f.y7EntryStatus,old.relationshipStatus);assert.equal(f.pendingOmittedConversation,pending);assert.equal(f.y7RepairCompleted,old.pendingOmittedConversation&&repair===0);
    assert.equal(f.y7MeetingKind,privateMeeting?'private':'workOnly');assert.equal(f.y7PrivateInvitationAccepted,privateMeeting);assert.equal(f.y7MeetingBooked,privateMeeting?'6-21 15:00 plantAndTea':'6-21 15:00-15:20 work');
    assert.equal(f.y7MeetingKept,true);assert.equal(f.y7PrivateMeetingKept,privateMeeting);assert.equal(f.y7WorkMeetingKept,!privateMeeting);assert.equal(f.y7PlantSeen,privateMeeting);assert.equal(f.y7TeaKept,privateMeeting);assert.equal(f.y7CameraAbsent,true);assert.equal(f.y7PersonalStoryShared,privateMeeting);
    assert.equal(f.y7TopicChoice,privateMeeting?['ordinary','making'][topic]:['scope','capacity'][topic]);
    assert.equal(f.y7FilmChoice,['empty','drawing','pending'][film]);assert.equal(f.y7NewEnvironmentRecorded,film===0);assert.equal(f.y7DrawingMade,film===1);assert.equal(f.y7CandidateReady,film!==2);
    for(const k of ['y7PrivateClipImported','y7PrivateClipRecorded','y7PrivateClipPublic','y7EmotionProposalFilmed','y7PrivateEmotionTextUsed','y7PublicScreeningApproved','y7RelationshipConfirmed','y7ExclusiveAgreed','y7RelationshipPublic','y7SamplesChecked','y7ShenWorkDelegated','y7Kissed'])assert.equal(f[k],false,k);
    for(const k of ['y7ProofConfirmed','y7PrintHandedOff','y7EquipmentScopeChecked','y7EnvironmentSessionApproved','y7EmotionProposalSeen','y7EmotionProposalRemoved','y7OldClipBoundaryChecked','y7CandidateScopeConfirmed','y7WorkCheckBooked','y7ShenFeedbackSent'])assert.equal(f[k],true,k);
    assert.equal(f.y7WorkCheckTime,'6-22 10:00-10:20');assert.equal(f.y7WorkCheckKept,undefined);assert.equal(f.y7NextContactKept,undefined);
    assert.equal(f.y7ShenFeedbackSentAt,'6-20 17:30');assert.equal(f.y7YeProgressSent,true);assert.equal(f.y7YeProgressSentAt,'6-20 21:00');assert.equal(f.y7YePublicCutCompleted,false);assert.equal(f.y7PrintHandoffDate,'6-20');assert.equal(f.y7ProofReceiptTime,'6-19 09:52-10:00');assert.equal(f.layoutReady,true);assert.equal(f.finalLayoutConfirmed,true);
    assert.equal(f.pendingLuConversation,false);assert.equal(f.y7LuTalkKept,old.pendingLuConversation);
    assert.equal(f.y7CurrentResponseKept,act===0);assert.equal(f.y7DiscomfortNamed,response===0||act===0);assert.equal(f.y7PretenceCorrected,response===2&&act===0);assert.equal(f.y7ConversationReady,eligible);
    assert.equal(f.relationshipStatus,outcome==='open'?'tryingDates':outcome==='slow'?'gettingToKnow':'needsConversation');
    assert.equal(f.y7DatingStartedHere,outcome==='open'&&!existingDates);assert.equal(f.y7HeldHands,eligible&&existingDates&&close===0);assert.equal(f.y7WalkKept,eligible&&existingDates&&close<2);
    assert.equal(f.y7NextContactBooked,outcome!=='distance');assert.equal(f.y7NextContactTime,outcome!=='distance'?'6-22 18:00-18:10':undefined);
    assert.equal(visited.has('y7_plant_0'),privateMeeting);assert.equal(visited.has('y7_date_hand_0'),eligible&&existingDates&&close===0);assert.equal(visited.has('y7_learning_date_0'),outcome==='open'&&!existingDates);
    assert.equal(visited.has('y7_old_private_0'),old.cameraScope==='private');assert.equal(visited.has('y7_old_none_0'),old.cameraScope==='none');assert.equal(visited.has('y7_old_discuss_0'),old.cameraScope==='discuss');
    for(const flag of preserved)assert.deepEqual(f[flag],old[flag],flag);assert.deepEqual(s.choices.slice(0,before.choices.length),before.choices);
    assert.equal(Object.keys(f).some(k=>/^lin[789]|^lin10|^xu[789]|^xu10|^z[789]|^z10/.test(k)),false);
    assert.equal(story.endings[s.ending].kind,'chapter');assert.equal(engine.nextChapterNode(story,s),'y8_morning_0');const next=engine.continueChapter(story,s);assert.equal(next.node,'y8_morning_0');assert.deepEqual(next.flags,s.flags);assert.deepEqual(next.choices,s.choices);paths++;
  }
  assert.equal(paths,5184);assert.equal(endings.size,3);
  for(const[id,n]of Object.entries(story.nodes))if(n.chapter==='ye7'&&!n.redirectBy)assert.ok(seen.has(id),'Unvisited Ye line: '+id);
});

test('Released sixth-chapter saves continue only into their own chosen route, keeping old flags, choices and dialogue',()=>{
  const legacy={...story,nodes:{...story.nodes,chapter_six_complete:{chapter:6,resolve:true}}};
  for(let route=0;route<5;route++)for(let w=0;w<3;w++){
    const s=boundary(w,route%4,1,route),expected=['l7_morning_0','x7_morning_0','z7_morning_0','y7_morning_0','s7_morning_0'][route];
    assert.deepEqual(engine.restore(legacy,s),s);assert.deepEqual(engine.restore(story,s),s);assert.strictEqual(engine.advance(story,s),s);assert.equal(engine.nextChapterNode(story,s),expected);
    const n=engine.continueChapter(story,s);if(expected){assert.equal(n.node,expected);assert.equal(n.ending,null);assert.deepEqual(n.flags,s.flags);assert.deepEqual(n.choices,s.choices);assert.deepEqual(n.history,s.history)}else assert.strictEqual(n,s);
  }
});

test('Representative checkpoints restore across six boundaries; shooting, own work, current response and touch need actual scenes',()=>{
  const date=contexts.find(s=>s.flags.relationshipStatus==='tryingDates'),slow=contexts.find(s=>s.flags.relationshipStatus==='gettingToKnow'),pending=contexts.find(s=>s.flags.relationshipStatus==='needsConversation');assert.ok(date&&slow&&pending);
  for(const[b,ds]of [[date,[0,0,0,0,0,0]],[date,[1,1,1,2,0,2]],[date,[0,2,0,1,1,1]],[slow,[1,2,1,2,0,0]],[slow,[0,1,0,0,0,1]],[slow,[0,0,1,1,0,2]],[pending,[0,2,0,0,0,0]],[pending,[1,1,1,2,0,0]],[pending,[1,0,0,1,1,2]]])finish(engine.continueChapter(story,b),ds,s=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(s))),s,s.node);
    const expected={y7_proof_done:'y7ProofConfirmed',y7_print:'y7PrintHandedOff',y7_equipment:'y7EquipmentScopeChecked',y7_roughcut:'y7EmotionProposalSeen',y7_film_empty:'y7NewEnvironmentRecorded',y7_film_drawing:'y7DrawingMade',y7_feedback_done:'y7ShenFeedbackSent',y7_plant:'y7PlantSeen',y7_tea:'y7TeaKept',y7_response_kept:'y7CurrentResponseKept',y7_action_work:'y7CurrentResponseKept',y7_mutual:'y7ConversationReady',y7_learning_date:'y7DatingStartedHere',y7_date_hand:'y7HeldHands',y7_contact:'y7NextContactBooked'};
    for(const[id,k]of Object.entries(expected))if(new RegExp('^'+id+'_\\d+$').test(s.node))assert.equal(s.flags[k],undefined,s.node+': '+k);
    if(/^y7_action_private(_(direct|alternative|pretend))?_\d+$/.test(s.node))assert.equal(s.flags.y7CurrentResponseKept,undefined);
    if(/^y7_lu_talk_\d+$/.test(s.node))assert.equal(s.flags.pendingLuConversation,true);
    assert.equal(s.flags.y7WorkCheckKept,undefined);assert.equal(s.flags.y7NextContactKept,undefined);
  });
});

test('Deleting private proposals, deferring a candidate and no touch preserve dates; repairing a vague answer actually names discomfort',()=>{
  const date=contexts.find(s=>s.flags.relationshipStatus==='tryingDates');
  for(let film=0;film<3;film++)for(let topic=0;topic<2;topic++)for(let response=0;response<3;response++)for(let close=0;close<3;close++){
    const s=finish(engine.continueChapter(story,date),[0,film,topic,response,0,close]);assert.equal(s.ending,'y7_open');assert.equal(s.flags.y7PrivateClipPublic,false);assert.equal(s.flags.y7HeldHands,close===0);assert.equal(s.flags.relationshipStatus,'tryingDates');assert.equal(s.flags.y7DatingStartedHere,false);assert.equal(s.flags.y7PretenceCorrected,response===2);
  }
  const slow=contexts.find(s=>s.flags.relationshipStatus==='gettingToKnow');
  const learn=finish(engine.continueChapter(story,slow),[0,2,0,0,0,1]);assert.equal(learn.ending,'y7_slow');assert.equal(learn.flags.relationshipStatus,'gettingToKnow');
  const dateNow=finish(engine.continueChapter(story,slow),[0,2,0,2,0,0]);assert.equal(dateNow.ending,'y7_open');assert.equal(dateNow.flags.y7DatingStartedHere,true);assert.equal(dateNow.flags.y7HeldHands,false);assert.equal(dateNow.flags.y7RelationshipConfirmed,false);
});

test('Unrepaired selected work cannot be bypassed; current good words and film cooperation do not grant private meetings',()=>{
  const pending=contexts.find(s=>s.flags.relationshipStatus==='needsConversation');assert.ok(pending);
  const held=finish(engine.continueChapter(story,pending),[1,0,0,2,0,0]);assert.equal(held.ending,'y7_distance');assert.equal(held.flags.y7CurrentResponseKept,true);assert.equal(held.flags.y7PretenceCorrected,true);assert.equal(held.flags.pendingOmittedConversation,true);assert.equal(held.flags.y7PlantSeen,false);assert.equal(held.flags.y7HeldHands,false);assert.equal(held.flags.y7NextContactBooked,false);
  const repaired=finish(engine.continueChapter(story,pending),[0,2,0,0,0,0]);assert.equal(repaired.ending,'y7_open');assert.equal(repaired.flags.pendingOmittedConversation,false);assert.equal(repaired.flags.y7DatingStartedHere,true);assert.equal(repaired.flags.Y_withoutCamera,pending.flags.Y_withoutCamera);
  const other=contexts.find(s=>s.flags.pendingOmittedConversation&&s.flags.omittedPerson!=='ye');assert.ok(other);
  const stillPending=finish(engine.continueChapter(story,other),[1,2,1,0,0,0]);assert.equal(stillPending.ending,'y7_open');assert.equal(stillPending.flags.pendingOmittedConversation,true);assert.equal(stillPending.flags.omittedPerson,other.flags.omittedPerson);
  const paused=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='tryingDates')),[0,0,0,0,1,0]);assert.equal(paused.ending,'y7_distance');assert.equal(paused.flags.y7PlantSeen,true);assert.equal(paused.flags.y7EmotionProposalRemoved,true);assert.equal(paused.flags.y7PrivateEmotionTextUsed,false);
});

test('Forged old footage, screening, future appointments, relationship and printing fail recovery; rewind discards Ye developments',()=>{
  const s=finish(engine.continueChapter(story,contexts.find(s=>s.flags.relationshipStatus==='tryingDates')),[0,2,0,0,0,2]);
  for(const changes of [{y7Outcome:'distance'},{y7HeldHands:true},{y7PrivateClipImported:true},{y7EmotionProposalFilmed:true},{y7PrivateEmotionTextUsed:true},{y7PublicScreeningApproved:true},{y7NextContactKept:true},{y7WorkCheckKept:true},{y7SamplesChecked:true},{y7RelationshipConfirmed:true},{y7ShenWorkDelegated:true},{videoPlaybackApproved:true},{privateClipRecorded:!s.flags.privateClipRecorded},{cameraScope:'wrong'},{plannedCopies:1000},{privateLetterPublic:true},{selectedRoute:'lin'},{z7Outcome:'open'}])assert.equal(engine.restore(story,{...s,flags:{...s.flags,...changes}}),null);
  assert.equal(engine.restore(story,{...s,ending:'z7_open'}),null);assert.equal(engine.restore(story,{...s,choices:s.choices.slice(0,-1)}),null);assert.deepEqual(engine.restore(story,{...s,history:[]}),s);
  const old=engine.rewind(story,s,story.routeReviewNode);assert.equal(old.node,'c4_choose_priority_0');assert.equal(old.choices.length,16);assert.equal(Object.keys(old.flags).some(k=>/^y7/.test(k)),false);assert.deepEqual(engine.restore(story,old),old);
});
