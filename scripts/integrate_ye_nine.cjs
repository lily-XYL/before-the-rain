const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
function edit(file, fn) { const p = path.join(root, file); fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8'))); }
edit('story.js', s => s.replace("'ye_eight_complete'].includes", "'ye_eight_complete', 'ye_nine_complete'].includes"));
edit('index.html', s => s.replace('叶澄第七、八章</small>', '叶澄第七至九章</small>'));
edit('app.js', s => {
  if (!s.includes("id.startsWith('y9_')")) s = s.replace("id.startsWith('y8_') ?", "id.startsWith('y9_') ? '在叶澄线第九章，分清维修与影片用途，回应雨夜的工作和私人需要。' : id.startsWith('y8_') ?");
  return s.replace('五十八种章节回忆', '六十一种章节回忆').replace('叶澄第七、八章可读', '叶澄第七至九章可读');
});
