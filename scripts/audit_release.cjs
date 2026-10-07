const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),out=path.join(root,'release/verification');fs.mkdirSync(out,{recursive:true});
const story=require('../story.js'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/characters/v1/cast.js'),'utf8'),sandbox);const cast=sandbox.window.RainCast;
const castIds=new Set(cast.map(c=>c.id)),castNames=new Set(cast.map(c=>c.name));
const sources=scripts.filter(p=>/^chapter-.*\.js$/.test(p));
const scenes=new Set(),stats=[],speakers=new Map();let characters=0,choices=0;
for(const file of scripts)assert.ok(fs.existsSync(path.join(root,file)),file);
for(const file of sources){
 const data=require('../'+file);let n=0;
 for(const s of data.scenes){assert.ok(!scenes.has(s.id),'Duplicate source scene: '+s.id);scenes.add(s.id);assert.ok(story.locations[s.location],s.location);assert.ok(s.lines.length);
  for(const id of s.cast)assert.ok(castIds.has(id),'Unknown cast '+file+': '+id);
  for(const [who,text]of [...s.lines,...Object.values(s.variants||{}).flat()]){assert.ok(text.trim()&&who.trim());assert.ok(!/(?:TODO|TBD|待补写|待编写|占位正文)/.test(text),file+': '+text);n+=Array.from(text).length;const name=who.split(' · ')[0];if(!castNames.has(name)&&name!=='旁白')speakers.set(name,(speakers.get(name)||0)+1);}
  if(s.choices){choices++;for(const c of s.choices){assert.ok(c.text.trim());n+=Array.from(c.text).length;}}
 }
 characters+=n;stats.push({file,scenes:data.scenes.length,gates:(data.gates||[]).length,textCharacters:n});
}
const reachable=new Set(),queue=[story.start];
for(let i=0;i<queue.length;i++){const id=queue[i];if(reachable.has(id))continue;reachable.add(id);const n=story.nodes[id];assert.ok(n,'Missing node '+id);const targets=n.resolve?(n.nextBy?Object.values(n.nextTargets):n.next?[n.next]:[]):n.choices?n.choices.map(c=>c.next):n.redirectBy?Object.values(n.targets):[n.next];for(const t of targets){assert.ok(story.nodes[t],id+' -> '+t);queue.push(t);}}
const unreachable=Object.keys(story.nodes).filter(id=>!reachable.has(id));assert.deepEqual(unreachable,[]);
const assets=[...Object.values(story.locations).map(x=>x.image),...cast.map(c=>'assets/characters/v1/'+c.id+'.png'),'assets/characters/v1/ye_cheng_no_camera.png','assets/cover.png'];
for(const file of assets)assert.ok(fs.existsSync(path.join(root,file)),file);
for(const file of ['index.html','styles.css','chapter-styles.css',...scripts])assert.ok(!/(?:src|href)\s*=\s*["']https?:\/\/|@import\s+url\(["']?https?:\/\//.test(fs.readFileSync(path.join(root,file),'utf8')),'External runtime dependency '+file);
assert.equal(sources.length,23);assert.equal(Object.keys(story.chapters).length,23);assert.equal(Object.keys(story.endings).length,74);assert.equal(Object.values(story.endings).filter(x=>x.kind==='final').length,13);assert.equal(characters,297498);
assert.ok(!html.includes('speaker-role'));assert.equal(story.id,'rain-chapter-one-v1');assert.ok(fs.readFileSync(path.join(root,'app.js'),'utf8').includes("before-the-rain-chapter-one-v1:"));
assert.ok(!speakers.has('陈叙宁'),'Community coordinator name must match the character roster.');
const result={date:new Date().toISOString(),sources:stats,chapters:sources.length,scenes:scenes.size,choiceScenes:choices,textCharacters:characters,nodes:Object.keys(story.nodes).length,unreachable,cards:74,finalEndings:13,backgrounds:Object.keys(story.locations).length,cast:cast.length,assets:assets.length,otherSpeakers:Object.fromEntries(speakers),checks:['uniqueScenes','knownCastIds','noPlaceholderDialogue','allEdgesAndChaptersReachable','allRuntimeAssetsExist','noExternalRuntimeDependencies','stableSaveIdentity','13Finals74Cards','noRoleSmallText','communityCoordinatorName']};
fs.writeFileSync(path.join(out,'content-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({...result,sources:undefined}));
