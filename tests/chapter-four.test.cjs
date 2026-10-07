const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const { people } = require('../chapter-four.js');
const limit = Object.keys(story.nodes).length * 2;

function finish(state, decisions, visit = () => {}) {
  let decision = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, 'Every chapter must terminate.');
    visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[decision++] : undefined);
  }
  visit(state); assert.equal(decision, decisions.length); return state;
}
function thirdBoundary(work, conversation = 0) {
  const first = finish(engine.create(story), [conversation % 3, conversation % 3, conversation % 3]);
  const second = finish(engine.continueChapter(story, first), [conversation % 2, conversation % 4, conversation % 3, conversation % 2, (conversation + 1) % 2, conversation % 3]);
  return finish(engine.continueChapter(story, second), [conversation % 2, conversation % 3, Math.floor(conversation / 2), conversation % 2, conversation % 2, work]);
}
const boundaries = Array.from({ length: 3 }, (_, work) => Array.from({ length: 8 }, (_, conversation) => thirdBoundary(work, conversation)));

test('All 1,728 fourth-chapter combinations finish under each of the three previous workload plans', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (let work = 0; work < 3; work++) {
    let serial = 0;
    for (let deadline = 0; deadline < 2; deadline++) for (let priority = 0; priority < 4; priority++) for (let other = 0; other < 3; other++) for (let mode = 0; mode < 3; mode++) for (let reply = 0; reply < 2; reply++) for (let friend = 0; friend < 3; friend++) for (let message = 0; message < 4; message++) {
      const boundary = boundaries[work][serial++ % 8];
      const primary = people[priority], secondary = people.filter(p => p.id !== primary.id)[other];
      const state = finish(engine.continueChapter(story, boundary), [deadline, priority, other, mode, reply, friend, message], s => seen.add(s.node));
      assert.equal(state.ending, 'c4_' + primary.id); assert.equal(state.choices.length, 22);
      assert.equal(state.flags.priorityInvite, primary.id); assert.equal(state.flags.otherInvite, secondary.id);
      assert.notEqual(primary.id, secondary.id); assert.equal(state.flags.invitationPair, primary.id + '_' + secondary.id);
      assert.equal(state.flags.activeMessage, people[message].id);
      assert.equal(state.flags.invitationHandling, ['notify', 'rebook', 'rush'][mode]);
      assert.equal(state.flags.deadlinePlan, ['trialFirst', 'proofFirst'][deadline]);
      assert.equal(state.flags.workload, boundary.flags.workload);
      assert.equal(state.flags.cameraScope, boundary.flags.cameraScope); assert.equal(state.flags.letterScope, boundary.flags.letterScope);
      assert.equal(state.flags.privateLetterPublic, false); assert.equal(state.flags.privateClipRecorded, boundary.flags.privateClipRecorded);
      assert.equal(state.flags.trialSubmitted, true); assert.equal(state.flags.proofTextSubmitted, true); assert.equal(state.flags.deadlineConflict, false);
      assert.equal(state.flags.progressUpdateSent, '6-11 12:00'); assert.equal(state.flags.graduationAttended, true);
      assert.equal(state.flags.luMoveDate, '6-29 09:20'); assert.ok(state.flags.luDeparturePlan.includes('07:50'));
      assert.equal(state.flags.priorityArrived, true); assert.equal(state.flags.priorityCompleted, mode !== 2);
      assert.equal(state.flags.keptPromise, mode !== 2); assert.equal(state.flags.notified, mode !== 2);
      assert.equal(state.flags.rebooked, mode === 1); assert.equal(state.flags.rebookKept, mode === 1 ? true : undefined);
      assert.equal(state.flags.secondaryReached, mode === 0 ? undefined : true);
      assert.equal(state.flags.secondaryExpectedEventMissed, mode === 0 ? undefined : mode === 2);
      assert.equal(state.flags.luVideoPromiseMissed, true); assert.equal(state.flags.pendingLuConversation, friend === 2);
      assert.equal(state.flags.luVideoChecked, friend !== 2); assert.equal(state.flags.friendshipRepair, ['started', 'planKept', 'deferred'][friend]);
      for (const person of people) {
        assert.equal(state.flags[person.flag], person.id === primary.id && mode !== 2 ? true : undefined);
        const has = prefix => state.history.some(h => h.text === story.nodes[prefix + person.id + '_0'].text);
        assert.equal(has('c4_event_'), person.id === primary.id && mode !== 2);
        assert.equal(has('c4_short_'), person.id === primary.id && mode === 2);
        assert.equal(has('c4_rebook_'), person.id === secondary.id && mode === 1);
        assert.equal(has('c4_rush_'), person.id === secondary.id && mode === 2);
        assert.equal(has('c4_private_'), person.id === people[message].id);
      }
      endings.add(state.ending); paths++;
    }
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 4);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 4 && !node.redirectBy) assert.ok(seen.has(id), 'Unreachable fourth-chapter dialogue: ' + id);
});

test('Every checkpoint restores across all three previous boundaries for each priority and handling mode', () => {
  for (let priority = 0; priority < 4; priority++) for (let mode = 0; mode < 3; mode++) {
    const boundary = boundaries[mode][priority * 2 + mode % 2];
    finish(engine.continueChapter(story, boundary), [mode % 2, priority, (priority + mode) % 3, mode, mode % 2, mode, (priority + 1) % 4], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('Released third-chapter saves continue with their actual flags, decisions and history intact', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 3)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('c4_'))) };
  legacy.nodes.chapter_three_complete = { chapter: 3, resolve: true };
  for (const group of boundaries) for (const boundary of group) {
    assert.deepEqual(engine.restore(legacy, boundary), boundary);
    const restored = engine.restore(story, JSON.parse(JSON.stringify(boundary)));
    assert.deepEqual(restored, boundary);
    const next = engine.continueChapter(story, restored);
    assert.equal(next.node, 'c4_graduation_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, boundary.flags); assert.deepEqual(next.history, boundary.history); assert.deepEqual(next.choices, boundary.choices);
  }
});

test('A rushed film or concert never becomes a completed event through an apology or later private message', () => {
  for (const priority of [2, 3]) for (const reply of [0, 1]) for (const message of [0, 1, 2, 3]) {
    const state = finish(engine.continueChapter(story, boundaries[0][0]), [0, priority, 0, 2, reply, 2, message]);
    assert.equal(state.flags[people[priority].flag], undefined); assert.equal(state.flags.keptPromise, false);
    assert.equal(state.flags.priorityCompleted, false); assert.equal(state.flags.pendingLuConversation, true);
    assert.ok(state.history.some(h => h.text === story.nodes['c4_short_' + people[priority].id + '_0'].text));
    assert.ok(!state.history.some(h => h.text === story.nodes['c4_event_' + people[priority].id + '_0'].text));
  }
});

test('The fourth boundary explicitly continues; forged attendance, friendship and permissions fail canonical recovery', () => {
  const state = finish(engine.continueChapter(story, boundaries[2][7]), [1, 0, 2, 2, 1, 2, 1]);
  assert.strictEqual(engine.advance(story, state), state);
  const next = engine.continueChapter(story, state);
  assert.equal(next.node, 'c5_morning_0'); assert.equal(next.ending, null);
  assert.deepEqual(next.flags, state.flags);
  for (const flags of [
    { ...state.flags, keptPromise: true }, { ...state.flags, rebookKept: true },
    { ...state.flags, priorityCompleted: true }, { ...state.flags, pendingLuConversation: false },
    { ...state.flags, privateLetterPublic: true }, { ...state.flags, activeMessage: 'lin' },
    { ...state.flags, secondaryExpectedEventMissed: false }
  ]) assert.equal(engine.restore(story, { ...state, flags }), null);
  assert.equal(engine.restore(story, { ...state, ending: 'c4_ye' }), null);
  assert.deepEqual(engine.restore(story, { ...state, history: [{ speaker: 'invented', text: 'invented' }] }), state);
});
