const fs=require('node:fs'),path=require('node:path'),data=require('../chapter-self-epilogue.js');
const root=path.resolve(__dirname,'..');
let chars=0;for(const s of data.scenes){for(const [,t]of s.lines)chars+=Array.from(t).length;for(const c of s.choices||[])chars+=Array.from(c.text).length;for(const ls of Object.values(s.variants||{}))for(const [,t]of ls)chars+=Array.from(t).length;}
const clean=s=>s.replace(/["<>]/g,'').replace(/\n/g,' ');
const overview=`flowchart TD
 A[第六章独身方向：原独处信 / 原朋友晚饭] --> B[印厂原确认或今天新确认]
 B --> C{一：具体旧调整 / 仍未准备好}
 C --> D{二：原八点朋友谈话 / 真正核清今晚安静}
 D --> E[原谈话实谈或共同撤回；没有欠约者聊今天或各自安静]
 E --> F[到货抽三本；20号反馈实际发送]
 F --> G{三：林晚 / 见微 / 周栀 / 叶澄的普通半小时}
 G --> H[新询问、新答应、21号真实见过；各自原安排继续]
 H --> I[22号自己修订；23号店主自己的休息]
 I --> J[24号暴雨：停湿设备、四本隔离、48元仅报价]
 J --> K{四：有限求助 / 隐瞒做不完 / 要求大家都来证明友情}
 K --> L[获准的一项真实做完后离开]
 K --> M[初核未完成，记录欠项]
 K --> N[要求被拒，施压事实保留，20点30真撤回]
 L --> O[25号沿用实际复核]
 M --> P[25号新问陈序宁十分钟，实际补核]
 N --> P
 O --> Q[25号11点完整材料实交]
 P --> Q
 Q --> R{五：短节目及新卡片 / 更安静纸面与短读}
 R --> S[26号岗位本人接受、租房本人核签、新卡片用途本人分别同意]
 S --> T[26号两箱真实搬；原书册页数印数费用不改]
 T --> U{六：入口 / 归还桌}
 U --> V[27号14点至14点50真实岗位、纸面展与短读]
 V --> W[活动完成、物件卡还本人、店主按时休息]
 W --> X[28号实际装箱、18点晚饭、20点核入口]
 X --> Y[29号7点50出发、9点20原车次送别]
 Y --> Z[30号10点原址关灯交钥匙]
 Z --> AA[另外问6号十分钟朋友电话；16点新住处交接并实搬]
 AA --> AB{七：信不封口 / 真封好留给秋天}
 AB --> AC[7月1日实际入职；6号实际普通电话；8月朋友各自近况]
 AC --> AD[9月30日继续未封口的信 / 真拆六月封好的信]
 AD --> AE[真实秋日沿河，最后一句后收藏]
 AE --> AF[唯一独身最终结局：雨停后，我也向前走]
`;
let text='# 独身群像收束篇《写给自己的信》分支结构\n\n';
text+=`已实装：${data.scenes.length} 个场景、${data.gates.length} 个回流节点、${chars.toLocaleString('en-US')} 正文与选项字符。七次选择 2×2×4×3×2×2×2＝384 种组合。接续原第六章独身章末存档，不重写既有经历；所有组合都有自己的完整生活与唯一独身结局。\n\n`;
text+='## 阅读总览\n\n~~~mermaid\n'+overview+'~~~\n\n';
text+='## 实际时间与分支事实\n\n';
text+='| 事件 | 真正发生的时间 | 保留的区别 |\n| --- | --- | --- |\n';
text+='| 原合作回应 | 19日新问12:00–12:20 | 已完成者不重复；保留者仍未完成 |\n| 陆遥旧谈话 | 19日原20:00 | 真谈才回收；真实撤回不代替修复，日常饭局不擦旧记录 |\n| 普通朋友下午 | 20日新问，21日15:00–15:30真见 | 四段独立剧情，不转换成恋爱 |\n| 印厂与材料 | 19日确认、20日抽检反馈、22日修订、25日11点完整发件 | 原定稿历史冻结；solo今天的新确认另记 |\n| 雨夜协助 | 24日18点起 | 林晚和见微20分钟、周栀10分钟、叶澄15分钟；不通电、不扩大用途 |\n| 隐瞒与施压 | 24日初核未完；施压20:30真撤回 | 25日陈序宁新答应十分钟补核；发生过的施压不删除 |\n| 告别展 | 26日新内容确认、27日14点岗位和15点后展示 | 原册子24页、40或60本；四本隔离，48元报价未下单未付款 |\n| 新工作与房间 | 26日本人接受岗位、核合同；30日16点交接与搬入 | 接受不等于入职；7月1日9点真到岗，新家自己的钥匙 |\n| 友情告别 | 26日两箱、28日装箱晚饭入口、29日原09:20车次 | 已搬和已送按真发生记录；朋友仍有自己的生活 |\n| 原址关灯 | 30日10点关灯和钥匙回执 | 新房间钥匙另记，不把书店迁出当重开原址 |\n| 自己的信 | 独处入口续18日草稿；朋友饭入口续19日新纸，30日另选封口 | 始终私存，两种9月30日真实读信，非展品，无录制 |\n| 普通朋友电话 | 30日另问7月6日19:00–19:10，6日实打 | 不替未完成旧谈话作答，不要求全时在线 |\n| 最终结局 | 9月30日秋日最后一句后 | self_forward，不补女朋友、约会或亲密事实 |\n\n';
text+='## 全部场景与回流\n\n~~~mermaid\nflowchart TD\n';
for(const s of data.scenes)text+=` ${s.id}["${clean(s.title)}"]\n`;
for(const g of data.gates)text+=` ${g.id}{"${g.redirectBy}"}\n`;
text+=' self_complete["最终结局收藏"]\n';
for(const s of data.scenes){if(s.choices)s.choices.forEach((c,i)=>text+=` ${s.id} -->|选择${i+1}| ${c.next}\n`);else text+=` ${s.id} --> ${s.next}\n`;}
for(const g of data.gates)for(const[k,id]of Object.entries(g.targets))text+=` ${g.id} -->|${k}| ${id}\n`;
text+='~~~\n\n对白与游戏唯一源为 `chapter-self-epilogue.js`；阅读版由 `node scripts/build_chapter.cjs` 生成。验证涵盖24种真实共通历史与全部384种选择，不穷举此前六章所有历史的笛卡尔积。\n';
fs.writeFileSync(path.join(root,'剧本/独身群像_分支结构.md'),text);
fs.writeFileSync(path.join(root,'剧本/self-epilogue-content-summary.json'),JSON.stringify({date:'2026-10-06',scenes:data.scenes.length,gates:data.gates.length,textCharacters:chars,combinations:384,chapters:23,finalEndings:13,cards:74,backgrounds:23,images:32,totalTextCharacters:require('./content_statistics.cjs')().totalTextCharacters},null,2));
console.log(JSON.stringify({scenes:data.scenes.length,gates:data.gates.length,textCharacters:chars,totalTextCharacters:require('./content_statistics.cjs')().totalTextCharacters}));
