const story = require('../story.js'), engine = require('../engine.js');
const replayLimit = Object.keys(story.nodes).length * 2;
function finish(s, decisions, visit = () => {}) {
  let choice = 0, steps = 0;
  while (!s.ending) {
    if (++steps > replayLimit) throw new Error('Loop at ' + s.node);
    visit(s);
    s = engine.advance(story, s, story.nodes[s.node].choices ? decisions[choice++] : undefined);
  }
  if (choice !== decisions.length) throw new Error('Decision count ' + choice + '/' + decisions.length);
  visit(s); return s;
}
function commonBoundary(work, omitted, pending = 1, route = 3) {
  const focus = (work + omitted) % 2 ? 4 : 3, handling = focus === 4 ? 2 : 0, friend = (work + omitted + pending) % 2 ? 2 : 0;
  const decisions = [[work, omitted % 3, friend], [0, focus % 4, omitted % 3, 0, work % 2, friend],
    [0, work, omitted, 0, 0, work], [0, focus % 4, omitted % 3, handling, 0, friend, omitted],
    [0, pending, work, 0, pending ? 2 : 0, 1, route], [1, 1, route, work % 2]];
  let s = engine.create(story);
  for (const ds of decisions) { if (s.ending) s = engine.continueChapter(story, s); s = finish(s, ds); }
  return s;
}
function seventhBoundary(work, omitted, pending = 1) {
  const old = commonBoundary(work, omitted, pending);
  return finish(engine.continueChapter(story, old), [1, work, omitted % 2, (work + omitted) % 3, (work + omitted) % 3 === 0 ? 1 : 0, (work + omitted + pending) % 3]);
}
function eighthBoundary(work, omitted, mode = 0) {
  const old = seventhBoundary(work, omitted, (work === 0 && omitted === 1) || (work === 1 && omitted === 0) ? 0 : 1);
  const relation = !mode ? 0 : (work === 0 && omitted === 1) || (work === 1 && omitted === 0) ? 1 : (work + omitted) % 2 ? 2 : 1;
  return finish(engine.continueChapter(story, old), [mode, work % 2, omitted % 2, mode ? 1 : omitted % 3, relation, work % 3, mode ? 1 : omitted % 2, mode ? 2 : omitted % 3]);
}
function ninthBoundary(work, omitted, mode = 0) {
  const old = eighthBoundary(work, omitted, mode);
  const alreadyOpen = ['gettingToKnow', 'tryingDates'].includes(old.flags.relationshipStatus);
  return finish(engine.continueChapter(story, old), [mode ? 1 : (work + omitted) % 2, (work + omitted + mode) % 3, work % 2, mode && !alreadyOpen ? (work + omitted) % 3 : 0, 0, (work + omitted) % 3]);
}
module.exports = { story, engine, finish, commonBoundary, seventhBoundary, eighthBoundary, ninthBoundary };
