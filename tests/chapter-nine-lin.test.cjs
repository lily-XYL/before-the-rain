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
    [1, work % 2, (work + omitted) % 3, (work + omitted + pending) % 2, (work + pending) % 3],
    [1, work % 2, (work + omitted) % 3, (work + pending) % 3, (work + omitted) % 3, pending]
  ];
  let s = engine.create(story);
  for (const choices of ds) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, choices); }
  return s;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));

test('All 144 ninth-chapter combinations across 24 histories cover every dialogue and retain actual earlier consequences', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  assert.deepEqual(new Set(contexts.map(s => s.flags.lin8Outcome)), new Set(['together', 'slow', 'paused']));
  for (const before of contexts) for (let prior = 0; prior < 2; prior++) for (let help = 0; help < 3; help++) for (let work = 0; work < 2; work++) for (let reply = 0; reply < 2; reply++) for (let station = 0; station < 3; station++) for (let morning = 0; morning < 2; morning++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [prior, help, work, reply, station, morning], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, old = before.flags;
    const ready = old.lin8Outcome !== 'paused' || prior === 0;
    const outcome = !ready || reply === 1 ? 'apart' : old.lin8Outcome === 'together' && help !== 2 ? 'steady' : 'rebuilding';
    const status = outcome === 'steady' ? 'girlfriends' : outcome === 'apart' || help === 2 ? 'needsConversation' : old.relationshipStatus;
    const met = outcome !== 'apart' && station !== 2;
    assert.equal(s.ending, 'l9_' + outcome); assert.equal(f.lin9Outcome, outcome); assert.equal(s.choices.length, 50);
    assert.equal(f.relationshipStatus, status); assert.equal(f.lin9EntryReady, ready);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && prior === 1);
    assert.equal(f.lin9OldRepairKept, prior === 1 ? false : old.pendingOmittedConversation ? true : undefined);
    assert.equal(f.lin9PriorResponseGiven, prior === 0);
    assert.equal(f.lin9PriorCancellationWithdrawn, prior === 0 && old.lin8ContactChoice === 'cancel' ? true : undefined);
    assert.equal(f.lin9HelpStated, help === 0); assert.equal(f.lin9PressureMade, help === 2);
    assert.equal(f.lin9WetItems, [2, 5, 3][help]); assert.equal(f.lin9WetOriginals, [0, 2, 1][help]);
    assert.equal(f.lin9DamageLogged, true); assert.equal(f.lin9BooksMoved, true);
    assert.equal(f.lin9HandoffKept, work === 0); assert.equal(f.lin9NightInventoryDone, work === 0);
    assert.equal(f.lin9MorningInventoryDone, true); assert.equal(f.lin9AuthorsNotified, true);
    assert.equal(f.lin9ContactRespected, reply === 0); assert.equal(f.lin9NightResponseGiven, reply === 0);
    assert.equal(f.lin9BriefingAttended, true); assert.equal(f.lin9BriefingNotCancelled, true);
    assert.equal(f.lin9BriefingScheduled, '6-24 19:30'); assert.equal(f.lin9WindowRepairBooked, '6-25 morning');
    assert.equal(f.lin9OwnerRestKept, true); assert.equal(f.lin9LuPackingHelp, '6-25 evening carry box');
    assert.equal(f.lin9UnapprovedMaterialsUsed, false); assert.equal(f.lin9UnbudgetedReprintOrdered, false);
    assert.equal(f.lin9MeetingAllowed, outcome !== 'apart'); assert.equal(f.lin9StationMet, met);
    assert.equal(f.lin9HeldHands, outcome === 'steady' && station === 0);
    assert.equal(visited.has('l9_station_choice_0'), outcome === 'steady');
    assert.equal(visited.has('l9_learning_choice_0'), outcome === 'rebuilding');
    assert.equal(visited.has('l9_apart_choice_0'), outcome === 'apart');
    assert.equal(visited.has('l9_alone_stop_0'), outcome === 'apart');
    for (const flag of ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'repairActionKept', 'sixthRepairActionKept', 'lin7ConflictResolved', 'lin7Outcome', 'lin7Kiss', 'lin7PrintHandedOff', 'lin8Outcome', 'lin8ScheduleReady', 'lin8OldRepairKept', 'lin8ContactPlan', 'lin8ContactReady', 'lin8RelationshipConfirmed', 'lin8Stay', 'lin8PrivateEvening', 'lin8SampleChecked', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'layoutReady', 'finalLayoutConfirmed', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'lin8LettersPrivate', 'luMoveDate', 'luDeparturePlan', 'pendingLuConversation']) assert.equal(f[flag], old[flag], flag);
    assert.equal(engine.nextChapterNode(story, s), 'l10_start_0');
    const next = engine.continueChapter(story, s);
    assert.equal(next.node, 'l10_start_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    endings.add(s.ending); paths++;
  }
  assert.equal(paths, 3456); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 9 && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited dialogue: ' + id);
});

test('Released eighth-chapter endings restore into nine without changing original flags, choices or history', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 8)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('l9_'))) };
  legacy.nodes.lin_eight_complete = { chapter: 8, resolve: true };
  for (const old of contexts) {
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.strictEqual(engine.advance(story, old), old); assert.equal(engine.nextChapterNode(story, old), 'l9_morning_0');
    const next = engine.continueChapter(story, old);
    assert.equal(next.node, 'l9_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.choices, old.choices); assert.deepEqual(next.history, old.history);
  }
});

test('Every representative checkpoint restores across eight boundaries, with briefing completion recorded only after the message', () => {
  const ds = [[0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 1, 1], [0, 0, 0, 0, 2, 0], [0, 2, 0, 0, 0, 1], [1, 2, 1, 1, 1, 0], [1, 0, 0, 0, 2, 1]];
  for (let i = 0; i < ds.length; i++) finish(engine.continueChapter(story, contexts[i * 3]), ds[i], state => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    if (state.node.startsWith('l9_team_') || state.node.startsWith('l9_handoff_') || state.node.startsWith('l9_solo_')) assert.equal(state.flags.lin9BriefingAttended, undefined);
  });
});

test('Declining touch or the station meeting preserves a reconciled relationship; accepting help is independent of romance', () => {
  const before = contexts.find(s => s.flags.lin8Outcome === 'together'); assert.ok(before);
  for (let work = 0; work < 2; work++) for (let station = 0; station < 3; station++) {
    const s = finish(engine.continueChapter(story, before), [1, 0, work, 0, station, 0]);
    assert.equal(s.ending, 'l9_steady'); assert.equal(s.flags.relationshipStatus, 'girlfriends');
    assert.equal(s.flags.lin9HeldHands, station === 0); assert.equal(s.flags.lin9StationMet, station !== 2);
    assert.equal(s.flags.lin9NightInventoryDone, work === 0); assert.equal(s.flags.lin9MorningInventoryDone, true);
    assert.equal(s.flags.lin8Stay, before.flags.lin8Stay);
  }
});

test('Pressure cannot cancel the briefing or buy reconciliation; prior paused relationships require a separate response', () => {
  const before = contexts.find(s => s.flags.lin8Outcome === 'together');
  const pressured = finish(engine.continueChapter(story, before), [0, 2, 0, 0, 0, 0]);
  assert.equal(pressured.ending, 'l9_rebuilding'); assert.equal(pressured.flags.relationshipStatus, 'needsConversation');
  assert.equal(pressured.flags.lin9BriefingAttended, true); assert.equal(pressured.flags.lin9HeldHands, false);
  const pending = contexts.find(s => s.flags.lin8Outcome === 'paused' && s.flags.pendingOmittedConversation && s.flags.omittedPerson === 'lin');
  assert.ok(pending);
  const held = finish(engine.continueChapter(story, pending), [1, 0, 0, 0, 0, 0]);
  assert.equal(held.ending, 'l9_apart'); assert.equal(held.flags.pendingOmittedConversation, true); assert.equal(held.flags.lin9StationMet, false);
  const acted = finish(engine.continueChapter(story, pending), [0, 0, 0, 0, 0, 0]);
  assert.equal(acted.ending, 'l9_rebuilding'); assert.equal(acted.flags.pendingOmittedConversation, false);
  assert.equal(acted.flags.relationshipStatus, 'needsConversation'); assert.equal(acted.flags.lin8Outcome, 'paused');
});

test('Tampered damage, relationship, budget or permissions fail recovery; rewind drops all future rescue and relationship state', () => {
  const s = finish(engine.continueChapter(story, contexts[0]), [0, 0, 0, 0, 0, 0]);
  for (const changes of [{ lin9Outcome: 'apart' }, { lin9WetItems: 0 }, { lin9BriefingAttended: false }, { lin9HeldHands: false }, { plannedCopies: 1000 }, { privateLetterPublic: true }, { selectedRoute: 'xu' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, 49) }), null);
  assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  for (const flag of ['lin9WetItems', 'lin9BriefingAttended', 'lin9Outcome', 'lin9HeldHands', 'lin9MorningInventoryDone', 'lin8Outcome', 'lin8Stay', 'selectedRoute', 'relationshipStatus']) assert.equal(old.flags[flag], undefined);
  assert.deepEqual(engine.restore(story, old), old);
});
