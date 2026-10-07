const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(state, choices, visit = () => {}) {
  let i = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, state.node); visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? choices[i++] : undefined);
  }
  visit(state); assert.equal(i, choices.length); return state;
}
function boundary(work, omitted, pending, route = 1) {
  const focus = (work + omitted) % 2 ? 4 : 1;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [
    [work, omitted % 3, friend],
    [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work],
    [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, pending, work, 0, pending ? 2 : 0, 1, route],
    [1, 1, route, work % 2]
  ];
  let state = engine.create(story);
  for (const choices of ds) { if (state.ending) state = engine.continueChapter(story, state); state = finish(state, choices); }
  return state;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));
const preserved = ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'keptPromise', 'priorityCompleted', 'rebookKept', 'repairActionKept', 'sixthRepairActionKept', 'sixthFriendTalkKept', 'nextPrivateMeeting', 'sixthRepairTalkTime', 'sixthFriendTalkTime', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'finalProofDeadline', 'printHandoffDate', 'workflow', 'readingMode', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'withdrawnSubmission', 'luMoveDate', 'luDeparturePlan'];

test('All 216 Xu chapter-seven combinations across 24 histories cover every dialogue and preserve previous choices and permissions', () => {
  const source = require('../chapter-seven-xu.js');
  const ids = [...source.scenes, ...source.gates].map(n => n.id);
  assert.equal(new Set(ids).size, ids.length, 'Chapter source IDs must be unique.');
  const seen = new Set(), endings = new Set(); let paths = 0;
  assert.deepEqual(new Set(contexts.map(s => s.flags.relationshipStatus)), new Set(['tryingDates', 'gettingToKnow', 'needsConversation']));
  for (const before of contexts) for (let repair = 0; repair < 2; repair++) for (let work = 0; work < 3; work++) for (let topic = 0; topic < 2; topic++) for (let response = 0; response < 3; response++) for (let follow = 0; follow < 2; follow++) for (let close = 0; close < 3; close++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [repair, work, topic, response, follow, close], at => { seen.add(at.node); visited.add(at.node); });
    const old = before.flags, f = s.flags;
    const pending = old.pendingOmittedConversation && repair === 1;
    const eligible = follow === 0 && !(pending && old.omittedPerson === 'xu');
    const already = old.relationshipStatus === 'tryingDates';
    const privateMeeting = old.relationshipStatus !== 'needsConversation' || !pending;
    const outcome = !eligible ? 'distance' : already || close === 0 ? 'open' : 'slow';
    assert.equal(s.ending, 'x7_' + outcome); assert.equal(s.choices.length, 39); assert.equal(f.xu7Outcome, outcome);
    assert.equal(f.relationshipStatus, outcome === 'open' ? 'tryingDates' : outcome === 'slow' ? 'gettingToKnow' : 'needsConversation');
    assert.equal(f.xu7EntryStatus, old.relationshipStatus); assert.equal(f.pendingOmittedConversation, pending);
    assert.equal(f.xu7RepairCompleted, old.pendingOmittedConversation && repair === 0);
    assert.equal(f.xu7ConversationReady, follow === 0); assert.equal(f.xu7PatternActionKept, follow === 0);
    assert.equal(f.xu7MeetingKind, privateMeeting ? 'private' : 'workOnly');
    assert.equal(f.xu7MeetingBooked, privateMeeting ? '6-21 18:00 dinner' : '6-21 18:00-18:30 work');
    assert.equal(f.xu7PrivateInvitationAccepted, privateMeeting); assert.equal(f.xu7DinnerKept, privateMeeting);
    assert.equal(f.xu7WorkMeetingKept, !privateMeeting); assert.equal(f.xu7PastVoluntarilyShared, privateMeeting);
    assert.equal(f.xu7PrivateNoteShared, privateMeeting); assert.equal(f.xu7PrivateNotePublished, false);
    assert.equal(f.xu7ThirdChoice, privateMeeting ? ['myDay', 'herEvening'][topic] : ['scope', 'capacity'][topic]);
    assert.equal(f.xu7HeldHands, eligible && already && close === 0);
    assert.equal(f.xu7NextPrivateContactBooked, outcome === 'open');
    assert.equal(f.xu7NextContactTime, outcome === 'open' ? '6-22 19:30 ten-minute call' : undefined);
    assert.equal(visited.has('x7_affection_choice_0'), eligible && already);
    assert.equal(visited.has('x7_start_choice_0'), eligible && !already);
    assert.equal(visited.has('x7_pause_private_0'), !eligible && privateMeeting);
    assert.equal(visited.has('x7_pause_work_0'), !eligible && !privateMeeting);
    assert.equal(visited.has('x7_dinner_0'), privateMeeting); assert.equal(visited.has('x7_past_0'), privateMeeting);
    assert.equal(f.pendingLuConversation, false); assert.equal(f.xu7LuTalkKept, old.pendingLuConversation);
    assert.equal(f.layoutReady, true); assert.equal(f.finalLayoutConfirmed, true); assert.equal(f.xu7ProofConfirmed, true);
    assert.equal(f.xu7ProofReceiptTime, '6-19 09:52-10:00'); assert.equal(f.xu7PrintHandedOff, true); assert.equal(f.xu7PrintHandoffDate, '6-20');
    assert.equal(f.xu7SamplesChecked, false); assert.equal(f.xu7CheckRolesConfirmed, true);
    for (const flag of preserved) assert.equal(f[flag], old[flag], flag);
    assert.equal(Object.keys(f).some(k => /^lin[789]|^lin10/.test(k)), false);
    assert.equal(engine.nextChapterNode(story, s), 'x8_morning_0');
    const next = engine.continueChapter(story, s);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    assert.equal(story.endings[s.ending].kind, 'chapter'); endings.add(s.ending); paths++;
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 'xu7' && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited Xu dialogue: ' + id);
});

test('Released sixth-chapter saves retain all history and route to each implemented personal chapter', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, n]) => n.chapter <= 6)) };
  legacy.nodes.chapter_six_complete = { chapter: 6, resolve: true };
  for (let route = 0; route < 5; route++) for (let work = 0; work < 3; work++) {
    const old = boundary(work, route % 4, 1, route);
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.strictEqual(engine.advance(story, old), old);
    const expected = ['l7_morning_0', 'x7_morning_0', 'z7_morning_0', 'y7_morning_0', 's7_morning_0'][route];
    assert.equal(engine.nextChapterNode(story, old), expected);
    const next = engine.continueChapter(story, old);
    if (expected) { assert.equal(next.node, expected); assert.equal(next.ending, null); assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.choices, old.choices); assert.deepEqual(next.history, old.history); }
    else assert.strictEqual(next, old);
  }
});

test('Representative checkpoints restore across six boundaries; proof, printing and friendship are marked only after the actual action', () => {
  const ready = contexts.find(s => s.flags.relationshipStatus === 'tryingDates');
  const slow = contexts.find(s => s.flags.relationshipStatus === 'gettingToKnow');
  const pending = contexts.find(s => s.flags.relationshipStatus === 'needsConversation');
  for (const [before, choices] of [[ready, [0, 0, 0, 0, 0, 0]], [ready, [1, 1, 1, 1, 0, 2]], [ready, [0, 2, 0, 2, 1, 1]], [slow, [1, 2, 1, 2, 0, 1]], [pending, [0, 1, 0, 0, 0, 0]], [pending, [1, 0, 1, 0, 0, 2]]]) finish(engine.continueChapter(story, before), choices, state => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    if (state.node.startsWith('x7_proof_done_')) assert.equal(state.flags.xu7ProofConfirmed, undefined);
    if (state.node.startsWith('x7_print_')) assert.equal(state.flags.xu7PrintHandedOff, undefined);
    if (state.node.startsWith('x7_lu_talk_')) assert.equal(state.flags.pendingLuConversation, true);
    if (state.node.startsWith('x7_hand_')) assert.equal(state.flags.xu7HeldHands, undefined);
  });
});

test('Hand holding, walking without touch and going home all preserve a reconciled dating relationship', () => {
  const before = contexts.find(s => s.flags.relationshipStatus === 'tryingDates');
  for (let work = 0; work < 3; work++) for (let topic = 0; topic < 2; topic++) for (let close = 0; close < 3; close++) {
    const s = finish(engine.continueChapter(story, before), [0, work, topic, 2, 0, close]);
    assert.equal(s.ending, 'x7_open'); assert.equal(s.flags.xu7HeldHands, close === 0);
    assert.equal(s.flags.relationshipStatus, 'tryingDates'); assert.equal(s.flags.xu7NextPrivateContactBooked, true);
    assert.ok(s.history.some(h => h.text.includes('收回这个要求')));
  }
});

test('Unfinished Xu adjustments cannot be bypassed by a good conversation; other partners retain their own pending tasks', () => {
  const before = contexts.find(s => s.flags.relationshipStatus === 'needsConversation'); assert.ok(before);
  const held = finish(engine.continueChapter(story, before), [1, 0, 0, 0, 0, 0]);
  assert.equal(held.ending, 'x7_distance'); assert.equal(held.flags.pendingOmittedConversation, true);
  assert.equal(held.flags.xu7DinnerKept, false); assert.equal(held.flags.xu7PrivateNoteShared, false);
  assert.equal(held.flags.xu7PastVoluntarilyShared, false); assert.equal(held.flags.xu7HeldHands, false);
  assert.ok(!held.history.some(h => h.text.includes('以前有过一段关系')));
  const acted = finish(engine.continueChapter(story, before), [0, 0, 0, 0, 0, 0]);
  assert.equal(acted.ending, 'x7_open'); assert.equal(acted.flags.pendingOmittedConversation, false);
  assert.equal(acted.flags.xu7EntryStatus, 'needsConversation'); assert.equal(acted.flags.xu7HeldHands, false);
  assert.equal(acted.flags.X_need, before.flags.X_need);
  const other = contexts.find(s => s.flags.pendingOmittedConversation && s.flags.omittedPerson !== 'xu'); assert.ok(other);
  const s = finish(engine.continueChapter(story, other), [1, 0, 0, 0, 0, 0]);
  assert.equal(s.ending, 'x7_open'); assert.equal(s.flags.pendingOmittedConversation, true); assert.equal(s.flags.omittedPerson, other.flags.omittedPerson);
});

test('Tampered route, progress and permissions fail recovery; rewind removes Xu developments without inheriting Lin facts', () => {
  const s = finish(engine.continueChapter(story, contexts[0]), [0, 0, 0, 0, 0, 0]);
  for (const changes of [{ xu7Outcome: 'distance' }, { xu7DinnerKept: false }, { xu7PrivateNotePublished: true }, { xu7SamplesChecked: true }, { plannedCopies: 1000 }, { privateLetterPublic: true }, { selectedRoute: 'lin' }, { lin7Outcome: 'open' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...s, ending: 'l7_open' }), null);
  assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, 38) }), null);
  assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  for (const flag of ['xu7Outcome', 'xu7EntryStatus', 'xu7PrivateNoteShared', 'xu7HeldHands', 'xu7PrintHandedOff', 'selectedRoute', 'relationshipStatus']) assert.equal(old.flags[flag], undefined);
  assert.deepEqual(engine.restore(story, old), old);
});
