const {test}=require('node:test'),assert=require('node:assert/strict');
const backup=require('../save-backup.js'),story=require('../story.js'),engine=require('../engine.js');
const time='2026-10-06T12:00:00.000Z',initial=engine.create(story),entry={savedAt:time,state:initial};
const clone=x=>JSON.parse(JSON.stringify(x));
function memory(seed={}){const data=clone(seed);return {data,read:k=>data[k]??null,write:(k,v)=>{data[k]=v;return true;}};}
test('All seven save types export and import canonically without changing save keys',()=>{
 const a=memory(Object.fromEntries(backup.names.map(n=>[n,entry]))),b=memory();a.data.endings={lin_memory:time};
 const file=backup.create(story,engine,a.read,time);assert.equal(Object.keys(file.saves).length,7);assert.deepEqual(backup.apply(story,engine,clone(file),b.read,b.write),{saves:7,endings:1});assert.deepEqual(a.data,b.data);
});
test('Collections merge and slots absent from the backup survive',()=>{
 const a=memory({auto:entry,endings:{lin_memory:time}}),b=memory({slot4:entry,endings:{ye_memory:time}});
 const r=backup.apply(story,engine,backup.create(story,engine,a.read,time),b.read,b.write);assert.equal(r.endings,2);assert.deepEqual(b.data.slot4,entry);assert.deepEqual(b.data.auto,entry);
});
test('Tampered progress rejects the entire import before any writes',()=>{
 const a=memory({auto:entry,slot1:entry}),b=memory({auto:entry});const file=backup.create(story,engine,a.read,time);file.saves.slot1.state.flags.s7AutumnKept=true;const before=clone(b.data);assert.throws(()=>backup.apply(story,engine,file,b.read,b.write),/校验/);assert.deepEqual(b.data,before);
});
test('Wrong version, game, dates, unknown slots and unknown collection IDs are rejected',()=>{
 const file=backup.create(story,engine,memory({auto:entry}).read,time);
 for(const change of [{version:2},{storyId:'other'},{exportedAt:'not-a-date'},{saves:{foreign:entry}},{saves:{auto:{...entry,savedAt:'bad'}}},{endings:{invented:time}},{endings:[]}])assert.throws(()=>backup.validate(story,engine,{...clone(file),...change}));
});
test('A failed storage write rolls every affected slot back',()=>{
 const a=memory({auto:entry,slot1:entry}),b=memory({auto:{...entry,savedAt:'2026-10-05T12:00:00Z'},endings:{ye_memory:time}}),before=clone(b.data);let failed=false;
 const writer=(k,v)=>{b.write(k,v);if(k==='slot1'&&!failed){failed=true;return false;}return true;};assert.throws(()=>backup.apply(story,engine,backup.create(story,engine,a.read,time),b.read,writer),/恢复原进度/);assert.deepEqual(b.data.auto,before.auto);assert.equal(b.data.slot1,null);assert.deepEqual(b.data.endings,before.endings);
});
test('Empty backups are valid and forged history is rebuilt from valid decisions',()=>{
 const a=memory(),file=backup.create(story,engine,a.read,time);assert.deepEqual(file.saves,{});a.data.auto=clone(entry);a.data.auto.state.history=[{speaker:'fake',text:'future'}];const restored=backup.create(story,engine,a.read,time);assert.deepEqual(restored.saves.auto.state,initial);
});
