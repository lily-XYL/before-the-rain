const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const limit = Object.keys(story.nodes).length * 2;
function finish(state, choices, visit = () => {}) {
  let i = 0, step = 0;
  while (!state.ending) {
    assert.ok(++step < limit); visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? choices[i++] : undefined);
  }
  visit(state); assert.equal(i, choices.length); return state;
}
function boundary(work, omitted, pending, route = 0) {
  const focus = (work + omitted) % 2 ? 4 : 0;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [
    [work, omitted % 3, friend],
    [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work],
    [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, 0, work, 0, pending ? 2 : 0, 1, route],
    [1, 1, route, work % 2]
  ];
  let s = engine.create(story);
  for (const choices of ds) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, choices); }
  return s;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));

test('All 72 Lin chapter-seven combinations across 24 histories cover every visible scene and preserve actual consequences', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (const before of contexts) for (let repair = 0; repair < 2; repair++) for (let opening = 0; opening < 2; opening++) for (let response = 0; response < 3; response++) for (let follow = 0; follow < 2; follow++) for (let closeness = 0; closeness < 3; closeness++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [repair, opening, response, follow, closeness], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, old = before.flags;
    const pending = old.pendingOmittedConversation && repair === 1;
    const eligible = follow === 0 && !(pending && old.omittedPerson === 'lin');
    const alreadyDating = old.relationshipStatus === 'tryingDates';
    const outcome = !eligible ? 'distance' : alreadyDating || closeness === 0 ? 'open' : 'slow';
    assert.equal(s.ending, 'l7_' + outcome); assert.equal(f.lin7Outcome, outcome); assert.equal(s.choices.length, 38);
    assert.equal(f.relationshipStatus, !eligible ? 'needsConversation' : outcome === 'open' ? 'tryingDates' : 'gettingToKnow');
    assert.equal(f.lin7EntryStatus, old.relationshipStatus);
    assert.equal(f.lin7ConflictResolved, follow === 0);
    assert.equal(f.lin7HurtAcknowledged, response === 2 && follow === 0 ? true : undefined);
    assert.equal(f.lin7Kiss, eligible ? alreadyDating && closeness === 0 : undefined);
    assert.equal(f.lin7HeldHands, eligible ? alreadyDating ? closeness !== 2 : closeness === 0 : undefined);
    assert.equal(visited.has('l7_affection_choice_0'), eligible && alreadyDating);
    assert.equal(visited.has('l7_start_choice_0'), eligible && !alreadyDating);
    assert.equal(visited.has('l7_pause_choice_0'), !eligible);
    assert.equal(visited.has('l7_walk_0'), eligible);
    assert.equal(f.lin7LetterMeeting, outcome === 'open' ? '6-22 14:00' : undefined);
    assert.equal(f.pendingOmittedConversation, pending);
    assert.equal(f.lin7RepairCompleted, old.pendingOmittedConversation && repair === 0);
    assert.equal(f.pendingLuConversation, false); assert.equal(f.lin7LuTalkKept, old.pendingLuConversation);
    assert.equal(visited.has('l7_lu_kept_0'), old.pendingLuConversation);
    assert.equal(f.layoutReady, true); assert.equal(f.finalLayoutConfirmed, true); assert.equal(f.lin7ProofConfirmed, true);
    assert.equal(f.lin7PrintHandedOff, true); assert.equal(f.lin7PrintHandoffDate, '6-20');
    for (const flag of ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'keptPromise', 'repairActionKept', 'sixthRepairActionKept', 'sixthFriendTalkKept', 'nextPrivateMeeting', 'sixthRepairTalkTime', 'sixthFriendTalkTime', 'plannedCost', 'plannedCopies', 'budgetReserve', 'finalProofDeadline', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'luDeparturePlan']) assert.equal(f[flag], old[flag], flag);
    assert.equal(engine.nextChapterNode(story, s), 'l8_morning_0');
    const next = engine.continueChapter(story, s);
    assert.equal(next.node, 'l8_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, s.flags); assert.deepEqual(next.choices, s.choices); assert.deepEqual(next.history, s.history);
    endings.add(s.ending); paths++;
  }
  assert.equal(paths, 1728); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 7 && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited dialogue: ' + id);
});

test('Only the selected Lin direction unlocks chapter seven; all released sixth-chapter states restore unchanged', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 6)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('l7_'))) };
  legacy.nodes.chapter_six_complete = { chapter: 6, resolve: true };
  for (let route = 0; route < 5; route++) for (let work = 0; work < 3; work++) {
    const old = boundary(work, route % 4, 1, route);
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.strictEqual(engine.advance(story, old), old);
    assert.equal(engine.nextChapterNode(story, old), ['l7_morning_0', 'x7_morning_0', 'z7_morning_0', 'y7_morning_0', 's7_morning_0'][route]);
    const next = engine.continueChapter(story, old);
    if (route === 0) {
      assert.equal(next.node, 'l7_morning_0'); assert.equal(next.ending, null);
      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);
    } else if (route === 1) {
      assert.equal(next.node, 'x7_morning_0'); assert.equal(next.ending, null);
      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);
    } else if (route === 2) {
      assert.equal(next.node, 'z7_morning_0'); assert.equal(next.ending, null);
      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);
    } else if (route === 3) {
      assert.equal(next.node, 'y7_morning_0'); assert.equal(next.ending, null);
      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);
    } else {
      assert.equal(next.node, 's7_morning_0'); assert.equal(next.ending, null);
      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);
    }
  }
});

test('Every checkpoint on nine representative Lin routes restores canonically across six boundaries', () => {
  for (let i = 0; i < 9; i++) {
    const before = contexts[(i * 5) % contexts.length];
    finish(engine.continueChapter(story, before), [i % 2, i % 2, i % 3, Math.floor(i / 3) % 2, i % 3], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('Choosing hand holding or no touch does not downgrade a reconciled dating route', () => {
  const old = boundary(0, 0, 0);
  assert.equal(old.flags.relationshipStatus, 'tryingDates');
  for (let closeness = 0; closeness < 3; closeness++) {
    const s = finish(engine.continueChapter(story, old), [0, 0, 2, 0, closeness]);
    assert.equal(s.ending, 'l7_open'); assert.equal(s.flags.relationshipStatus, 'tryingDates');
    assert.equal(s.flags.lin7Kiss, closeness === 0);
  }
});

test('An unresolved adjustment blocks intimacy; new progress cannot backfill an old missed event', () => {
  const pending = boundary(0, 0, 1);
  assert.equal(pending.flags.relationshipStatus, 'needsConversation');
  const blocked = finish(engine.continueChapter(story, pending), [1, 0, 0, 0, 0]);
  assert.equal(blocked.ending, 'l7_distance'); assert.equal(blocked.flags.lin7Kiss, undefined);
  assert.equal(blocked.flags.pendingOmittedConversation, true);
  const missing = boundary(1, 0, 0);
  assert.equal(missing.flags.L_present, undefined);
  const started = finish(engine.continueChapter(story, missing), [0, 0, 0, 0, 0]);
  assert.equal(started.flags.relationshipStatus, 'tryingDates'); assert.equal(started.flags.L_present, undefined);
  assert.equal(started.flags.lin7Kiss, false);
  for (const changes of [{ lin7Kiss: true }, { L_present: true }, { pendingOmittedConversation: true }, { lin7Outcome: 'distance' }, { selectedRoute: 'xu' }]) assert.equal(engine.restore(story, { ...started, flags: { ...started.flags, ...changes } }), null);
  assert.deepEqual(engine.restore(story, { ...started, history: [] }), started);
});

test('Review from a personal-line save replays the common-line prefix without carrying future romance or printing state', () => {
  const s = finish(engine.continueChapter(story, boundary(0, 0, 0)), [0, 0, 0, 0, 0]);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.choices.length, 16); assert.equal(old.node, 'c4_choose_priority_0');
  for (const flag of ['lin7Outcome', 'lin7Kiss', 'lin7PrintHandedOff', 'selectedRoute', 'relationshipStatus']) assert.equal(old.flags[flag], undefined);
  assert.deepEqual(engine.restore(story, old), old);
});
