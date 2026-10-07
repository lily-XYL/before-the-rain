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
function boundary(work, omitted, pending, evening = (work + omitted) % 3) {
  const focus = (work + omitted) % 2 ? 4 : 0;
  const handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const ds = [
    [work, omitted % 3, friend],
    [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work],
    [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, pending, work, 0, pending ? 2 : 0, 1, 0],
    [1, 1, 0, work % 2],
    [1, work % 2, (work + omitted) % 3, (work + omitted + pending) % 2, (work + pending) % 3],
    [1, work % 2, (work + omitted) % 3, (work + pending) % 3, evening, pending],
    [pending ? 1 : work === 1 ? 0 : 1, (work + omitted) % 3, work % 2, pending, (work + omitted) % 3, pending]
  ];
  let s = engine.create(story);
  for (const choices of ds) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, choices); }
  return s;
}
const contexts = [];
for (let work = 0; work < 3; work++) for (let omitted = 0; omitted < 4; omitted++) for (let pending = 0; pending < 2; pending++) contexts.push(boundary(work, omitted, pending));
const preserved = ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'repairActionKept', 'sixthRepairActionKept', 'lin7ConflictResolved', 'lin7Outcome', 'lin7Kiss', 'lin7PrintHandedOff', 'lin8Outcome', 'lin8ScheduleReady', 'lin8OldRepairKept', 'lin8ContactChoice', 'lin8ContactPlan', 'lin8ContactReady', 'lin8RelationshipConfirmed', 'lin8Stay', 'lin8PrivateEvening', 'lin8SampleChecked', 'lin9Outcome', 'lin9HelpChoice', 'lin9WetItems', 'lin9WetOriginals', 'lin9BriefingAttended', 'lin9HandoffKept', 'lin9NightInventoryDone', 'lin9StationMet', 'lin9HeldHands', 'lin9PriorResponseGiven', 'lin9UnapprovedMaterialsUsed', 'lin9UnbudgetedReprintOrdered', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'layoutReady', 'finalLayoutConfirmed', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'lin8LettersPrivate', 'luMoveDate', 'luDeparturePlan', 'pendingLuConversation'];

test('All 288 final-chapter combinations across 24 histories cover every dialogue and preserve actual earlier facts', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  assert.deepEqual(new Set(contexts.map(s => s.flags.lin9Outcome)), new Set(['steady', 'rebuilding', 'apart']));
  for (const before of contexts) for (let repair = 0; repair < 2; repair++) for (let future = 0; future < 2; future++) for (let tribute = 0; tribute < 3; tribute++) for (let role = 0; role < 2; role++) for (let friend = 0; friend < 2; friend++) for (let contact = 0; contact < 3; contact++) for (let final = 0; final < 2; final++) {
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [repair, future, tribute, role, friend, contact, final], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, old = before.flags;
    const ready = old.lin9Outcome !== 'apart' || repair === 0;
    const eligible = ready && future === 0 && contact !== 2;
    const outcome = final === 1 || !eligible ? 'farewell' : old.lin9Outcome === 'steady' && contact === 0 ? 'he' : 'ne';
    const status = outcome === 'farewell' ? 'ended' : outcome === 'he' || old.lin9Outcome === 'steady' ? 'girlfriends' : 'tryingDates';
    assert.equal(s.ending, 'lin_' + outcome); assert.equal(f.lin10Outcome, outcome); assert.equal(s.choices.length, 57);
    assert.equal(f.relationshipStatus, status); assert.equal(f.lin10PriorReady, ready);
    assert.equal(f.lin10RepairResponseGiven, repair === 0);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && repair === 1);
    assert.equal(f.lin10OldRepairKept, repair === 1 ? false : old.pendingOmittedConversation ? true : undefined);
    assert.equal(f.lin10FutureAligned, future === 0); assert.equal(f.lin10ContactAgreed, eligible);
    assert.equal(f.lin10ContactPlan, eligible ? ['regularWithConfirmation', 'twoWeekReview'][contact] : 'notAgreed');
    assert.equal(f.lin10ContactActive, outcome !== 'farewell'); assert.equal(f.lin10MutualContinue, outcome !== 'farewell');
    assert.equal(f.lin10TributePublic, tribute !== 2); assert.equal(f.lin10LuReply, ['miss', 'future'][friend]);
    for (const flag of ['lin10WindowChecked', 'lin10DamagedLettersExcluded', 'lin10LuBoxCarried', 'lin10TributeConfirmed', 'lin10PrivateLettersKept', 'lin10EventRoleKept', 'lin10ExhibitCompleted', 'lin10OwnerRestRespected', 'lin10ArchiveHandled', 'lin10PackingCompleted', 'lin10AuthorInstructionsKept', 'lin10LuDinnerKept', 'lin10LuSendoffKept', 'lin10OriginalStoreClosed', 'lin10KeysReturned', 'lin10DepartureMeetingKept', 'linRouteCompleted', 'lin10AutumnReached', 'lin10InternshipCompleted', 'lin10ShenEmployed']) assert.equal(f[flag], true, flag);
    assert.equal(f.lin10UnapprovedReprint, false);
    for (const [flag, date] of Object.entries({ lin10LuBoxDate: '6-25 19:00', lin10TalkBooked: '6-26 15:00', lin10ExhibitDate: '6-27 afternoon', lin10ExhibitFinishedAt: '6-27 17:00', lin10LuEntranceChecked: '6-28 evening', lin10LuDepartureConfirmed: '6-29 09:20 / 07:50 leave', lin10LuTrainDeparted: '6-29 09:20', lin10DepartureMeetingBooked: '6-30 15:15', lin10DepartureScheduled: '6-30 16:20', lin10LinTrainDeparted: '6-30 16:20', lin10InternshipPlan: '7-01 report / six weeks' })) assert.equal(f[flag], date, flag);
    for (const flag of preserved) assert.equal(f[flag], old[flag], flag);
    assert.equal(visited.has('l10_final_choice_0'), eligible); assert.equal(visited.has('l10_final_guard_0'), !eligible);
    assert.equal(visited.has('l10_ne_couple_0'), outcome === 'ne' && old.lin9Outcome === 'steady');
    assert.equal(visited.has('l10_ne_start_0'), outcome === 'ne' && old.lin9Outcome !== 'steady');
    assert.equal(engine.nextChapterNode(story, s), null); assert.strictEqual(engine.continueChapter(story, s), s);
    assert.equal(story.endings[s.ending].kind, 'final'); endings.add(s.ending); paths++;
  }
  assert.equal(paths, 6912); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 10 && !node.redirectBy) assert.ok(seen.has(id), 'Unvisited dialogue: ' + id);
});

test('Released ninth-chapter saves continue into ten with their original decisions, facts and dialogue intact', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 9)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !['lin_he', 'lin_ne', 'lin_farewell'].includes(id))) };
  legacy.nodes.lin_nine_complete = { chapter: 9, resolve: true };
  for (const old of contexts) {
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.strictEqual(engine.advance(story, old), old); assert.equal(engine.nextChapterNode(story, old), 'l10_start_0');
    const next = engine.continueChapter(story, old);
    assert.equal(next.node, 'l10_start_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.choices, old.choices); assert.deepEqual(next.history, old.history);
  }
});

test('Every representative checkpoint restores across nine boundaries; completing the route requires reading the autumn epilogue', () => {
  const steady = contexts.find(s => s.flags.lin9Outcome === 'steady');
  const rebuilding = contexts.find(s => s.flags.lin9Outcome === 'rebuilding');
  const apart = contexts.find(s => s.flags.lin9Outcome === 'apart');
  const cases = [[steady, [0, 0, 0, 0, 0, 0, 0]], [steady, [1, 0, 2, 1, 1, 1, 0]], [rebuilding, [0, 0, 1, 1, 0, 0, 0]], [apart, [1, 0, 2, 0, 1, 0, 0]], [steady, [0, 1, 0, 1, 0, 0, 0]], [steady, [0, 0, 1, 0, 0, 0, 1]]];
  for (const [before, ds] of cases) finish(engine.continueChapter(story, before), ds, state => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    if (state.node !== 'lin_ten_complete') { assert.equal(state.ending, null); assert.equal(state.flags.linRouteCompleted, undefined); assert.equal(state.flags.lin10AutumnReached, undefined); }
    if (state.node.startsWith('l10_event_')) assert.equal(state.flags.lin10ExhibitCompleted, undefined);
    if (state.node.startsWith('l10_lights_')) assert.equal(state.flags.lin10KeysReturned, undefined);
    if (state.node.startsWith('l10_lu_goodbye_')) assert.equal(state.flags.lin10LuSendoffKept, undefined);
  });
});

test('A private relationship without overnight intimacy, public tribute or a particular event role can still reach HE', () => {
  const stays = new Set();
  for (let evening = 0; evening < 3; evening++) {
    const before = boundary(0, 0, 0, evening); assert.equal(before.flags.lin9Outcome, 'steady'); stays.add(before.flags.lin8Stay);
    for (let tribute = 0; tribute < 3; tribute++) for (let role = 0; role < 2; role++) {
      const s = finish(engine.continueChapter(story, before), [1, 0, tribute, role, 1, 0, 0]);
      assert.equal(s.ending, 'lin_he'); assert.equal(s.flags.lin8Stay, before.flags.lin8Stay);
      assert.equal(s.flags.lin10TributePublic, tribute !== 2); assert.equal(s.flags.lin10PrivateLettersKept, true);
      for (const flag of ['privateLetterPublic', 'cameraScope', 'privateClipRecorded', 'videoPlaybackApproved']) assert.equal(s.flags[flag], before.flags[flag]);
    }
  }
  assert.deepEqual(stays, new Set([true, false]));
});

test('A final request cannot erase unfinished disagreements; either person can end the relationship despite completed work', () => {
  const apart = contexts.find(s => s.flags.lin9Outcome === 'apart' && s.flags.pendingOmittedConversation);
  assert.ok(apart);
  const held = finish(engine.continueChapter(story, apart), [1, 0, 2, 0, 0, 0, 0]);
  assert.equal(held.ending, 'lin_farewell'); assert.equal(held.flags.lin10ContactAgreed, false); assert.equal(held.flags.pendingOmittedConversation, true);
  assert.ok(held.history.some(h => h.speaker === '林晚' && h.text.startsWith('现在不愿意')));
  const repaired = finish(engine.continueChapter(story, apart), [0, 0, 2, 0, 0, 0, 0]);
  assert.equal(repaired.ending, 'lin_ne'); assert.equal(repaired.flags.relationshipStatus, 'tryingDates'); assert.equal(repaired.flags.pendingOmittedConversation, false);
  assert.equal(repaired.flags.lin9Outcome, 'apart');
  const steady = contexts.find(s => s.flags.lin9Outcome === 'steady');
  for (const ds of [[0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 1]]) {
    const s = finish(engine.continueChapter(story, steady), ds); assert.equal(s.ending, 'lin_farewell'); assert.equal(s.flags.relationshipStatus, 'ended'); assert.equal(s.flags.lin10ExhibitCompleted, true);
  }
});

test('Forged final endings, facts or permissions fail recovery; rewinding drops all later relationship and completion state', () => {
  const before = contexts.find(s => s.flags.lin9Outcome === 'steady');
  const s = finish(engine.continueChapter(story, before), [0, 0, 0, 0, 0, 0, 0]);
  for (const changes of [{ lin10Outcome: 'farewell' }, { lin10ContactAgreed: false }, { linRouteCompleted: false }, { lin10TributePublic: false }, { lin10KeysReturned: false }, { plannedCopies: 1000 }, { privateLetterPublic: true }, { selectedRoute: 'xu' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...s, ending: 'lin_ne' }), null);
  assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, 56) }), null);
  assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const old = engine.rewind(story, s, story.routeReviewNode);
  assert.equal(old.node, 'c4_choose_priority_0'); assert.equal(old.choices.length, 16);
  for (const flag of ['lin10Outcome', 'linRouteCompleted', 'lin10ContactPlan', 'lin10LuTrainDeparted', 'lin10KeysReturned', 'lin10AutumnReached', 'lin9Outcome', 'lin8Stay', 'selectedRoute', 'relationshipStatus']) assert.equal(old.flags[flag], undefined);
  assert.deepEqual(engine.restore(story, old), old);
});
