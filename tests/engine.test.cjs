const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const story = require('../story.js');
const engine = require('../engine.js');

function play(decisions, visit = () => {}) {
  let state = engine.create(story), choice = 0, steps = 0;
  while (!state.ending) {
    assert.ok(++steps <= Object.keys(story.nodes).length, 'Every route must terminate.');
    visit(state);
    state = engine.advance(story, state, story.nodes[state.node].choices ? decisions[choice++] : undefined);
  }
  visit(state); return state;
}
test('Every edge targets an existing node and all visual assets exist', () => {
  for (const [id,node] of Object.entries(story.nodes)) {
    const targets = node.resolve ? node.nextBy ? Object.values(node.nextTargets) : node.next ? [node.next] : [] : node.choices ? node.choices.map(c=>c.next) : node.redirectBy ? Object.values(node.targets) : [node.next];
    targets.forEach(next=>assert.ok(story.nodes[next], `${id} points to missing ${next}`));
    if (node.resolve || node.redirectBy) continue;
    assert.ok(story.locations[node.location]);
    node.cast.forEach(c=>assert.ok(fs.existsSync(path.join(__dirname,'../assets/characters/v1',c+'.png'))));
    for (const [character, variant] of Object.entries(node.spriteVariants || {})) {
      assert.ok(fs.existsSync(path.join(__dirname, '../assets/characters/v1', character + '_' + variant + '.png')), id + ': missing sprite variant');
    }
  }
  Object.values(story.locations).forEach(location=>assert.ok(fs.existsSync(path.join(__dirname,'..',location.image))));
});
test('All 27 combinations reach the chapter boundary with three decisions', () => {
  const endings=new Set();
  for(let tea=0;tea<3;tea++) for(let branch=0;branch<3;branch++) for(let reply=0;reply<3;reply++) {
    const state=play([tea,branch,reply]);
    assert.equal(state.choices.length,3);
    assert.equal(state.flags.firstEvening,['lin','ye','lu'][branch]);
    assert.equal(state.flags.tea,['remember','share','water'][tea]);
    assert.equal(state.ending,['lin_memory','ye_memory','lu_memory'][branch]);
    assert.ok(state.history.at(-1).text.includes('下一页'));
    endings.add(state.ending);
  }
  assert.equal(endings.size,3);
});
test('Evening return uses the selected branch, not another character memory', () => {
  const lin=play([0,0,0]),ye=play([0,1,1]),lu=play([0,2,2]);
  assert.ok(lin.history.some(h=>h.text.includes('谢谢你留下来')));
  assert.ok(ye.history.some(h=>h.text.includes('讨论过的拍摄范围')));
  assert.ok(lu.history.some(h=>h.text.includes('隔着一条过道')));
  assert.ok(!lu.history.some(h=>h.text.includes('谢谢你留下来')));
  assert.equal(ye.flags.filmingConsent,'environmentOnly');
  assert.equal(lu.flags.luMoveDate,'6-29 09:20');
});
test('Every checkpoint on every combination restores canonically', () => {
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)play([a,b,c],state=>{
    assert.deepEqual(engine.restore(story,JSON.parse(JSON.stringify(state))),state);
  });
});
test('Old, tampered and unreachable saves are rejected; forged history is rebuilt', () => {
  const finished=play([0,1,1]);
  for(const raw of [null,{}, {...finished,version:1},{...finished,storyId:'other'},{...finished,node:'missing'},{...finished,flags:{...finished.flags,firstEvening:'lin'}},{...finished,choices:[]},{...finished,ending:'lin_memory'},{...finished,flags:[]}]) assert.equal(engine.restore(story,raw),null);
  const edited={...finished,history:[{speaker:'<script>',text:'untrusted'}]};
  assert.deepEqual(engine.restore(story,edited),finished);
});
test('Invalid decisions do not advance or mutate the original state', () => {
  let state=engine.create(story);
  while(!story.nodes[state.node].choices)state=engine.advance(story,state);
  const before=JSON.stringify(state);
  for(const value of [undefined,-1,3,'0',NaN,1.2])assert.throws(()=>engine.advance(story,state,value));
  const next=engine.advance(story,state,0);
  assert.equal(JSON.stringify(state),before);
  assert.equal(next.flags.tea,'remember');
});
