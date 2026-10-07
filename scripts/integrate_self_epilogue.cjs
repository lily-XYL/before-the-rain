const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function replace(file,a,b){const p=path.join(root,file),s=fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');if(s.includes(b))return;if(!s.includes(a))throw new Error('Missing integration anchor: '+file);fs.writeFileSync(p,s.replace(a,b));}
replace('story.js',"'ye_ten_complete'].includes(id)","'ye_ten_complete', 'self_complete'].includes(id)");
replace('app.js',"if (chapter.route === 'ye') $('bond-label').textContent = '今日叶澄';","if (chapter.route === 'ye') $('bond-label').textContent = '今日叶澄';\n    if (chapter.route === 'self') $('bond-label').textContent = '自己的日子';");
replace('app.js',"ending.kind === 'final' ? (id.startsWith('ye_')", "ending.kind === 'final' ? (id.startsWith('self_') ? '走完独身群像收束篇，读到写给自己的秋日回信。' : id.startsWith('ye_')");
replace('app.js','六十一种章节回忆与十二个最终结局','六十一种章节回忆与十三个最终结局');
replace('app.js','林晚、许见微、周栀与叶澄四条路线已完整展开，独身收束篇待制作。','共通线、四条恋爱路线与独身群像收束篇已完整展开。');
replace('app.js',"$('bond-button').onclick = () => {\n    if (story.nodes[state.node].chapter === 'ye10')", "$('bond-button').onclick = () => {\n    if (story.nodes[state.node].chapter === 'self7') {\n      toast('友情、工作和自己的日子，各有真实的下一步。');\n    } else if (story.nodes[state.node].chapter === 'ye10')");
replace('index.html','林晚、许见微、周栀、叶澄完整路线','共通六章 · 四条恋爱路线 · 独身群像收束');
replace('scripts/build_chapter.cjs','for (const config of configs) {',"places.self_home = '知夏的新住处';\nconfigs.push({source:'chapter-self-epilogue.js',title:'独身群像收束篇《写给自己的信》',file:'独身群像_写给自己的信.md',intro:'时间：六月十九日至三十日、七月与秋日。直接承接第六章独身方向的原存档。',order:'两种独身入口 → 原印厂答复 → 具体旧调整 → 陆遥八点谈话或真实撤回 → 到货抽检与反馈 → 四位普通朋友下午 → 自己修订 → 雨夜三种求助 → 实际撤回压力与补核 → 完整材料提交 → 两种告别展示 → 本人接受岗位与租房 → 新展示各自同意 → 两箱实搬 → 两种现场岗位 → 告别展完成 → 装箱与晚饭 → 原车次送站 → 原址关灯交钥匙 → 新住处实搬 → 私信不封口或封存 → 实际入职 → 普通朋友电话 → 夏日近况 → 两种秋日读信 → 独身最终结局。',gateNote:'七次选择384种组合；旧印数、预算、私人信与影像范围冻结，合作调整和友情谈话按实际分别回收。三个求助方式不决定结局，施压事实保留，实际撤回不替大家宣布原谅。只有读完秋日最后一句才收藏独身结局，始终不是恋爱补偿。新增知夏自己的新房间背景，无姓名旁身份小字。'});\nfor (const config of configs) {");
console.log('Self epilogue integrated.');
