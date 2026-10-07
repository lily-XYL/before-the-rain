const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const { people } = require('../chapter-six.js');
const ids = [...people.map(p => p.id), 'self'];
const limit = Object.keys(story.nodes).length * 2;
function finish(state, decisions, visit = () => {}) {
  let decision = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, 'Chapter must terminate.'); visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[decision++] : undefined);
  }
  visit(state); assert.equal(decision, decisions.length); return state;
}
function boundary(focus, invitation, omitted) {
  const handling = focus === 4 ? 2 : (invitation + omitted) % 2;
  const friend = (focus + invitation) % 3, repair = (focus + invitation + omitted) % 3;
  const choices = [
    [omitted % 3, invitation % 3, handling],
    [friend % 2, focus % 4, omitted % 3, handling % 2, omitted % 2, friend],
    [friend % 2, friend, omitted, handling % 2, focus % 2, handling],
    [friend % 2, focus % 4, omitted % 3, handling, friend % 2, friend, omitted],
    [0, 0, (focus + omitted) % 3, 0, repair, 1, invitation]
  ];
  let s = engine.create(story);
  for (const d of choices) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, d); }
  return s;
}
const boundaries = Array.from({ length: 5 }, (_, focus) => Array.from({ length: 5 }, (_, invitation) => Array.from({ length: 4 }, (_, omitted) => boundary(focus, invitation, omitted))));

test('All 40 sixth-chapter combinations across 100 histories reach all five directions and every visible scene', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (let focus = 0; focus < 5; focus++) for (let invitation = 0; invitation < 5; invitation++) for (let omitted = 0; omitted < 4; omitted++) {
    const before = boundaries[focus][invitation][omitted];
    for (let friend = 0; friend < 2; friend++) for (let repair = 0; repair < 2; repair++) for (let route = 0; route < 5; route++) for (let intent = 0; intent < 2; intent++) {
      const visited = new Set();
      const state = finish(engine.continueChapter(story, before), [friend, repair, route, intent], s => { seen.add(s.node); visited.add(s.node); });
      const f = state.flags, old = before.flags;
      assert.equal(state.ending, 'c6_' + ids[route]); assert.equal(state.choices.length, 33);
      assert.equal(f.selectedRoute, ids[route]); assert.equal(f.routeFocusReady, route < 4 && route === focus);
      assert.equal(f.routeLocked, true); assert.equal(f.romanceRouteLocked, route < 4);
      assert.equal(f.priorInvitationReleased, invitation < 4 && invitation !== route);
      assert.equal(f.scheduleChanged, invitation !== route); assert.equal(f.sixthInvitationConfirmed, route < 4);
      assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && repair === 1);
      assert.equal(f.pendingLuConversation, old.pendingLuConversation && friend === 1);
      const pending = f.pendingOmittedConversation && omitted === route;
      const expected = route === 4 ? 'notDating' : pending ? 'needsConversation' : intent === 0 && route === focus ? 'tryingDates' : 'gettingToKnow';
      assert.equal(f.relationshipStatus, expected);
      assert.equal(visited.has('c6_schedule_' + ids[invitation] + '_' + ids[route] + '_0'), true);
      assert.equal(f.sixthRepairTalkTime, pending && route < 4 ? '6-19 12:00' : undefined);
      assert.equal(f.nextPrivateMeeting !== undefined, route < 4 && !pending);
      assert.equal(f.sixthFriendTalkTime, old.pendingLuConversation && friend === 1 ? '6-19 20:00' : undefined);
      for (const p of people) {
        assert.equal(visited.has('c6_afternoon_' + p.id + '_0'), p.id === ids[route]);
        assert.equal(visited.has('c6_cautious_' + p.id + '_0'), pending && p.id === ids[route]);
        assert.equal(visited.has('c6_repair_' + p.id + '_0'), repair === 0 && old.pendingOmittedConversation && p.id === ids[omitted]);
      }
      // A new conversation does not rewrite what happened on earlier dates.
      for (const name of ['L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'keptPromise', 'priorityCompleted', 'rebookKept', 'repairAgreement', 'repairActionKept', 'nextInvitation', 'invitationAccepted', 'meetingTone', 'letterScope', 'cameraScope', 'privateLetterPublic', 'videoPlaybackApproved', 'privateClipRecorded', 'withdrawnSubmission', 'plannedCost', 'plannedCopies', 'budgetReserve', 'layoutReady', 'finalLayoutConfirmed', 'finalProofDeadline', 'printHandoffDate', 'luMoveDate', 'luDeparturePlan']) assert.equal(f[name], old[name], name);
      if (repair === 0 && old.pendingOmittedConversation) {
        assert.equal(f.sixthRepairActionKept, true); assert.equal(f.repairStarted, true); assert.equal(f.omittedContribution, 'confirmedPartOnly');
        assert.equal(f.repairActionKept, false);
      } else assert.equal(f.omittedContribution, old.omittedContribution);
      if (route === 0) assert.equal(engine.continueChapter(story, state).node, 'l7_morning_0');
      else if (route === 1) assert.equal(engine.continueChapter(story, state).node, 'x7_morning_0');
      else if (route === 2) assert.equal(engine.continueChapter(story, state).node, 'z7_morning_0');
      else if (route === 3) assert.equal(engine.continueChapter(story, state).node, 'y7_morning_0');
      else assert.equal(engine.continueChapter(story, state).node, 's7_morning_0');
      endings.add(state.ending); paths++;
    }
  }
  assert.equal(paths, 4000); assert.equal(endings.size, 5);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 6 && !node.redirectBy) assert.ok(seen.has(id), 'Unreachable sixth-chapter dialogue: ' + id);
});

test('Every sixth-chapter checkpoint restores across five chapter boundaries', () => {
  for (let route = 0; route < 5; route++) for (let intent = 0; intent < 2; intent++) {
    const before = boundaries[route][(route + intent) % 5][route % 4];
    finish(engine.continueChapter(story, before), [intent, intent, route, intent], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('Released fifth-chapter endings restore unchanged and explicitly continue into chapter six', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, n]) => n.chapter <= 5)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('c6_'))) };
  legacy.nodes.chapter_five_complete = { chapter: 5, resolve: true };
  for (const focuses of boundaries) for (const invitations of focuses) for (const before of invitations) {
    assert.deepEqual(engine.restore(legacy, before), before);
    assert.deepEqual(engine.restore(story, before), before);
    assert.strictEqual(engine.advance(story, before), before);
    const next = engine.continueChapter(story, before);
    assert.equal(next.node, 'c6_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, before.flags); assert.deepEqual(next.choices, before.choices); assert.deepEqual(next.history, before.history);
  }
});

function selector(before) {
  let state = engine.continueChapter(story, before), choice = 0;
  while (!(story.nodes[state.node].routeSelector && story.nodes[state.node].choices)) state = engine.advance(story, state, story.nodes[state.node].choices ? [1, 1][choice++] : undefined);
  return state;
}
test('Review replays only the existing prefix; unvisited scenes, future nodes and forged states are rejected', () => {
  for (let focus = 0; focus < 5; focus++) {
    const current = selector(boundaries[focus][4][focus % 4]);
    const copy = JSON.stringify(current), earlier = engine.rewind(story, current, story.routeReviewNode);
    assert.equal(JSON.stringify(current), copy);
    assert.equal(earlier.node, 'c4_choose_priority_0'); assert.equal(earlier.choices.length, 16);
    assert.deepEqual(earlier.choices, current.choices.slice(0, 16));
    assert.deepEqual(earlier.history, current.history.slice(0, earlier.history.length));
    assert.deepEqual(engine.restore(story, earlier), earlier);
    for (const name of ['selectedRoute', 'priorityInvite', 'workflow', 'nextInvitation', 'sixthFriendChoice', 'sixthRepairChoice', 'relationshipStatus']) assert.equal(earlier.flags[name], undefined, name);
    for (const target of ['missing', 'chapter_six_complete', 'c6_afternoon_lin_0']) assert.equal(engine.rewind(story, current, target), null);
    assert.equal(engine.rewind(story, { ...current, flags: { ...current.flags, selectedRoute: 'lin' } }, story.routeReviewNode), null);
    assert.equal(engine.rewind(story, engine.create(story), story.routeReviewNode), null);
    assert.deepEqual(engine.restore(story, JSON.parse(copy)), current);
  }
});

test('Replaying from the review point can change the actual focus event and its dating response', () => {
  const current = selector(boundaries[4][4][0]);
  for (let route = 0; route < 4; route++) {
    let s = engine.rewind(story, current, story.routeReviewNode);
    s = finish(s, [route, 0, 0, 0, 0, route]);
    s = finish(engine.continueChapter(story, s), [0, 0, 0, 0, 0, 0, route]);
    s = finish(engine.continueChapter(story, s), [0, 0, route, 0]);
    assert.equal(s.flags[people[route].flag], true); assert.equal(s.flags.relationshipStatus, 'tryingDates');
    assert.deepEqual(engine.restore(story, s), s);
  }
  assert.equal(current.flags.priorityCompleted, false); // Original bookmark remains unchanged.
});

test('Romantic progress cannot erase pending friendship, missed promises or incomplete work; tampering is rejected', () => {
  const before = boundaries[4][1][0];
  const state = finish(engine.continueChapter(story, before), [1, 1, 0, 0]);
  assert.equal(state.flags.keptPromise, false);
  assert.equal(state.flags.pendingLuConversation, true);
  assert.equal(state.flags.pendingOmittedConversation, true);
  assert.equal(state.flags.relationshipStatus, 'needsConversation');
  assert.strictEqual(engine.advance(story, state), state);
  for (const change of [{ relationshipStatus: 'tryingDates' }, { routeFocusReady: true }, { pendingLuConversation: false }, { pendingOmittedConversation: false }, { selectedRoute: 'xu' }, { priorInvitationReleased: false }, { L_present: true }]) assert.equal(engine.restore(story, { ...state, flags: { ...state.flags, ...change } }), null);
  assert.equal(engine.restore(story, { ...state, ending: 'c6_xu' }), null);
  assert.deepEqual(engine.restore(story, { ...state, history: [] }), state);
});
