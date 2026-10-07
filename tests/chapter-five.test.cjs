const { test } = require('node:test');
const assert = require('node:assert/strict');
const story = require('../story.js');
const engine = require('../engine.js');
const { people } = require('../chapter-five.js');
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
function fourthBoundary(message, priority, handling, friend) {
  let state = finish(engine.create(story), [message % 3, priority % 3, handling]);
  state = finish(engine.continueChapter(story, state), [friend % 2, priority, message % 3, handling % 2, message % 2, friend]);
  state = finish(engine.continueChapter(story, state), [friend % 2, friend, message, handling % 2, priority % 2, handling]);
  return finish(engine.continueChapter(story, state), [friend % 2, priority, (message + handling) % 3, handling, friend % 2, friend, message]);
}
const boundaries = Array.from({ length: 4 }, (_, message) => Array.from({ length: 4 }, (_, priority) => Array.from({ length: 3 }, (_, handling) => Array.from({ length: 3 }, (_, friend) => fourthBoundary(message, priority, handling, friend)))));

test('All 1,080 fifth-chapter combinations complete for each of the four omitted partners', () => {
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (let message = 0; message < 4; message++) {
    let serial = 0;
    for (let budget = 0; budget < 3; budget++) for (let reading = 0; reading < 2; reading++) for (let work = 0; work < 3; work++) for (let owner = 0; owner < 2; owner++) for (let repair = 0; repair < 3; repair++) for (let lu = 0; lu < 2; lu++) for (let invitation = 0; invitation < 5; invitation++) {
      const priority = (serial + message) % 4, handling = Math.floor(serial / 4) % 3, friend = Math.floor(serial++ / 12) % 3;
      const boundary = boundaries[message][priority][handling][friend];
      const route = new Set();
      const state = finish(engine.continueChapter(story, boundary), [budget, reading, work, owner, repair, lu, invitation], s => { seen.add(s.node); route.add(s.node); });
      const f = state.flags;
      assert.equal(state.choices.length, 29); assert.equal(state.ending, 'c5_' + ['collective', 'solo', 'smaller'][work]);
      assert.equal(f.budgetView, ['numbers', 'voices', 'schedule'][budget]); assert.equal(f.readingMode, ['openEnds', 'questions'][reading]);
      assert.equal(f.omittedPerson, people[message].id); assert.equal(f.misquotedConsensus, true);
      assert.equal(f.reminderPerson, people[priority === message ? (message + 1) % 4 : priority].id);
      assert.notEqual(f.omittedPerson, f.reminderPerson);
      assert.equal(f.publicConsensusCorrected, true); assert.equal(f.unapprovedPlanExecuted, false);
      assert.equal(f.groupFormConfirmed, true); assert.equal(f.plannedPages, 24);
      assert.equal(f.plannedCopies, work === 2 ? 40 : 60); assert.equal(f.plannedCost, work === 2 ? 860 : 1080);
      assert.ok(f.plannedCost <= f.budgetAvailable); assert.equal(f.budgetGap, 600);
      assert.equal(f.budgetReserve, work === 2 ? 220 : undefined);
      assert.equal(f.layoutReady, work !== 1); assert.equal(f.finalLayoutConfirmed, work !== 1);
      assert.equal(f.deadlineRenegotiated, work === 1); assert.equal(f.finalProofDeadline, work === 1 ? '6-19 10:00' : undefined);
      assert.equal(f.printHandoffDate, '6-20'); assert.equal(f.unansweredLettersRetained, true); assert.equal(f.blankPageReserved, true);
      assert.equal(f.ownerClosureRespected, true); assert.equal(f.ownerRestPlanned, true); assert.equal(f.ownerClosedOnTime, true);
      assert.equal(f.ownerChoice, ['rest', 'future'][owner]);
      assert.equal(f.repairAgreement, ['revise', 'limited', 'defer'][repair]); assert.equal(f.repairStarted, repair !== 2);
      assert.equal(f.repairActionKept, repair !== 2); assert.equal(f.pendingOmittedConversation, repair === 2);
      assert.equal(f.omittedContribution, ['confirmedPartOnly', 'limitedPartOnly', 'withheld'][repair]);
      assert.equal(f.repairDeadline, repair === 2 ? undefined : '6-17 11:00');
      assert.equal(f.luNextCallKept, friend === 1 ? true : undefined);
      assert.equal(f.luConversationContinued, lu === 0);
      assert.equal(f.pendingLuConversation, lu === 0 ? false : boundary.flags.pendingLuConversation);
      assert.equal(f.luVideoChecked, lu === 0 ? true : boundary.flags.luVideoChecked);
      assert.equal(f.friendshipRepair, lu === 0 ? 'continued' : boundary.flags.friendshipRepair);
      assert.equal(f.nextInvitation, invitation === 4 ? 'self' : people[invitation].id);
      assert.equal(f.invitationAccepted, invitation !== 4); assert.equal(f.romanceRouteLocked, false);
      assert.equal(f.selfTimePlanned, invitation === 4 ? true : undefined);
      assert.equal(f.nextMeetingTime, invitation === 4 ? undefined : '6-18 16:00');
      assert.equal(f.meetingTone, invitation === 4 ? undefined : repair === 2 && invitation === message ? 'cautious' : 'open');
      for (const flag of ['letterScope', 'letterRecipientPrivate', 'privateClipRecorded', 'cameraScope', 'withdrawnSubmission', 'keptPromise', 'priorityCompleted', 'rebookKept', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'luMoveDate', 'luDeparturePlan']) assert.equal(f[flag], boundary.flags[flag], flag);
      assert.equal(f.privateLetterPublic, false); assert.equal(f.videoPlaybackApproved, false); assert.equal(f.authorProofReconfirmed, true);
      for (const person of people) {
        const has = prefix => route.has(prefix + person.id + '_0');
        assert.equal(has('c5_apology_'), person.id === people[message].id);
        assert.equal(has('c5_invite_cautious_'), repair === 2 && invitation === message && person.id === people[invitation].id);
        assert.equal(has('c5_invite_'), invitation < 4 && person.id === people[invitation].id && !(repair === 2 && invitation === message));
      }
      endings.add(state.ending); paths++;
    }
  }
  assert.equal(paths, 4320); assert.equal(endings.size, 3);
  for (const [id, node] of Object.entries(story.nodes)) if (node.chapter === 5 && !node.redirectBy) assert.ok(seen.has(id), 'Unreachable fifth-chapter dialogue: ' + id);
});

test('Every fifth-chapter checkpoint restores across all four earlier boundaries', () => {
  for (let message = 0; message < 4; message++) for (let work = 0; work < 3; work++) {
    const boundary = boundaries[message][(message + work) % 4][work][work];
    finish(engine.continueChapter(story, boundary), [work, message % 2, work, work % 2, work, (message + work) % 2, (message + work) % 5], state => {
      assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(state))), state, state.node);
    });
  }
});

test('Released fourth-chapter boundaries remain readable and explicitly continue without rewriting their history', () => {
  const legacy = { ...story, nodes: Object.fromEntries(Object.entries(story.nodes).filter(([, node]) => node.chapter <= 4)), endings: Object.fromEntries(Object.entries(story.endings).filter(([id]) => !id.startsWith('c5_'))) };
  legacy.nodes.chapter_four_complete = { chapter: 4, resolve: true };
  for (const group of boundaries) for (const priorities of group) for (const modes of priorities) for (const boundary of modes) {
    assert.deepEqual(engine.restore(legacy, boundary), boundary);
    const restored = engine.restore(story, JSON.parse(JSON.stringify(boundary)));
    assert.deepEqual(restored, boundary);
    const next = engine.continueChapter(story, restored);
    assert.equal(next.node, 'c5_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, boundary.flags); assert.deepEqual(next.history, boundary.history); assert.deepEqual(next.choices, boundary.choices);
  }
});

test('A private invitation never clears an unfinished apology or changes another friendship state', () => {
  for (let message = 0; message < 4; message++) for (let invitation = 0; invitation < 5; invitation++) {
    const state = finish(engine.continueChapter(story, boundaries[message][message][2][2]), [0, 0, 0, 0, 2, 1, invitation]);
    assert.equal(state.flags.pendingOmittedConversation, true); assert.equal(state.flags.repairStarted, false);
    assert.equal(state.flags.pendingLuConversation, true); assert.equal(state.flags.keptPromise, false);
    assert.equal(state.flags.omittedContribution, 'withheld'); assert.equal(state.flags.romanceRouteLocked, false);
    if (invitation === message) assert.equal(state.flags.meetingTone, 'cautious');
  }
});

test('The fifth chapter waits for explicit continuation; forged completion, money, permissions and invitations are rejected', () => {
  const state = finish(engine.continueChapter(story, boundaries[3][0][2][2]), [2, 1, 1, 1, 2, 1, 4]);
  assert.strictEqual(engine.advance(story, state), state);
  const next = engine.continueChapter(story, state);
  assert.equal(next.node, 'c6_morning_0'); assert.equal(next.ending, null);
  assert.deepEqual(next.flags, state.flags); assert.deepEqual(next.history, state.history); assert.deepEqual(next.choices, state.choices);
  for (const changes of [
    { layoutReady: true }, { repairActionKept: true }, { pendingOmittedConversation: false },
    { plannedCost: 0 }, { privateLetterPublic: true }, { cameraScope: 'public' },
    { nextInvitation: 'lin' }, { invitationAccepted: true }, { pendingLuConversation: false },
    { omittedPerson: 'lin' }, { groupFormConfirmed: false }, { finalProofDeadline: '6-17 17:00' }
  ]) assert.equal(engine.restore(story, { ...state, flags: { ...state.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...state, ending: 'c5_collective' }), null);
  assert.deepEqual(engine.restore(story, { ...state, history: [{ speaker: 'invented', text: 'invented' }] }), state);
});
