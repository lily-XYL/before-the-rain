const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(state, choices, visit = () => {}) {
  let i = 0, step = 0;
  while (!state.ending) {
    assert.ok(++step < limit, state.node); visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? choices[i++] : undefined);
  }
  visit(state); assert.equal(i, choices.length); return state;
}
function boundary(work, omitted, pending) {
  const focus = (work + omitted) % 2 ? 4 : 0;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [
    [work, omitted % 3, friend],
    [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work],
    [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, 0, work, 0, pending ? 2 : 0, 1, 0],
    [1, 1, 0, work % 2],
    [1, work % 2, (work + omitted) % 3, (work + omitted + pending) % 2, (work + pending) % 3]
  ];
  let s = engine.create(story);
  for (const choices of ds) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, choices); }
  return s;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));

test('All 216 eighth-chapter combinations across 24 histories cover every visible scene and retain actual permissions', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  assert.deepEqual(new Set(contexts.map(s => s.flags.lin7Outcome)), new Set(['open', 'slow', 'distance']));
  for (const before of contexts) for (let repair = 0; repair < 2; repair++) for (let letter = 0; letter < 2; letter++) for (let contact = 0; contact < 3; contact++) for (let relation = 0; relation < 3; relation++) for (let evening = 0; evening < 3; evening++) for (let feedback = 0; feedback < 2; feedback++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [repair, letter, contact, relation, evening, feedback], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, old = before.flags;
    const pending = old.pendingOmittedConversation && repair === 1;
    const ready = (old.lin7ConflictResolved || repair === 0) && !(pending && old.omittedPerson === 'lin');
    const eligible = ready && contact !== 2;
    const outcome = !eligible || relation === 2 ? 'paused' : relation === 0 ? 'together' : 'slow';
    const previousStatus = old.relationshipStatus === 'needsConversation' && ready ? 'gettingToKnow' : old.relationshipStatus;
    assert.equal(s.ending, 'l8_' + outcome); assert.equal(f.lin8Outcome, outcome); assert.equal(s.choices.length, 44);
    assert.equal(f.relationshipStatus, outcome === 'together' ? 'girlfriends' : outcome === 'slow' ? previousStatus : 'needsConversation');
    assert.equal(f.lin8Ready, ready); assert.equal(f.lin8ScheduleReady, old.lin7ConflictResolved || repair === 0);
    assert.equal(f.lin8ScheduleRepairKept, !old.lin7ConflictResolved && repair === 0 ? true : undefined);
    assert.equal(f.lin8OldRepairKept, old.pendingOmittedConversation && repair === 0);
    assert.equal(f.pendingOmittedConversation, pending);
    assert.equal(f.lin8NewLettersRead, true); assert.equal(f.lin8LettersPrivate, true); assert.equal(f.lin8LetterMeetingKept, true);
    assert.equal(f.lin8ContactReady, contact !== 2);
    assert.equal(f.lin8ContactPlan, ['twiceWeeklyWithConfirmation', 'reviewAfterTwoWeeks', 'notAgreed'][contact]);
    assert.equal(f.lin8RelationshipConfirmed, outcome === 'together');
    assert.equal(f.lin8Stay, outcome === 'together' && evening === 0);
    assert.equal(f.lin8PrivateEvening, outcome === 'together' && evening === 0 ? true : undefined);
    assert.equal(f.lin8MorningCall, outcome === 'together' && evening !== 0 ? '6-23 09:30' : undefined);
    assert.equal(f.lin8SampleChecked, true);
    assert.equal(visited.has('l8_relationship_choice_0'), eligible);
    assert.equal(visited.has('l8_relationship_guard_0'), !eligible);
    assert.equal(visited.has('l8_evening_choice_0'), outcome === 'together');
    assert.equal(visited.has('l8_home_0'), outcome === 'together' && evening !== 2);
    assert.equal(visited.has('l8_stay_0'), outcome === 'together' && evening === 0);
    assert.equal(visited.has('l8_morning_home_0'), outcome === 'together' && evening === 0);
    assert.equal(visited.has('l8_morning_phone_0'), outcome === 'together' && evening !== 0);
    for (const id of visited) if (story.nodes[id].location === 'lin_home') assert.equal(outcome === 'together' && evening !== 2, true, id);
    for (const flag of ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'repairActionKept', 'sixthRepairActionKept', 'lin7RepairCompleted', 'lin7ConflictResolved', 'lin7Outcome', 'lin7Kiss', 'lin7HeldHands', 'lin7LetterMeeting', 'lin7ProofConfirmed', 'lin7PrintHandedOff', 'plannedCost', 'plannedCopies', 'budgetReserve', 'finalProofDeadline', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'luDeparturePlan']) assert.equal(f[flag], old[flag], flag);
    assert.equal(engine.nextChapterNode(story, s), 'l9_morning_0');
    const next = engine.continueChapter(story, s);
    assert.equal(next.ending, null); assert.equal(next.node, 'l9_morning_0');
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    endings.add(s.ending); paths++;
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 8 && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited dialogue: ' + id);
});

test('Released seventh-chapter endings restore and enter eight without altering earlier decisions or flags', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 7)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('l8_'))) };
  legacy.nodes.lin_seven_complete = { chapter: 7, resolve: true };
  for (const old of contexts) {
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.strictEqual(engine.advance(story, old), old);
    assert.equal(engine.nextChapterNode(story, old), 'l8_morning_0');
    const next = engine.continueChapter(story, old);
    assert.equal(next.ending, null); assert.equal(next.node, 'l8_morning_0');
    assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.choices, old.choices); assert.deepEqual(next.history, old.history);
  }
});

test('Every checkpoint restores across seven boundaries, including phone, breakfast, slow and paused responses', () => {
  const ds = [[0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 1, 1], [0, 0, 1, 0, 2, 0], [0, 1, 0, 1, 1, 1], [0, 0, 2, 0, 0, 0], [1, 1, 1, 2, 2, 1]];
  for (let i = 0; i < ds.length; i++) finish(engine.continueChapter(story, contexts[i * 3]), ds[i], state => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
  });
});

test('Dinner and going home preserve a consensual relationship and get actual next-morning calls without an overnight', () => {
  for (let evening = 0; evening < 3; evening++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, contexts[0]), [0, 0, 0, 0, evening, 0], at => visited.add(at.node));
    assert.equal(s.ending, 'l8_together'); assert.equal(s.flags.relationshipStatus, 'girlfriends');
    const homeFeedback = [...visited].filter(id => id.startsWith('l8_feedback_') && id.includes('_home'));
    assert.equal(homeFeedback.length > 0, evening === 0);
    assert.ok(s.history.some(h => h.text.includes(evening === 0 ? '小桌旁' : evening === 1 ? '钥匙真的没有落下' : '睡得不错')));
    if (evening !== 0) assert.equal(s.flags.lin8PrivateEvening, undefined);
  }
});

test('A new concrete repair can reopen conversation, while holding it or demanding cancellation cannot grant closeness', () => {
  const old = contexts.find(s => s.flags.pendingOmittedConversation && s.flags.omittedPerson === 'lin' && !s.flags.lin7ConflictResolved);
  assert.ok(old);
  const repaired = finish(engine.continueChapter(story, old), [0, 0, 0, 0, 0, 0]);
  assert.equal(repaired.ending, 'l8_together'); assert.equal(repaired.flags.lin8ScheduleRepairKept, true);
  assert.equal(repaired.flags.lin7ConflictResolved, false); assert.equal(repaired.flags.lin7RepairCompleted, false);
  for (const ds of [[1, 0, 0, 0, 0, 0], [0, 0, 2, 0, 1, 1]]) {
    const s = finish(engine.continueChapter(story, old), ds);
    assert.equal(s.ending, 'l8_paused'); assert.equal(s.flags.lin8Stay, false);
    assert.equal(s.flags.lin8PrivateEvening, undefined); assert.equal(s.flags.relationshipStatus, 'needsConversation');
    assert.ok(s.history.some(h => h.text.includes(ds[4] === 0 ? '今天想自己回去' : '今天先不聊了')));
  }
});

test('Personal-line rewind drops future relationship and private evening; forged progress or permissions cannot restore', () => {
  const s = finish(engine.continueChapter(story, contexts[0]), [0, 0, 0, 0, 0, 0]);
  for (const changes of [{ lin8Outcome: 'paused' }, { lin8Stay: false }, { privateLetterPublic: true }, { lin7ConflictResolved: false }, { selectedRoute: 'xu' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, 43) }), null);
  assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  for (const flag of ['lin8Outcome', 'lin8Stay', 'lin8PrivateEvening', 'lin8NewLettersRead', 'lin7Outcome', 'selectedRoute', 'relationshipStatus']) assert.equal(old.flags[flag], undefined);
  assert.deepEqual(engine.restore(story, old), old);
});
