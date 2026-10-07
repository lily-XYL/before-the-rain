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
    [1, work, pending, 0, pending ? 1 : 0, omitted % 3],
    pending ? [1, work % 2, omitted % 3, work % 2, 0, 0] : [1, work % 2, 0, 0, omitted % 2, 2]];
  let state = engine.create(story);
  for (const choices of ds) { if (state.ending) state = engine.continueChapter(story, state); state = finish(state, choices); }
  return state;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));
const inherited = ['selectedRoute', 'X_need', 'L_present', 'Z_reality', 'Y_withoutCamera', 'priorityCompleted', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'workflow', 'readingMode', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateLetterPublic', 'privateClipRecorded', 'videoPlaybackApproved', 'pendingLuConversation', 'luMoveDate', 'luDeparturePlan'];
test('All 144 ninth-chapter combinations across 24 real histories cover every line and preserve printed facts and permissions', () => {
  const source = require('../chapter-nine-xu.js'), ids = [...source.scenes, ...source.gates].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(new Set(contexts.map(s => s.flags.xu8Outcome)), new Set(['together', 'slow', 'paused']));
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (const before of contexts) for (let prior = 0; prior < 2; prior++) for (let plan = 0; plan < 3; plan++) for (let work = 0; work < 2; work++) for (let reply = 0; reply < 2; reply++) for (let evening = 0; evening < 3; evening++) for (let morning = 0; morning < 2; morning++) {
    const visited = new Set(), old = before.flags;
    const s = finish(engine.continueChapter(story, before), [prior, plan, work, reply, evening, morning], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, ready = old.xu8Outcome !== 'paused' || prior === 0, allowed = ready && reply === 0;
    const outcome = !allowed ? 'paused' : old.xu8Outcome === 'together' ? 'together' : 'reopen';
    assert.equal(s.ending, 'x9_' + outcome); endings.add(s.ending); assert.equal(s.choices.length, 51);
    assert.equal(f.xu9EntryReady, ready); assert.equal(f.xu9PrivateConversationAllowed, allowed);
    assert.equal(f.xu9PriorResponseGiven, prior === 0); assert.equal(f.xu9CurrentAdjustmentKept, reply === 0);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && prior === 1);
    assert.equal(f.xu9OldRepairKept, old.pendingOmittedConversation && prior === 0);
    assert.equal(f.xu9HiddenBurdenAcknowledged, prior === 0 && old.xu8SampleHidden && !old.xu8HiddenBurdenAcknowledged);
    assert.equal(f.xu9CorrectionSent, prior === 0 && old.xu8InterferenceMade && !old.xu8CorrectionSent);
    assert.equal(f.relationshipStatus, outcome === 'paused' ? 'needsConversation' : old.relationshipStatus);
    assert.equal(f.xu9ExistingRelationshipContinued, allowed && old.xu8Outcome !== 'paused');
    assert.equal(f.xu9DatingResumed, false); assert.equal(f.xu9EveningMet, allowed && evening < 2);
    assert.equal(f.xu9HeldHands, outcome === 'together' && evening === 0);
    assert.equal(visited.has('x9_station_hand_0'), outcome === 'together' && evening === 0);
    assert.equal(visited.has('x9_reopen_paused_0'), allowed && old.xu8Outcome === 'paused');
    assert.equal(f.xu9DamageLogged, true); assert.equal(f.xu9WetCopies, 4); assert.equal(f.xu9WetOriginals, 0);
    assert.equal(f.xu9QuarantinedCopies, 4); assert.equal(f.xu9AvailableCopies, old.plannedCopies - 4);
    assert.equal(f.xu9DamageTime, '6-24 18:55'); assert.equal(f.xu9BooksMoved, true); assert.equal(f.xu9EquipmentMoved, true);
    assert.equal(f.xu9PrivateAccidentRecorded, false); assert.equal(f.xu9OwnerRestKept, true);
    assert.equal(f.xu9DisplayPlan, ['reduce','manual','restore'][plan]);
    assert.equal(f.xu9DisplayTargetPages, plan === 2 ? 8 : 4); assert.equal(f.xu9HandmadeCards, plan === 1 ? 4 : 0);
    assert.equal(f.xu9ReprintQuoteReceived, plan === 2); assert.equal(f.xu9ReprintQuoteAmount, plan === 2 ? 48 : undefined);
    assert.equal(f.xu9ReprintOrdered, false); assert.equal(f.xu9ExtraCost, 0); assert.equal(f.xu9NightDisplayReady, false);
    assert.equal(f.xu9NightInventoryDone, work === 0); assert.equal(f.xu9NightCheckedSamples, work === 0 ? 8 : 6);
    assert.equal(f.xu9FullGuidanceRequested, work === 1); assert.equal(f.xu9FullRequestWithdrawn, work === 1 && reply === 0);
    assert.equal(f.xu9WorkStoppedAt, '6-24 20:00'); assert.equal(f.xu9AuthorsNotified, true);
    assert.equal(f.xu9AuthorsNotifiedAt, '6-24 20:15'); assert.equal(f.xu9MorningCheckKept, morning === 0);
    assert.equal(f.xu9InventoryDone, work === 0 || morning === 0);
    assert.equal(f.xu9InventoryFinalCheckedSamples, work === 0 || morning === 0 ? 8 : 6);
    assert.equal(f.xu9DisplayReady, morning === 0); assert.equal(f.xu9DisplayCompletedPages, morning === 0 ? plan === 2 ? 8 : 4 : 0);
    assert.equal(f.xu9MorningStatusNotified, true); assert.equal(f.xu9WindowRepaired, true);
    assert.equal(f.xu9BriefingNotCancelled, true); assert.equal(f.xu9BriefingAttended, true);
    assert.equal(f.xu9PublisherMaterialsSent, true); assert.equal(f.xu9PublisherMaterialsSentAt, '6-25 11:00');
    assert.equal(f.xu9PublisherDeadline, '6-25 12:00'); assert.equal(f.xu9PublisherDeadlineKept, true); assert.equal(f.xu9PublisherWorkDelegated, false);
    for (const key of [...inherited, ...Object.keys(old).filter(k => /^xu[78]/.test(k))]) assert.deepEqual(f[key], old[key], key);
    assert.deepEqual(s.choices.slice(0, before.choices.length), before.choices);
    assert.equal(Object.keys(f).some(k => /^lin[789]|^lin10/.test(k)), false);
    assert.equal(engine.nextChapterNode(story, s), 'x10_start_0');
    const next = engine.continueChapter(story, s);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    assert.equal(story.endings[s.ending].kind, 'chapter'); paths++;
  }
  assert.equal(paths, 3456); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 'xu9' && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited: ' + id);
});
test('Released eighth-chapter bookmarks restore and explicitly enter ninth without rewriting old history', () => {
  const legacy = { ...story, nodes: { ...story.nodes, xu_eight_complete: { chapter: 'xu8', resolve: true } } };
  for (const s of contexts) {
    assert.deepEqual(engine.restore(legacy, s), s); assert.deepEqual(engine.restore(story, s), s);
    assert.strictEqual(engine.advance(story, s), s); const next = engine.continueChapter(story, s);
    assert.equal(next.node, 'x9_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
  }
});
test('Checkpoints restore across eight boundaries and mark damage, assistance, display and submissions after actual scenes', () => {
  const cases = [['together',[0,0,0,0,0,0]], ['together',[1,2,1,0,2,1]],
    ['slow',[0,1,0,0,1,0]], ['slow',[1,0,1,1,0,1]],
    ['paused',[0,2,1,0,0,0]], ['paused',[1,1,0,0,2,1]]];
  for (const [entry, choices] of cases) finish(engine.continueChapter(story, contexts.find(s => s.flags.xu8Outcome === entry)), choices, s => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(s))), s, s.node);
    if (/^x9_damage_\d+$/.test(s.node)) assert.equal(s.flags.xu9DamageLogged, undefined);
    if (/^x9_morning_finish_\d+$/.test(s.node)) assert.equal(s.flags.xu9MorningCheckKept, undefined);
    if (/^x9_display_(reduce|manual|restore)_\d+$/.test(s.node)) assert.equal(s.flags.xu9DisplayReady, undefined);
    if (/^x9_publisher_sent_\d+$/.test(s.node)) assert.equal(s.flags.xu9PublisherMaterialsSent, undefined);
    if (/^x9_station_hand_\d+$/.test(s.node)) assert.equal(s.flags.xu9HeldHands, undefined);
    if (/^x9_next_morning_\d+$/.test(s.node)) assert.equal(s.flags.xu9WindowRepaired, undefined);
  });
});
test('Display size, morning deferral and physical touch never decide an otherwise consensual relationship', () => {
  const before = contexts.find(s => s.flags.xu8Outcome === 'together');
  for (let plan = 0; plan < 3; plan++) for (let evening = 0; evening < 3; evening++) for (let morning = 0; morning < 2; morning++) {
    const s = finish(engine.continueChapter(story, before), [0,plan,0,0,evening,morning]);
    assert.equal(s.ending, 'x9_together'); assert.equal(s.flags.relationshipStatus, 'girlfriends');
    assert.equal(s.flags.xu9HeldHands, evening === 0); assert.equal(s.flags.xu9DisplayReady, morning === 0);
  }
});
test('Repairing a prior refusal reopens only conversation; holding old or new adjustments preserves the pause', () => {
  const pending = contexts.find(s => s.flags.xu8Outcome === 'paused' && s.flags.xu8InterferenceMade && !s.flags.xu8CorrectionSent); assert.ok(pending);
  const s = finish(engine.continueChapter(story, pending), [0,2,1,0,0,0]);
  assert.equal(s.ending, 'x9_reopen'); assert.equal(s.flags.relationshipStatus, 'needsConversation');
  assert.equal(s.flags.xu9CorrectionSent, true); assert.equal(s.flags.xu8CorrectionSent, false);
  assert.equal(s.flags.xu8InterferenceMade, true); assert.equal(s.flags.xu9DatingResumed, false);
  assert.equal(s.flags.xu9HeldHands, false); assert.equal(s.flags.xu9EveningMet, true);
  assert.ok(s.history.some(h => h.text.includes('今天仍不恢复约会')));
  const held = finish(engine.continueChapter(story, pending), [1,0,0,0,0,0]);
  assert.equal(held.ending, 'x9_paused'); assert.equal(held.flags.xu9EveningMet, false);
  const currentHold = finish(engine.continueChapter(story, contexts.find(s => s.flags.xu8Outcome === 'together')), [0,1,0,1,0,0]);
  assert.equal(currentHold.ending, 'x9_paused'); assert.equal(currentHold.flags.xu9DisplayReady, true);
  const other = contexts.find(s => s.flags.pendingOmittedConversation && s.flags.omittedPerson !== 'xu');
  const otherHeld = finish(engine.continueChapter(story, other), [1,1,0,0,0,1]);
  assert.equal(otherHeld.flags.pendingOmittedConversation, true); assert.equal(otherHeld.flags.omittedPerson, other.flags.omittedPerson);
});
test('Forged business decisions, stock, money and romance fail recovery; rewind removes future rescue and relationship', () => {
  const s = finish(engine.continueChapter(story, contexts.find(s => s.flags.xu8Outcome === 'together')), [0,2,0,0,0,0]);
  for (const changes of [{xu9WetCopies:0}, {xu9AvailableCopies:s.flags.plannedCopies}, {xu9ReprintOrdered:true}, {xu9ExtraCost:48}, {xu9PublisherWorkDelegated:true}, {xu9DatingResumed:true}, {xu8CooperationAccepted:true}, {xu9Outcome:'paused'}, {privateLetterPublic:true}, {selectedRoute:'lin'}]) assert.equal(engine.restore(story, {...s,flags:{...s.flags,...changes}}), null);
  assert.equal(engine.restore(story, {...s,ending:'l9_steady'}), null); assert.equal(engine.restore(story, {...s,choices:s.choices.slice(0,-1)}), null);
  assert.deepEqual(engine.restore(story, {...s,history:[]}), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  assert.equal(Object.keys(old.flags).some(k => /^xu[789]/.test(k)), false);
  assert.deepEqual(engine.restore(story, old), old);
});
