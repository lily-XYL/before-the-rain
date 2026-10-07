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
    [0, pending, work, 0, pending ? 2 : 0, 1, 1], [1, 1, 1, work % 2],
    [1, work, pending, 0, pending ? 1 : 0, omitted % 3]];
  let state = engine.create(story);
  for (const choices of ds) { if (state.ending) state = engine.continueChapter(story, state); state = finish(state, choices); }
  return state;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));
const inherited = ['selectedRoute', 'X_need', 'L_present', 'Z_reality', 'Y_withoutCamera', 'priorityCompleted', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'workflow', 'readingMode', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateLetterPublic', 'privateClipRecorded', 'videoPlaybackApproved', 'pendingLuConversation', 'luMoveDate', 'luDeparturePlan'];
test('All 216 chapter-eight decisions across 24 real histories cover all dialogue and retain facts and permissions', () => {
  const source = require('../chapter-eight-xu.js'), ids = [...source.scenes, ...source.gates].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(new Set(contexts.map(s => s.flags.xu7Outcome)), new Set(['open', 'slow', 'distance']));
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (const before of contexts) for (let repair = 0; repair < 2; repair++) for (let samples = 0; samples < 2; samples++) for (let cooperation = 0; cooperation < 3; cooperation++) for (let follow = 0; follow < 2; follow++) for (let relationship = 0; relationship < 3; relationship++) for (let evening = 0; evening < 3; evening++) {
    const visited = new Set(), old = before.flags;
    const s = finish(engine.continueChapter(story, before), [repair, samples, cooperation, follow, relationship, evening], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, prior = old.xu7Outcome !== 'distance' || repair === 0, eligible = prior && cooperation !== 2 && follow === 0;
    const outcome = !eligible || relationship === 2 ? 'paused' : relationship === 0 ? 'together' : 'slow';
    assert.equal(s.ending, 'x8_' + outcome); endings.add(s.ending); assert.equal(s.choices.length, 45);
    assert.equal(f.xu8EntryOutcome, old.xu7Outcome); assert.equal(f.xu8PriorReady, prior);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && repair === 1);
    assert.equal(f.xu8OldRepairKept, old.pendingOmittedConversation && repair === 0);
    assert.equal(f.xu8PrivateTalkAllowed, eligible); assert.equal(visited.has('x8_private_0'), eligible);
    assert.equal(f.xu8RelationshipConfirmed, outcome === 'together'); assert.equal(f.xu8RelationshipPublic, false);
    assert.equal(f.relationshipStatus, outcome === 'together' ? 'girlfriends' : outcome === 'paused' ? 'needsConversation' : old.xu7Outcome === 'open' ? 'tryingDates' : 'gettingToKnow');
    assert.equal(f.xu8EveningMet, outcome !== 'paused' && evening < 2);
    assert.equal(f.xu8HeldHands, outcome === 'together' && evening === 0);
    assert.equal(f.xu8BooksReceived, true); assert.equal(f.xu8DeliveryTime, '6-22 10:00');
    assert.equal(f.xu8DeliveredCopies, old.plannedCopies); assert.equal(f.xu8SamplesChecked, true);
    assert.equal(f.xu8SampleCount, samples === 0 ? 3 : 5); assert.equal(f.xu8SampleHidden, samples === 1);
    assert.equal(f.xu8ShenWorkStarted, samples === 0 ? '6-22 10:40' : '6-22 11:20');
    assert.equal(f.xu8HiddenBurdenAcknowledged, samples === 1 && follow === 0);
    assert.equal(f.xu8ShenFeedbackSent, '6-22 17:30'); assert.equal(f.xu8XuOwnFileSent, '6-23 08:40');
    assert.equal(f.xu8CallKept, prior); assert.equal(f.xu8WorkMessageKept, !prior);
    assert.equal(f.xu8CallFinishedAt, prior ? '6-22 19:40' : undefined);
    assert.equal(f.xu8CallKind, !prior ? 'workMessage' : old.xu7Outcome === 'open' ? 'oldCall' : old.xu7Outcome === 'slow' ? 'newCall' : 'newTalk');
    assert.equal(f.xu8InterferenceMade, cooperation === 2); assert.equal(f.xu8DecisionRespected, cooperation !== 2);
    assert.equal(f.xu8CorrectionSent, cooperation === 2 && follow === 0);
    assert.equal(f.xu8OwnReplyReasserted, true); assert.equal(f.xu8CooperationAccepted, false);
    assert.equal(f.xu8CooperationReplyDue, '6-26 17:00'); assert.equal(f.xu8PatternActionKept, follow === 0);
    for (const key of [...inherited, ...Object.keys(old).filter(k => k.startsWith('xu7'))]) assert.deepEqual(f[key], old[key], key);
    assert.equal(Object.keys(f).some(k => /^lin[789]|^lin10/.test(k)), false);
    assert.equal(engine.nextChapterNode(story, s), 'x9_morning_0');
    const next = engine.continueChapter(story, s);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    assert.equal(story.endings[s.ending].kind, 'chapter'); paths++;
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 'xu8' && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited: ' + id);
});
test('Released Xu seventh-chapter saves resume eighth chapter without changing history or old appointments', () => {
  const legacy = { ...story, nodes: { ...story.nodes, xu_seven_complete: { chapter: 'xu7', resolve: true } } };
  for (const s of contexts) {
    assert.deepEqual(engine.restore(legacy, s), s); assert.deepEqual(engine.restore(story, s), s);
    assert.strictEqual(engine.advance(story, s), s); const next = engine.continueChapter(story, s);
    assert.equal(next.node, 'x8_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
  }
});
test('Checkpoints restore across seven boundaries; delivery, checks and calls are recorded after actual scenes', () => {
  for (const entry of ['open', 'slow', 'distance']) for (const choices of [[0,0,0,0,0,0],[1,1,1,0,1,1],[0,1,2,0,0,2],[1,0,0,1,2,2]]) {
    const before = contexts.find(s => s.flags.xu7Outcome === entry);
    finish(engine.continueChapter(story, before), choices, s => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(s))), s, s.node);
      if (s.node.startsWith('x8_delivery_')) assert.equal(s.flags.xu8BooksReceived, undefined);
      if (/^x8_sample_shared_\d+$/.test(s.node) || s.node.startsWith('x8_extra_check_')) assert.equal(s.flags.xu8SamplesChecked, undefined);
      if (s.node.startsWith('x8_call_end_')) assert.equal(s.flags.xu8CallKept, undefined);
      if (s.node.startsWith('x8_walk_hand_')) assert.equal(s.flags.xu8HeldHands, undefined);
      if (s.node.startsWith('x8_private_')) assert.equal(s.flags.xu8RelationshipConfirmed, undefined);
    });
  }
});
test('Finite separate help and joint planning equally support girlfriends; touch, chat and rest are independent', () => {
  const before = contexts.find(s => s.flags.xu7Outcome === 'open');
  for (let cooperation = 0; cooperation < 2; cooperation++) for (let evening = 0; evening < 3; evening++) {
    const s = finish(engine.continueChapter(story, before), [0, 0, cooperation, 0, 0, evening]);
    assert.equal(s.ending, 'x8_together'); assert.equal(s.flags.relationshipStatus, 'girlfriends');
    assert.equal(s.flags.xu8HeldHands, evening === 0); assert.equal(s.flags.xu8EveningMet, evening !== 2);
  }
});
test('Correcting an unauthorized refusal retains its consequence; unrepaired prior pauses cannot be bypassed', () => {
  const open = contexts.find(s => s.flags.xu7Outcome === 'open');
  const corrected = finish(engine.continueChapter(story, open), [0,1,2,0,0,0]);
  assert.equal(corrected.ending, 'x8_paused'); assert.equal(corrected.flags.xu8CorrectionSent, true);
  assert.equal(corrected.flags.xu8InterferenceMade, true); assert.equal(corrected.flags.xu8HiddenBurdenAcknowledged, true);
  assert.equal(corrected.flags.xu8EveningMet, false); assert.ok(corrected.history.some(h => h.text.includes('今天仍不愿恢复私人约会')));
  const pending = contexts.find(s => s.flags.xu7Outcome === 'distance' && s.flags.pendingOmittedConversation && s.flags.omittedPerson === 'xu'); assert.ok(pending);
  const held = finish(engine.continueChapter(story, pending), [1,0,0,0,0,0]);
  assert.equal(held.ending, 'x8_paused'); assert.equal(held.flags.pendingOmittedConversation, true); assert.equal(held.flags.xu8CallKept, false);
  const repaired = finish(engine.continueChapter(story, pending), [0,0,0,0,0,0]);
  assert.equal(repaired.ending, 'x8_together'); assert.equal(repaired.flags.pendingOmittedConversation, false);
  assert.equal(repaired.flags.xu7Outcome, 'distance'); assert.equal(repaired.flags.xu7NextPrivateContactBooked, false);
  // Build an open chapter-seven state that deliberately retains another partner's task.
  const sixth = engine.rewind(story, contexts.find(s => s.flags.pendingOmittedConversation && s.flags.omittedPerson !== 'xu'), 'x7_morning_0');
  const openOther = finish(sixth, [1,0,0,0,0,0]);
  const s = finish(engine.continueChapter(story, openOther), [1,0,1,0,0,2]);
  assert.equal(s.ending, 'x8_together'); assert.equal(s.flags.pendingOmittedConversation, true);
});
test('Recovery rejects forged progress and permissions; rewind removes both Xu chapters and preserves prefix', () => {
  const s = finish(engine.continueChapter(story, contexts[0]), [0,0,0,0,0,0]);
  for (const changes of [{xu8CallKept:false}, {xu8HeldHands:false}, {xu8CooperationAccepted:true}, {xu8Outcome:'paused'}, {xu7SamplesChecked:true}, {privateLetterPublic:true}, {selectedRoute:'lin'}, {lin8Outcome:'together'}]) assert.equal(engine.restore(story, {...s,flags:{...s.flags,...changes}}), null);
  assert.equal(engine.restore(story, {...s,ending:'l8_together'}), null);
  assert.equal(engine.restore(story, {...s,choices:s.choices.slice(0,-1)}), null);
  assert.deepEqual(engine.restore(story, {...s,history:[]}), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  assert.equal(Object.keys(old.flags).some(k => /^xu[78]/.test(k)), false);
  assert.deepEqual(engine.restore(story, old), old);
});
