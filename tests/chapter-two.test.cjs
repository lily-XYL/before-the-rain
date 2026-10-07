const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const activities = require('../chapter-two.js').activities;
const limit = Object.keys(story.nodes).length * 2;

function chapterOne(decisions) {
  let state = engine.create(story), index = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[index++] : undefined);
  }
  return state;
}
function chapterTwo(boundary, decisions, visit = () => {}) {
  let state = engine.continueChapter(story, boundary), index = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, 'Chapter two must terminate.');
    visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[index++] : undefined);
  }
  assert.equal(index, decisions.length);
  visit(state);
  return state;
}

test('All 7,776 complete decision combinations finish with two distinct activities', () => {
  const endings = new Set(), orders = new Set(), seen = new Set();
  let paths = 0;
  for (let tea = 0; tea < 3; tea++) for (let evening = 0; evening < 3; evening++) for (let reply = 0; reply < 3; reply++) {
    const boundary = chapterOne([tea, evening, reply]);
    for (let name = 0; name < 2; name++) for (let first = 0; first < 4; first++) for (let second = 0; second < 3; second++) for (let response1 = 0; response1 < 2; response1++) for (let response2 = 0; response2 < 2; response2++) for (let follow = 0; follow < 3; follow++) {
      const state = chapterTwo(boundary, [name, first, second, response1, response2, follow], s => seen.add(s.node));
      const firstActivity = activities[first];
      const secondActivity = activities.filter(a => a.id !== firstActivity.id)[second];
      assert.equal(state.flags.activityFirst, firstActivity.id);
      assert.equal(state.flags.activitySecond, secondActivity.id);
      assert.equal(state.ending, 'c2_' + [firstActivity.id, secondActivity.id].sort().join('_'));
      assert.equal(activities.filter(a => state.flags[a.flag]).length, 2);
      assert.equal(state.choices.length, 9);
      assert.equal(state.flags.tea, boundary.flags.tea);
      assert.equal(state.flags.firstEvening, boundary.flags.firstEvening);
      assert.equal(state.flags.pendingLetter, true);
      assert.equal(state.flags.letterSignature, '郑素琴');
      assert.equal(state.flags.letterScope, 'excerptOnlyAfterProof');
      assert.equal(state.flags.followUp, ['appointments','materials','limited'][follow]);
      const responseFlags = { lin: 'bookRepair', xu: 'paperPlan', zhou: 'songFeedback', ye: 'interviewExit' };
      for (const a of activities) assert.equal(Boolean(state.flags[responseFlags[a.id]]), a.id === firstActivity.id || a.id === secondActivity.id);
      for (const a of activities) {
        const text = story.nodes['c2_absent_' + a.id + '_message_0'].text;
        assert.equal(state.history.some(h => h.text === text), a.id !== firstActivity.id && a.id !== secondActivity.id);
      }
      endings.add(state.ending); orders.add(firstActivity.id + '>' + secondActivity.id); paths++;
    }
  }
  assert.equal(paths, 7776); assert.equal(endings.size, 6); assert.equal(orders.size, 12);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 2 && !node.redirectBy) assert.ok(seen.has(id), 'Unreachable second-chapter dialogue: ' + id);
});

test('Second-chapter checkpoints restore through the previous boundary and all activity orders', () => {
  for (let first = 0; first < 4; first++) for (let second = 0; second < 3; second++) {
    const boundary = chapterOne([first % 3, first % 3, second]);
    chapterTwo(boundary, [first % 2, first, second, second % 2, (second + 1) % 2, second], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('Previously released chapter-one saves and chapter memories remain usable', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([,n]) => n.chapter === 1)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('c2_'))) };
  legacy.nodes.chapter_complete = { chapter: 1, resolve: true };
  for (let evening = 0; evening < 3; evening++) {
    let state = engine.create(legacy), decision = 0;
    while (!state.ending) {
      const restored = engine.restore(story, JSON.parse(JSON.stringify(state)));
      assert.deepEqual(restored, state);
      state = engine.advance(legacy, state, legacy.nodes[state.node].choices ? [2, evening, 1][decision++] : undefined);
    }
    const restored = engine.restore(story, state);
    assert.deepEqual(restored, state);
    const next = engine.continueChapter(story, restored);
    assert.equal(next.node, 'c2_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, state.flags); assert.deepEqual(next.history, state.history);
  }
});

test('First-chapter answers are recalled without widening filming consent', () => {
  for (let reply = 0; reply < 3; reply++) {
    const boundary = chapterOne([reply, 1, reply]);
    const finished = chapterTwo(boundary, [0, 3, 0, 0, 1, 2]);
    assert.equal(finished.flags.filmingConsent, ['internalBack','environmentOnly','discussFirst'][reply]);
    const scopeText = story.nodes['c2_ye_end_' + finished.flags.filmingConsent + '_0'].text;
    assert.ok(finished.history.some(h => h.text === scopeText));
  }
});

test('Chapter boundaries require explicit continuation; edited states are rejected', () => {
  const initial = engine.create(story);
  assert.strictEqual(engine.continueChapter(story, initial), initial);
  const boundary = chapterOne([0,0,0]);
  assert.strictEqual(engine.advance(story, boundary), boundary);
  const finished = chapterTwo(boundary, [1, 2, 1, 0, 1, 1]);
  const next = engine.continueChapter(story, finished);
  assert.equal(next.node, 'c3_arrival_0'); assert.equal(next.ending, null);
  assert.deepEqual(next.flags, finished.flags); assert.deepEqual(next.history, finished.history);
  for (const edited of [
    { ...finished, flags: { ...finished.flags, activitySecond: finished.flags.activityFirst } },
    { ...finished, choices: finished.choices.slice(0, -1) },
    { ...finished, ending: 'c2_lin_ye' },
    { ...finished, flags: { ...finished.flags, letterScope: 'fullLetter' } }
  ]) assert.equal(engine.restore(story, edited), null);
});
