const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname,'..');
function edit(file,fn){const p=path.join(root,file);fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
edit('story.js',t=>t.replace("'ye_nine_complete'].includes","'ye_nine_complete', 'ye_ten_complete'].includes"));
edit('index.html',t=>t.replace('林晚、许见微、周栀完整路线；叶澄第七至九章','林晚、许见微、周栀、叶澄完整路线'));
edit('app.js',t=>{
 if(!t.includes("id.startsWith('ye_') ?")) t=t.replace("id.startsWith('zhou_') ?","id.startsWith('ye_') ? '走完叶澄线，听见双方最后的意愿与秋日的答复。' : id.startsWith('zhou_') ?");
 return t.replace('六十一种章节回忆与九个最终结局','六十一种章节回忆与十二个最终结局').replace('林晚、许见微与周栀路线已完整展开，叶澄第七至九章可读，其余后续待制作。','林晚、许见微、周栀与叶澄四条路线已完整展开，独身收束篇待制作。');
});
edit('chapter-ten-ye.js',t=>t.replace('空場','空场'));
