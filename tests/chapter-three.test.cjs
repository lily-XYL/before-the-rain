const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const { activities } = require('../chapter-two.js');
const { people } = require('../chapter-three.js');
const pairs = ['lin_xu','lin_zhou','lin_ye','xu_zhou','xu_ye','ye_zhou'];
const limit = Object.keys(story.nodes).length * 2;

function finish(state, decisions, visit = () => {}) {
  let choice = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps < limit, 'The chapter must terminate.');
    visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[choice++] : undefined);
  }
  visit(state); assert.equal(choice, decisions.length); return state;
}
function previousBoundary(selected, follow, variant = 0) {
  const first = finish(engine.create(story), [variant % 3, variant % 3, variant % 3]);
  const firstIndex = activities.findIndex(a => a.id === selected.split('_')[0]);
  const remaining = activities.filter(a => a.id !== activities[firstIndex].id);
  const secondIndex = remaining.findIndex(a => a.id === selected.split('_')[1]);
  return finish(engine.continueChapter(story, first), [variant % 2, firstIndex, secondIndex, variant % 2, (variant + 1) % 2, follow]);
}

test('Third-chapter decisions complete for every activity pair and previous follow-up plan', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (const selected of pairs) for (let follow = 0; follow < 3; follow++) {
    const boundary = previousBoundary(selected, follow, follow);
    const missing = people.filter(p => !selected.split('_').includes(p.id));
    for (let read = 0; read < 2; read++) for (let camera = 0; camera < 3; camera++) for (let confidant = 0; confidant < 4; confidant++) for (let reply = 0; reply < 2; reply++) for (let reliability = 0; reliability < 2; reliability++) for (let work = 0; work < 3; work++) {
      const state = finish(engine.continueChapter(story, boundary), [read, camera, confidant, reply, reliability, work], s => seen.add(s.node));
      assert.equal(state.ending, 'c3_' + people[confidant].id);
      assert.equal(state.choices.length, 15);
      assert.equal(state.flags.activityPair, boundary.flags.activityPair);
      assert.equal(state.flags.filmingConsent, boundary.flags.filmingConsent);
      assert.equal(state.flags.pendingLetter, false); assert.equal(state.flags.letterRead, true);
      assert.equal(state.flags.privateLetterPublic, false);
      assert.equal(state.flags.cameraScope, ['none','private','discuss'][camera]);
      assert.equal(state.flags.privateClipRecorded, camera === 1);
      assert.equal(state.flags.publicLetterProofConfirmed, true);
      assert.equal(state.flags.letterScope, boundary.flags.letterScope);
      assert.equal(state.flags.withdrawnSubmission, 'returnedWithoutCopy');
      assert.equal(state.flags.firstProofDeadline, state.flags.trialDeadline);
      assert.equal(state.flags.deadlineConflict, true);
      if (follow === 0) {
        assert.equal(state.flags.rebookFirstKept, true); assert.equal(state.flags.rebookSecondKept, true);
        assert.equal(state.flags.rebookFirstPerson, missing[0].id); assert.equal(state.flags.rebookSecondPerson, missing[1].id);
        assert.equal(state.flags.materialsMeetingKept, undefined);
      } else if (follow === 1) {
        assert.equal(state.flags.materialsMeetingKept, true);
        assert.equal(state.flags.rebookFirstKept, undefined); assert.equal(state.flags.rebookSecondKept, undefined);
      } else {
        assert.equal(state.flags.noExtraTimeRespected, true);
        assert.equal(state.flags.rebookFirstKept, undefined); assert.equal(state.flags.materialsMeetingKept, undefined);
      }
      for (const p of people) {
        const text = story.nodes['c3_talk_' + p.id + '_0'].text;
        assert.equal(state.history.some(h => h.text === text), p.id === people[confidant].id);
      }
      endings.add(state.ending); paths++;
    }
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 4);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 3 && !node.redirectBy) assert.ok(seen.has(id), 'Unreachable dialogue: ' + id);
});

test('Every third-chapter checkpoint restores across two previous chapter boundaries', () => {
  for (let route = 0; route < 4; route++) for (let follow = 0; follow < 3; follow++) {
    const boundary = previousBoundary(pairs[(route + follow) % pairs.length], follow, route + follow);
    finish(engine.continueChapter(story, boundary), [route % 2, follow, route, follow % 2, route % 2, follow], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('All previous second-chapter boundary saves can resume without changing their flags or history', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, n]) => n.chapter <= 2)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('c3_'))) };
  legacy.nodes.chapter_two_complete = { chapter: 2, resolve: true };
  for (const selected of pairs) for (let follow = 0; follow < 3; follow++) {
    const raw = previousBoundary(selected, follow, follow);
    // The old release ends here; the same state contains no third-chapter flags.
    assert.deepEqual(engine.restore(legacy, raw), raw);
    const restored = engine.restore(story, JSON.parse(JSON.stringify(raw)));
    assert.deepEqual(restored, raw);
    const continued = engine.continueChapter(story, restored);
    assert.equal(continued.node, 'c3_arrival_0'); assert.equal(continued.ending, null);
    assert.deepEqual(continued.flags, raw.flags); assert.deepEqual(continued.history, raw.history);
  }
});

test('A private recording is never required to choose any of the four confidants', () => {
  const boundary = previousBoundary('lin_xu', 2, 1);
  for (const camera of [0, 2]) for (let route = 0; route < 4; route++) {
    const state = finish(engine.continueChapter(story, boundary), [0, camera, route, 0, 0, 0]);
    assert.equal(state.ending, 'c3_' + people[route].id);
    assert.equal(state.flags.privateClipRecorded, false);
    assert.equal(state.flags.privateLetterPublic, false);
  }
});

test('The third boundary explicitly continues, edited permission and appointment flags are rejected, and history is reconstructed', () => {
  const state = finish(engine.continueChapter(story, previousBoundary('lin_ye', 0)), [1, 1, 3, 1, 1, 2]);
  assert.strictEqual(engine.advance(story, state), state);
  const next = engine.continueChapter(story, state);
  assert.equal(next.node, 'c4_graduation_0'); assert.equal(next.ending, null);
  assert.deepEqual(next.flags, state.flags);
  for (const flags of [
    { ...state.flags, cameraScope: 'public' },
    { ...state.flags, privateLetterPublic: true },
    { ...state.flags, rebookSecondPerson: 'lin' },
    { ...state.flags, trialDeadline: '6-13 18:00' }
  ]) assert.equal(engine.restore(story, { ...state, flags }), null);
  assert.deepEqual(engine.restore(story, { ...state, history: [{ speaker: 'invented', text: 'invented' }] }), state);
});
