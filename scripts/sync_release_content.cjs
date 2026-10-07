const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),stats=require('./content_statistics.cjs')();
const sh=stats.chapters.find(c=>c.file==='chapter-self-epilogue.js'),ye=stats.chapters.find(c=>c.file==='chapter-ten-ye.js'),zhou=stats.chapters.find(c=>c.file==='chapter-ten-zhou.js');
function edit(file,fn){const p=path.join(root,file);fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('README.md',s=>s.replace('297,436 字符',stats.totalTextCharacters.toLocaleString('en-US')+' 字符').replace('88 个场景、13,932','88 个场景、'+zhou.textCharacters.toLocaleString('en-US')).replace('83个场景、13,722','83个场景、'+ye.textCharacters.toLocaleString('en-US')).replace('85 个场景、14 个回流节点、14,998','85 个场景、14 个回流节点、'+sh.textCharacters.toLocaleString('en-US')));
edit('故事大纲_v2_成人恋爱版.md',s=>s.replace('中文系毕业生，九月将在临江市一家出版社入职。','中文系毕业生，最初计划九月在临江市出版社入职；周栀、叶澄与独身方向后来收到七月提前开始的新岗位提议，实际接受与到岗按本人答复发生。').replace('14,998正文与选项字符',sh.textCharacters.toLocaleString('en-US')+'正文与选项字符'));
edit('scripts/build_self_epilogue_tree.cjs',s=>s.replaceAll('282438+chars',"require('./content_statistics.cjs')().totalTextCharacters"));
const json={date:'2026-10-07',scenes:sh.scenes,gates:sh.gates,textCharacters:sh.textCharacters,combinations:384,chapters:23,finalEndings:13,cards:74,backgrounds:23,images:32,totalTextCharacters:stats.totalTextCharacters};
fs.writeFileSync(path.join(root,'剧本/self-epilogue-content-summary.json'),JSON.stringify(json,null,2));
for(const file of ['剧本/独身群像_验证记录.md','剧本/叶澄线_第十章_验证记录.md','剧本/周栀线_第十章_验证记录.md'])edit(file,s=>s.includes('2026-10-07 完整版校对')?s:s+'\n\n2026-10-07 完整版校对补记：在原岗位邮件段落明确由九月计划提出七月提前开始的新邀请，仅改既有对白，不增删节点或标记。本文前述字数为当时验证版本，当前全文精确统计以 `release/verification/content-audit.json` 为准。\n');
console.log(JSON.stringify({total:stats.totalTextCharacters,self:sh.textCharacters,ye:ye.textCharacters,zhou:zhou.textCharacters}));
