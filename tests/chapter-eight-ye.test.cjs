const { test } = require('node:test');
const assert = require('node:assert/strict');
const { story, engine, finish, commonBoundary, seventhBoundary } = require('./ye-helpers.cjs');
const contexts = [];
for (let w = 0; w < 3; w++) for (let o = 0; o < 4; o++) contexts.push(seventhBoundary(w, o, (w === 0 && o === 1) || (w === 1 && o === 0) ? 0 : 1));
const preserved = ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'keptPromise', 'priorityCompleted', 'rebookKept', 'sixthRepairActionKept', 'sixthFriendTalkKept', 'nextPrivateMeeting', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'workflow', 'readingMode', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'withdrawnSubmission', 'luMoveDate', 'luDeparturePlan', 'equipmentRepairCompleted'];

test('All 1296 Ye eighth-chapter combinations across 12 real seven-chapter histories cover every visible line and preserve prior facts', () => {
  assert.deepEqual(new Set(contexts.map(s => s.flags.y7Outcome)), new Set(['open', 'slow', 'distance']));
  assert.deepEqual(new Set(contexts.map(s => s.flags.cameraScope)), new Set(['none', 'private', 'discuss']));
  assert.deepEqual(new Set(contexts.filter(s => s.flags.pendingOmittedConversation).map(s => s.flags.omittedPerson)), new Set(['lin', 'xu', 'zhou', 'ye']));
  const seen = new Set(), endings = new Set(); let paths = 0;
  const source = require('../chapter-eight-ye.js'), ids = [...source.scenes, ...source.gates].map(n => n.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const oldState of contexts) for (let repair = 0; repair < 2; repair++) for (let sample = 0; sample < 2; sample++) for (let topic = 0; topic < 2; topic++) for (let response = 0; response < 3; response++) for (let relation = 0; relation < 3; relation++) for (let touch = 0; touch < 3; touch++) for (let photo = 0; photo < 2; photo++) for (let night = 0; night < 3; night++) {
    const old = oldState.flags, eligible = old.y7Outcome !== 'distance' || repair === 0;
    const outcome = !eligible || relation === 2 ? 'paused' : relation === 0 ? 'together' : 'slow';
    const visited = new Set();
    const s = finish(engine.continueChapter(story, oldState), [repair, sample, topic, response, relation, touch, photo, night], at => { seen.add(at.node); visited.add(at.node); });
    const f = s.flags, partnered = outcome === 'together', active = outcome !== 'paused', stay = partnered && night === 0;
    assert.equal(s.ending, 'y8_' + outcome); endings.add(s.ending); assert.equal(s.choices.length, 47);
    assert.equal(f.y8EntryOutcome, old.y7Outcome); assert.equal(f.y8PrivateReady, eligible);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && repair === 1);
    assert.equal(f.y8OldRepairKept, old.pendingOmittedConversation && repair === 0);
    assert.equal(f.y8CurrentResponseKept, repair === 0);
    assert.equal(f.y8PrivateContactBooked, eligible); assert.equal(f.y8PrivateContactKept, eligible);
    assert.equal(f.y8OriginalContactBooked, old.y7Outcome !== 'distance');
    assert.equal(f.y8ContactKind, old.y7Outcome !== 'distance' ? 'original' : eligible ? 'new' : 'work');
    assert.equal(f.y8NextMeetingAccepted, eligible); assert.equal(f.y8PrivateMeetingKept, eligible); assert.equal(f.y8WorkMeetingKept, !eligible);
    assert.equal(f.y8MeetingKept, true); assert.equal(f.y8CameraAbsent, true); assert.equal(f.y8PersonalStoryShared, eligible); assert.equal(f.y8MotherStoryShared, eligible);
    assert.equal(f.y8AllHistoryDemanded, response === 1); assert.equal(f.y8DemandWithdrawn, eligible ? active && response === 1 : relation === 0);
    assert.equal(f.y8NeedsMutuallyHeard, active); assert.equal(f.y8Outcome, outcome);
    assert.equal(f.relationshipStatus, partnered ? 'girlfriends' : active ? old.y7Outcome === 'open' ? 'tryingDates' : 'gettingToKnow' : 'needsConversation');
    assert.equal(f.y8RelationshipConfirmed, partnered); assert.equal(f.y8ExclusiveAgreed, partnered); assert.equal(f.y8RelationshipPublic, false);
    assert.equal(f.y8Kissed, partnered && touch === 0); assert.equal(f.y8Hugged, partnered && touch === 1); assert.equal(f.y8HeldHands, outcome === 'slow' && touch === 0);
    assert.equal(f.y8JointPhotoTaken, active && photo === 0); assert.equal(f.y8JointPhotoPublic, false); assert.equal(f.y8JointPhotoInFilm, false);
    assert.equal(f.y8JointPhotoRecipient, active && photo === 0 ? 'shenAndYeOnly' : 'none');
    assert.equal(f.y8JointPhotoUse, active && photo === 0 ? 'privateKeepOnly' : 'none');
    assert.equal(f.y8HomeVisited, partnered && night < 2); assert.equal(f.y8HomeInvitationAccepted, partnered && night < 2);
    assert.equal(f.y8DinnerKept, partnered ? night < 2 : outcome === 'slow' && night === 0);
    assert.equal(f.y8StayInvitationAccepted, stay); assert.equal(f.y8StayedOvernight, stay); assert.equal(f.y8BreakfastKept, stay);
    assert.equal(f.y8FurtherIntimacyAgreed, stay && touch === 0); assert.equal(f.y8PrivateNightRecorded, false);
    assert.equal(f.y8MorningContactBooked, active); assert.equal(f.y8MorningContactKept, active);
    assert.equal(f.y8ShenSampleChecked, sample === 0); assert.equal(f.y8SamplesChecked, true); assert.equal(f.y8SampleCount, 3); assert.equal(f.y8SampleTime, '6-22 10:25-10:35');
    assert.equal(f.y8BooksReceived, true); assert.equal(f.y8DeliveredCopies, old.workflow === 'smaller' ? 40 : 60);
    assert.equal(f.y8CandidateReady, true); assert.equal(f.y8NewDrawingMade, old.y7FilmChoice === 'pending');
    assert.equal(f.y8CandidateKind, ({ empty: 'empty', drawing: 'drawing', pending: 'newDrawing' })[old.y7FilmChoice]);
    assert.equal(f.y8WorkCheckKept, true); assert.equal(f.y8ShenWorkSent, true); assert.equal(f.y8ShenWorkSentAt, '6-22 17:00');
    for (const k of ['y8PrivateClipImported', 'y8PrivateClipRecorded', 'y8PrivateEmotionUsed', 'y8PublicScreeningApproved', 'y8ShenWorkDelegated', 'y8FullMaterialsSubmitted']) assert.equal(f[k], false, k);
    assert.equal(f.y8NextWorkBooked, true); assert.equal(f.y8NextWorkTime, '6-25 10:00-10:15'); assert.equal(f.y8NextWorkKept, undefined);
    assert.equal(visited.has('y8_story_waiting_0'), eligible && topic === 0); assert.equal(visited.has('y8_story_making_0'), eligible && topic === 1);
    assert.equal(visited.has('y8_demand_corrected_0'), eligible && active && response === 1);
    assert.equal(visited.has('y8_home_invite_0'), partnered && night < 2); assert.equal(visited.has('y8_breakfast_0'), stay);
    for (const flag of preserved) assert.deepEqual(f[flag], old[flag], flag);
    for (const [flag, value] of Object.entries(old)) if (flag.startsWith('y7')) assert.deepEqual(f[flag], value, flag);
    assert.deepEqual(s.choices.slice(0, oldState.choices.length), oldState.choices);
    assert.equal(Object.keys(f).some(k => /^lin[789]|^lin10|^xu[789]|^xu10|^z[789]|^z10/.test(k)), false);
    assert.equal(story.endings[s.ending].kind, 'chapter'); assert.equal(engine.nextChapterNode(story, s), 'y9_morning_0'); paths++;
  }
  assert.equal(paths, 15552); assert.equal(endings.size, 3);
  for (const [id, n] of Object.entries(story.nodes)) if (n.chapter === 'ye8' && !n.redirectBy) assert.ok(seen.has(id), 'Unvisited: ' + id);
});

test('Released seventh-chapter saves restore and continue into Ye eight without changing old decisions, flags or dialogue', () => {
  const legacy = { ...story, nodes: { ...story.nodes, ye_seven_complete: { chapter: 'ye7', resolve: true } } };
  for (const old of contexts) {
    assert.deepEqual(engine.restore(legacy, old), old); assert.deepEqual(engine.restore(story, old), old);
    assert.equal(engine.nextChapterNode(story, old), 'y8_morning_0'); assert.strictEqual(engine.advance(story, old), old);
    const next = engine.continueChapter(story, old); assert.equal(next.node, 'y8_morning_0'); assert.equal(next.ending, null);
    assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.choices, old.choices); assert.deepEqual(next.history, old.history);
  }
  for (let route = 0; route < 5; route++) assert.equal(engine.nextChapterNode(story, commonBoundary(0, 3, 1, route)), ['l7_morning_0', 'x7_morning_0', 'z7_morning_0', 'y7_morning_0', 's7_morning_0'][route]);
});

test('Actual completion timestamps and permissions survive checkpoints across seven boundaries; choices never pre-complete kisses, photographs or nights', () => {
  const date = contexts.find(s => s.flags.y7Outcome === 'open'), slow = contexts.find(s => s.flags.y7Outcome === 'slow'), paused = contexts.find(s => s.flags.y7Outcome === 'distance');
  const cases = [[date, [1, 0, 0, 0, 0, 0, 0, 0]], [date, [0, 1, 1, 1, 0, 1, 1, 1]], [date, [0, 0, 0, 2, 0, 2, 1, 0]], [date, [1, 1, 1, 0, 0, 0, 0, 2]], [slow, [0, 1, 0, 1, 1, 0, 0, 0]], [slow, [1, 0, 1, 2, 1, 1, 1, 1]], [slow, [0, 1, 0, 0, 2, 2, 1, 2]], [paused, [0, 0, 0, 1, 0, 0, 0, 0]], [paused, [1, 1, 1, 1, 0, 0, 0, 0]], [paused, [1, 0, 0, 0, 2, 2, 1, 2]]];
  for (const [before, ds] of cases) finish(engine.continueChapter(story, before), ds, s => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(s))), s, s.node);
    const pending = { y8_arrival: 'y8BooksReceived', y8_directory_done: 'y8WorkCheckKept', y8_sample_shared: 'y8ShenSampleChecked', y8_sample_separate: 'y8ShenSampleChecked', y8_sample_done: 'y8SamplesChecked', y8_own_work: 'y8ShenWorkSent', y8_phone: 'y8PrivateContactKept', y8_meet_private: 'y8PrivateMeetingKept', y8_meet_work: 'y8WorkMeetingKept', y8_relation_together: 'y8RelationshipConfirmed', y8_touch_kiss: 'y8Kissed', y8_touch_hug: 'y8Hugged', y8_slow_hand: 'y8HeldHands', y8_photo_yes: 'y8JointPhotoTaken', y8_home_invite: 'y8HomeVisited', y8_dinner: 'y8DinnerKept', y8_stay_invite: 'y8StayInvitationAccepted', y8_intimacy_yes: 'y8FurtherIntimacyAgreed', y8_night_complete: 'y8StayedOvernight', y8_breakfast: 'y8BreakfastKept', y8_morning_after: 'y8MorningContactKept', y8_close: 'y8NextWorkBooked' };
    for (const [id, flag] of Object.entries(pending)) if (new RegExp('^' + id + '_\\d+$').test(s.node)) assert.ok(!s.flags[flag], s.node + ': premature ' + flag);
    if (/^y8_morning_phone(_(stay|dinner|home|noodles|walk))?_\d+$/.test(s.node)) assert.equal(s.flags.y8MorningContactKept, undefined);
    assert.equal(s.flags.y8NextWorkKept, undefined);
  });
});

test('No touch, no new photo and separate nights keep girlfriends; staying without contact never adds intimacy', () => {
  const before = contexts.find(s => s.flags.y7Outcome === 'open');
  for (let help = 0; help < 2; help++) for (let touch = 0; touch < 3; touch++) for (let photo = 0; photo < 2; photo++) for (let night = 0; night < 3; night++) {
    const s = finish(engine.continueChapter(story, before), [1, help, 0, 1, 0, touch, photo, night]);
    assert.equal(s.ending, 'y8_together'); assert.equal(s.flags.y8DemandWithdrawn, true); assert.equal(s.flags.y8RelationshipConfirmed, true);
    assert.equal(s.flags.y8FurtherIntimacyAgreed, touch === 0 && night === 0);
    assert.equal(s.flags.y8JointPhotoInFilm, false); assert.equal(s.flags.y8PrivateNightRecorded, false);
  }
});

test('Held pause permits only work; genuine old repair gets a newly agreed phone and meeting without rewriting the former pause', () => {
  const paused = contexts.find(s => s.flags.y7Outcome === 'distance' && s.flags.omittedPerson === 'ye'); assert.ok(paused);
  const held = finish(engine.continueChapter(story, paused), [1, 0, 0, 1, 0, 0, 0, 0]);
  assert.equal(held.ending, 'y8_paused'); assert.equal(held.flags.y8DemandWithdrawn, true);
  assert.equal(held.flags.y8PrivateContactBooked, false); assert.equal(held.flags.y8PrivateMeetingKept, false); assert.equal(held.flags.y8MotherStoryShared, false);
  assert.equal(held.flags.y8JointPhotoTaken, false); assert.equal(held.flags.y8HomeVisited, false); assert.equal(held.flags.pendingOmittedConversation, paused.flags.pendingOmittedConversation);
  const repaired = finish(engine.continueChapter(story, paused), [0, 1, 1, 1, 0, 2, 1, 0]);
  assert.equal(repaired.ending, 'y8_together'); assert.equal(repaired.flags.y8ContactKind, 'new'); assert.equal(repaired.flags.y8OriginalContactBooked, false);
  assert.equal(repaired.flags.y7NextContactBooked, false); assert.equal(repaired.flags.pendingOmittedConversation, false);
  const pendingCandidate = contexts.find(s => s.flags.y7FilmChoice === 'pending');
  const madeNow = finish(engine.continueChapter(story, pendingCandidate), [0, 0, 0, 0, 0, 0, 1, 2]);
  assert.equal(madeNow.flags.y7CandidateReady, false); assert.equal(madeNow.flags.y8CandidateReady, true); assert.equal(madeNow.flags.y8NewDrawingMade, true);
});

test('Recovery rejects forged old footage, public photos, intimacy, future work and relationships; rewinding discards all new chapter facts', () => {
  const s = finish(engine.continueChapter(story, contexts.find(s => s.flags.y7Outcome === 'open')), [0, 0, 0, 0, 0, 2, 1, 2]);
  for (const forged of [{ y8Outcome: 'slow' }, { y8Kissed: true }, { y8StayedOvernight: true }, { y8JointPhotoTaken: true }, { y8JointPhotoPublic: true }, { y8JointPhotoInFilm: true }, { y8PrivateClipImported: true }, { y8PrivateEmotionUsed: true }, { y8PublicScreeningApproved: true }, { y8NextWorkKept: true }, { y8FullMaterialsSubmitted: true }, { videoPlaybackApproved: true }, { y7CandidateReady: !s.flags.y7CandidateReady }, { relationshipStatus: 'tryingDates' }, { y8DeliveredCopies: 1000 }, { z8Outcome: 'together' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...forged } }), null);
  assert.equal(engine.restore(story, { ...s, ending: 'y8_slow' }), null); assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, -1) }), null);
  assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const old = engine.rewind(story, s, story.routeReviewNode); assert.equal(old.node, 'c4_choose_priority_0');
  assert.equal(Object.keys(old.flags).some(k => /^y[78]/.test(k)), false); assert.deepEqual(engine.restore(story, old), old);
});
