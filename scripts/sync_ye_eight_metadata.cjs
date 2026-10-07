const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
function edit(file, fn) { const p = path.join(root, file); fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8'))); }
edit('README.md', s => {
  s = s.replace('以及叶澄线第七章可玩', '以及叶澄线第七、八章可玩').replace(/叶澄第八至十章/g, '叶澄第九至十章');
  const bullet = '- 叶澄线第八章《镜头背后的人》：六月二十二日至二十四日早晨，101 个场景、15,497 个正文与选项字符，八次选择共 1,296 种组合。兑现原目录核对、到货、三本抽检、自己的当轮修订和已获准私人电话；原暂停实际回应后另问新的电话与沿河见面。叶澄讲灯、母亲晚归与开始拍照，知夏也讲自己的需要；索要全部过去得到拒绝，实际收回后再分别确认女朋友、继续了解或暂停。接吻、拥抱、不接触、新合照和晚间安排独立；新照片只彼此私存，不进影片。恋人可到住处晚饭并另问留宿、只晚饭送行或不去，了解与暂停有完整后续。次日真实早餐或原9点半电话回收；三个阶段回忆非最终结局，第九至十章待制作。\n';
  if (!s.includes('- 叶澄线第八章《镜头背后的人》')) s = s.replace('- 共通线二十五种、', bullet + '- 共通线二十五种、');
  s = s.replace('叶澄第七章三种阶段回忆，共五十五种', '叶澄第七、八章六种阶段回忆，共五十八种').replace('总计六十四张收藏卡', '总计六十七张收藏卡').replace('243,397 字符', '258,894 字符');
  s = s.replace('三个个人线第七至九章末', '三条已完成个人线第七至九章末');
  s = s.replace('叶澄无相机变体与二十个背景', '叶澄无相机变体与二十一个背景').replace('见微住处、周栀住处。', '见微住处、周栀住处、叶澄住处。');
  s = s.replace('`chapter-seven-ye.js` 是叶澄第七章文本源', '`chapter-seven-ye.js` 与 `chapter-eight-ye.js` 是叶澄第七、八章文本源');
  s = s.replace('最新为 `叶澄线_第七章_请先问过我.md` 和 `叶澄线_第七章_分支结构.md`', '最新为 `叶澄线_第八章_镜头背后的人.md` 和 `叶澄线_第八章_分支结构.md`');
  s = s.replace('五十五种章节回忆单独计数', '五十八种章节回忆单独计数');
  s = s.replace('叶澄第七章使用独立标识 `ye7`；原第六章叶澄方向存档可直接继续，无需重玩。', '叶澄第七、八章使用独立标识 `ye7`、`ye8`；原第六章及第七章末叶澄方向存档可直接继续，无需重玩。');
  s = s.replace('tests/chapter-seven-ye.test.cjs`。覆盖前两章', 'tests/chapter-seven-ye.test.cjs tests/chapter-eight-ye.test.cjs`。覆盖前两章');
  const validation = '叶澄第八章验证：`node --test tests/chapter-eight-ye.test.cjs`。十二种真实七章历史 × 全部1,296种本章组合，共15,552条路径，覆盖全部可显示对白；旧工作待办、相机范围、候选与七章已发生事实保留。检查原与新私人电话、工作限定见面、过去的表达与拒绝、实际撤回索要相册、双方确认恋人、身体与记录及留宿独立、早餐与次日通话真实发生、旧七章末存档续接、跨七次章末逐节点恢复、篡改拒绝与分歧重放。未穷举此前所有历史的笛卡尔积。浏览器验证脚本为 `scripts/verify_ye_eight_browser.cjs`，记录见 `剧本/叶澄线_第八章_验证记录.md`。\n\n';
  if (!s.includes('叶澄第八章验证：')) s = s.replace('本次完整回归：', validation + '上次第七章完整回归：');
  if (!s.includes('叶澄第八章使用内置')) s += '\n叶澄第八章使用内置 `image_gen.imagegen` 生成叶澄住处背景，保存于 `assets/backgrounds/chapter-eight-ye/ye_home.png`，完整提示词与原始输出路径见同目录 `生成记录.json`；旧背景保留。图像已经接入住处晚饭、留宿与早餐场景，无相机立绘沿用第七章变体。\n';
  return s;
});
edit('故事大纲_v2_成人恋爱版.md', s => s.replace('叶澄第七章《请先问过我》已接入，第八至十章与独身收束篇待制作', '叶澄第七章《请先问过我》与第八章《镜头背后的人》已接入，第九至十章与独身收束篇待制作'));
for (const file of ['剧本/共通线六章_详细场景表.md', '剧本/第六章_分支结构.md']) edit(file, s => s.replace(/叶澄第七章已实装，第八至十章待制作/g, '叶澄第七、八章已实装，第九至十章待制作').replace(/叶澄第七章.*第八至十章待制作/g, line => line.replace('第七章', '第七、八章').replace('第八至十章', '第九至十章')));
edit('剧本/叶澄线_四章路线场景表.md', s => s.replace('另問', '另问').replace('不補', '不补'));
