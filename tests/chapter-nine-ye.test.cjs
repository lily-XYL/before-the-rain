const { test } = require('node:test');
const assert = require('node:assert/strict');
const { story, engine, finish, eighthBoundary } = require('./ye-helpers.cjs');
const contexts = [];
for (let w = 0; w < 3; w++) for (let o = 0; o < 4; o++) for (let m = 0; m < 2; m++) contexts.push(eighthBoundary(w, o, m));
const preserved = ['selectedRoute', 'routeFocusReady', 'L_present', 'X_need', 'Z_reality', 'Y_withoutCamera', 'keptPromise', 'priorityCompleted', 'rebookKept', 'sixthRepairActionKept', 'sixthFriendTalkKept', 'nextPrivateMeeting', 'plannedCost', 'plannedCopies', 'plannedPages', 'budgetReserve', 'workflow', 'readingMode', 'letterScope', 'letterRecipientPrivate', 'cameraScope', 'privateClipRecorded', 'privateLetterPublic', 'videoPlaybackApproved', 'withdrawnSubmission', 'luMoveDate', 'luDeparturePlan', 'equipmentRepairCompleted'];

test('All 216 Ye ninth-chapter combinations across 24 actual histories cover every line without widening private permissions or rewriting misuse', () => {
  assert.deepEqual(new Set(contexts.map(s => s.flags.relationshipStatus)), new Set(['girlfriends', 'tryingDates', 'gettingToKnow', 'needsConversation']));
  assert.deepEqual(new Set(contexts.map(s => s.flags.cameraScope)), new Set(['none', 'private', 'discuss']));
  assert.deepEqual(new Set(contexts.filter(s => s.flags.pendingOmittedConversation).map(s => s.flags.omittedPerson)), new Set(['lin', 'xu', 'zhou', 'ye']));
  const source = require('../chapter-nine-ye.js'), ids = [...source.scenes, ...source.gates].map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  const seen = new Set(), endings = new Set(); let paths = 0;
  for (const before of contexts) for (let prior = 0; prior < 2; prior++) for (let film = 0; film < 3; film++) for (let help = 0; help < 2; help++) for (let response = 0; response < 3; response++) for (let mutual = 0; mutual < 2; mutual++) for (let close = 0; close < 3; close++) {
    const old = before.flags, eligible = (old.relationshipStatus !== 'needsConversation' || prior === 0) && response === 0 && mutual === 0;
    const outcome = !eligible ? 'paused' : old.relationshipStatus === 'girlfriends' ? 'together' : 'reopen', used = film === 2;
    const visited = new Set();
    const s = finish(engine.continueChapter(story, before), [prior, film, help, response, mutual, close], at => { seen.add(at.node); visited.add(at.node); }), f = s.flags;
    assert.equal(s.ending, 'y9_' + outcome); endings.add(s.ending); assert.equal(s.choices.length, 53);
    assert.equal(f.y9EntryStatus, old.relationshipStatus); assert.equal(f.y9PriorReady, old.relationshipStatus !== 'needsConversation' || prior === 0);
    assert.equal(f.y9PriorResponseKept, prior === 0); assert.equal(f.y9OldRepairKept, old.pendingOmittedConversation && prior === 0);
    assert.equal(f.pendingOmittedConversation, old.pendingOmittedConversation && prior === 1);
    assert.equal(f.y9OldDemandWithdrawn, prior === 0 && old.y8AllHistoryDemanded && !old.y8DemandWithdrawn);
    assert.equal(f.y9MaintenanceClipRecorded, true); assert.equal(f.y9MaintenanceClipSeconds, 20); assert.equal(f.y9MaintenanceClipScope, 'repairOnly');
    assert.equal(f.y9NewUseAsked, film === 0); assert.equal(f.y9NewUseAnswered, film === 0); assert.equal(f.y9NewUseDenied, film !== 1);
    assert.equal(f.y9UnauthorizedFilmUseOccurred, used); assert.equal(f.y9UnauthorizedFilmUseRemoved, used); assert.equal(f.y9UnauthorizedDisclosureKept, used);
    if (used) { assert.equal(f.y9UnauthorizedDisclosureAt, '6-24 18:45'); assert.equal(f.y9UnauthorizedFilmUseRemovedAt, '6-24 19:00'); }
    assert.equal(f.y9FilmScopeSafe, true); assert.equal(f.y9CandidateReady, true); assert.equal(f.y9CandidateSourcesChecked, true); assert.equal(f.y9CandidateUseListReady, true);
    for (const k of ['y9MaintenanceClipPublicApproved', 'y9ShenOldClipImported', 'y9JointPhotoImported', 'y9UnauthorizedPublicScreeningOccurred', 'y9UnauthorizedCutSent', 'y9PrivateEmotionInCurrentCut', 'y9FilmPublicApproved', 'y9FilmScreened', 'y9EquipmentReenergized', 'y9ReplacementOrdered', 'y9ReplacementPaid', 'y9ShenEquipmentCheckSigned', 'y9PublisherWorkDelegated', 'y9AllOtherCopiesDeletedClaimed', 'y9YeProjectAccepted', 'y9YeProjectDeparted', 'y9Kissed', 'y9NightRecorded']) assert.equal(f[k], false, k);
    assert.equal(f.y9HelpKept, help === 0); assert.equal(f.y9HelpMinutes, help === 0 ? 20 : 0); assert.equal(f.y9OwnerRestKept, true); assert.equal(f.y9OwnerRestAt, '6-24 19:30');
    assert.equal(f.y9CurrentResponseKept, response === 0); assert.equal(f.y9OwnBadAdviceWithdrawn, used && response === 0);
    assert.equal(f.y9Outcome, outcome); assert.equal(f.relationshipStatus, eligible ? old.relationshipStatus : 'needsConversation');
    assert.equal(f.y9PrivateTalkAccepted, eligible); assert.equal(f.y9ExclusiveActive, outcome === 'together');
    assert.equal(f.y9PrivateMeetingKept, eligible && close < 2); assert.equal(f.y9PrivateTalkMinutes, eligible && close < 2 ? outcome === 'together' ? 15 : 10 : 0);
    assert.equal(f.y9HeldHands, outcome === 'together' && close === 0);
    assert.equal(f.y9PrivateMeetingCancelledByAgreement, eligible && close === 2 ? true : undefined);
    if (outcome === 'reopen') assert.equal(f.y9ReopenKind, ({ tryingDates: 'dates', gettingToKnow: 'learning', needsConversation: 'afterPause' })[old.relationshipStatus]);
    assert.equal(f.y9DamagedCopies, 4); assert.equal(f.y9DamagedCopiesIsolated, true); assert.equal(f.y9UsableCopies, old.workflow === 'smaller' ? 36 : 56); assert.equal(f.y9ReplacementQuote, 48);
    assert.equal(f.y9WindowRepaired, true); assert.equal(f.y9DryRouteChecked, true); assert.equal(f.y9BriefingAttended, true); assert.equal(f.y9BriefingFinishedAt, '6-24 20:45');
    assert.equal(f.y9YeMaintenanceCopyDeleted, true); assert.equal(f.y9YeMaintenanceCopyDeletedAt, '6-25 09:20');
    assert.equal(f.y9WorkCheckKept, true); assert.equal(f.y9WorkCheckTime, '6-25 10:00-10:15');
    assert.equal(f.y9PublisherMaterialsSent, true); assert.equal(f.y9PublisherMaterialsSentAt, '6-25 11:00'); assert.equal(f.y9PublisherDeadlineKept, true);
    assert.equal(f.y9YeProjectInquiryReceived, true); assert.equal(f.y9YeProjectDates, '7-08 to 8-04'); assert.equal(f.y9YeProjectReplyDeadline, '6-26 17:00');
    assert.equal(visited.has('y9_film_use_0'), used); assert.equal(visited.has('y9_demand_withdraw_0'), f.y9OldDemandWithdrawn);
    assert.equal(visited.has('y9_station_hand_0'), outcome === 'together' && close === 0);
    assert.equal(visited.has('y9_station_needs_0'), outcome === 'reopen' && close === 0);
    for (const flag of preserved) assert.deepEqual(f[flag], old[flag], flag);
    for (const [flag, value] of Object.entries(old)) if (/^y[78]/.test(flag)) assert.deepEqual(f[flag], value, flag);
    assert.deepEqual(s.choices.slice(0, before.choices.length), before.choices);
    assert.equal(Object.keys(f).some(k => /^lin[789]|^lin10|^xu[789]|^xu10|^z[789]|^z10/.test(k)), false);
    assert.equal(story.endings[s.ending].kind, 'chapter'); assert.equal(engine.nextChapterNode(story, s), 'y10_start_0'); paths++;
  }
  assert.equal(paths, 5184); assert.equal(endings.size, 3);
  for (const [id, n] of Object.entries(story.nodes)) if (n.chapter === 'ye9' && !n.redirectBy) assert.ok(seen.has(id), 'Unvisited: ' + id);
});

test('Released eighth-chapter saves restore and explicitly continue without changing earlier permissions, relationship facts, decisions or dialogue', () => {
  const legacy = { ...story, nodes: { ...story.nodes, ye_eight_complete: { chapter: 'ye8', resolve: true } } };
  for (const s of contexts) {
    assert.deepEqual(engine.restore(legacy, s), s); assert.deepEqual(engine.restore(story, s), s); assert.strictEqual(engine.advance(story, s), s);
    const n = engine.continueChapter(story, s); assert.equal(n.node, 'y9_morning_0'); assert.equal(n.ending, null);
    assert.deepEqual(n.flags, s.flags); assert.deepEqual(n.choices, s.choices); assert.deepEqual(n.history, s.history);
  }
});

test('Representative checkpoints restore across eight boundaries; real recording, misuse, removal, meetings and delivery need actual scenes', () => {
  const couple = contexts.find(s => s.flags.relationshipStatus === 'girlfriends'), dates = contexts.find(s => s.flags.relationshipStatus === 'tryingDates'), learning = contexts.find(s => s.flags.relationshipStatus === 'gettingToKnow'), paused = contexts.find(s => s.flags.relationshipStatus === 'needsConversation');
  for (const [b, ds] of [[couple, [1, 2, 0, 0, 0, 0]], [couple, [0, 0, 1, 0, 0, 2]], [dates, [1, 1, 0, 0, 0, 1]], [learning, [0, 0, 1, 0, 0, 0]], [paused, [0, 2, 1, 0, 0, 0]], [paused, [1, 2, 0, 1, 0, 0]]]) finish(engine.continueChapter(story, b), ds, s => {
    assert.deepEqual(engine.restore(story, JSON.parse(JSON.stringify(s))), s, s.node);
    const facts = { y9_repair_clip: 'y9MaintenanceClipRecorded', y9_film_use: 'y9UnauthorizedFilmUseOccurred', y9_use_disclose: 'y9UnauthorizedDisclosureKept', y9_use_remove: 'y9UnauthorizedFilmUseRemoved', y9_plan: 'y9CandidateReady', y9_owner_rest: 'y9OwnerRestKept', y9_help_finite: 'y9HelpKept', y9_own_work: 'y9OwnDraftPrepared', y9_response_kept: 'y9CurrentResponseKept', y9_station_hand: 'y9HeldHands', y9_window: 'y9WindowRepaired', y9_maintenance_delete: 'y9YeMaintenanceCopyDeleted', y9_work_check: 'y9WorkCheckKept', y9_publisher: 'y9PublisherMaterialsSent', y9_business: 'y9YeProjectInquiryReceived' };
    for (const [id, flag] of Object.entries(facts)) if (new RegExp('^' + id + '_\\d+$').test(s.node)) assert.ok(!s.flags[flag], s.node + ': premature ' + flag);
    assert.equal(s.flags.y9FilmScreened, s.flags.y9CandidateReady ? false : undefined);
    assert.equal(s.flags.y9YeProjectAccepted, s.flags.y9YeProjectInquiryReceived ? false : undefined);
  });
});

test('Limited help, no touch, agreed rest and the safe replacement all preserve girlfriends; deleting misuse does not erase it', () => {
  const b = contexts.find(s => s.flags.relationshipStatus === 'girlfriends');
  for (let film = 0; film < 3; film++) for (let help = 0; help < 2; help++) for (let close = 0; close < 3; close++) {
    const s = finish(engine.continueChapter(story, b), [1, film, help, 0, 0, close]);
    assert.equal(s.ending, 'y9_together'); assert.equal(s.flags.y9UnauthorizedFilmUseOccurred, film === 2);
    assert.equal(s.flags.y9UnauthorizedFilmUseRemoved, film === 2); assert.equal(s.flags.y9FilmPublicApproved, false);
    assert.equal(s.flags.y9PrivateMeetingKept, close !== 2); assert.equal(s.flags.y9HeldHands, close === 0);
  }
});

test('A prior pause needs an actual old response; reopening only allows conversation and cooperation cannot override a defended refusal', () => {
  const b = contexts.find(s => s.flags.relationshipStatus === 'needsConversation' && s.flags.y8AllHistoryDemanded && !s.flags.y8DemandWithdrawn); assert.ok(b);
  const held = finish(engine.continueChapter(story, b), [1, 0, 0, 0, 0, 0]); assert.equal(held.ending, 'y9_paused'); assert.equal(held.flags.y9PrivateMeetingKept, false); assert.equal(held.flags.y9OldDemandWithdrawn, false);
  const repaired = finish(engine.continueChapter(story, b), [0, 2, 1, 0, 0, 0]);
  assert.equal(repaired.ending, 'y9_reopen'); assert.equal(repaired.flags.relationshipStatus, 'needsConversation'); assert.equal(repaired.flags.y9ReopenKind, 'afterPause'); assert.equal(repaired.flags.y9HeldHands, false); assert.equal(repaired.flags.y9OldDemandWithdrawn, true);
  assert.equal(repaired.flags.y8DemandWithdrawn, false); assert.equal(repaired.flags.y9PrivateTalkMinutes, 10);
  const defended = finish(engine.continueChapter(story, contexts.find(s => s.flags.relationshipStatus === 'girlfriends')), [0, 2, 0, 1, 0, 0]);
  assert.equal(defended.ending, 'y9_paused'); assert.equal(defended.flags.y9UnauthorizedFilmUseRemoved, true); assert.equal(defended.flags.y9OwnBadAdviceWithdrawn, false);
});

test('Recovery rejects forged misuse erasure, public consent, stock, private contact, future project and submissions; rewind discards later facts', () => {
  const s = finish(engine.continueChapter(story, contexts.find(s => s.flags.relationshipStatus === 'girlfriends')), [0, 2, 1, 0, 0, 2]);
  for (const changes of [{ y9UnauthorizedFilmUseOccurred: false }, { y9UnauthorizedFilmUseRemoved: false }, { y9UnauthorizedCutSent: true }, { y9MaintenanceClipPublicApproved: true }, { y9FilmPublicApproved: true }, { y9FilmScreened: true }, { y9ShenOldClipImported: true }, { y9JointPhotoImported: true }, { y9AllOtherCopiesDeletedClaimed: true }, { y9YeProjectAccepted: true }, { y9YeProjectDeparted: true }, { y9ReplacementOrdered: true }, { y9ReplacementPaid: true }, { y9UsableCopies: 1000 }, { y9HeldHands: true }, { y9PublisherWorkDelegated: true }, { y9PublisherMaterialsSent: false }, { y8RelationshipPublic: true }, { y9Outcome: 'paused' }, { z9Outcome: 'together' }]) assert.equal(engine.restore(story, { ...s, flags: { ...s.flags, ...changes } }), null);
  assert.equal(engine.restore(story, { ...s, ending: 'y9_paused' }), null); assert.equal(engine.restore(story, { ...s, choices: s.choices.slice(0, -1) }), null); assert.deepEqual(engine.restore(story, { ...s, history: [] }), s);
  const earlier = engine.rewind(story, s, story.routeReviewNode); assert.equal(earlier.node, 'c4_choose_priority_0'); assert.equal(Object.keys(earlier.flags).some(k => /^y[789]/.test(k)), false); assert.deepEqual(engine.restore(story, earlier), earlier);
});
