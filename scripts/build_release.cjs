const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),version='1.0.0',name='雨停之前_v'+version,dest=path.join(root,'release',name),stage=process.argv.includes('--stage');
const story=require('../story.js'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
const vm=require('node:vm'),box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/characters/v1/cast.js'),'utf8'),box);
const files=[...new Set(['index.html','styles.css','chapter-styles.css','启动游戏.bat','assets/cover.png',...scripts,...Object.values(story.locations).map(l=>l.image),...box.window.RainCast.map(c=>'assets/characters/v1/'+c.id+'.png'),'assets/characters/v1/ye_cheng_no_camera.png'])].sort();
if(fs.existsSync(dest)&&!fs.existsSync(path.join(dest,'release-manifest.json')))throw new Error('Release folder already exists without our manifest; refusing to overwrite it.');
if(!stage)require('./check_release_results.cjs')();
fs.mkdirSync(dest,{recursive:true});
for(const file of files){const from=path.join(root,file),to=path.resolve(dest,file);assert.ok(to.startsWith(dest+path.sep));fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}
const help=`雨停之前 · 本地完整版 v${version}\n\n解压整个文件夹，双击“启动游戏.bat”，或用 Edge / Chrome / Firefox 打开 index.html。请保留 assets 文件夹与所有同目录文件。无需联网或安装依赖。\n\n内容：共通六章、四条恋爱线各四章、独身群像收束篇与秋日尾声；23个章节条目、13个最终结局、74张收藏卡。\n\n操作：点击对白或按空格 / Enter 继续；选项停下来等你选择；Esc 打开菜单。文字速度、音乐与音量在设置里调整，自动播放在选项处暂停。\n\n存档迁移：若之前已在原目录游玩，先在原游戏“设置 → 故事备份 → 导出备份”；再打开这个发布包，选择“设置 → 故事备份 → 导入备份”。确认后可继续故事或读取书签。不同目录或浏览器的存档不会自动互通，请先导出备份。导入替换备份中的同名存档，其他书签保留，收藏合并。\n\n原项目文件和浏览器进度没有被打包操作修改；迁移后请保留备份文件。程序合成音乐，无配音。\n`;
fs.writeFileSync(path.join(dest,'开始前读我.txt'),'\ufeff'+help,'utf8');
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(dest,file))).digest('hex');
const included=[...files,'开始前读我.txt'].sort();
const manifest={product:'雨停之前',version,builtAt:new Date().toISOString(),verification:stage?'pending':'passed',chapters:23,finalEndings:13,cards:74,textCharacters:JSON.parse(fs.readFileSync(path.join(root,'release/verification/content-audit.json'),'utf8')).textCharacters,files:included.map(file=>({path:file,bytes:fs.statSync(path.join(dest,file)).size,sha256:sha(file)}))};
fs.writeFileSync(path.join(dest,'release-manifest.json'),JSON.stringify(manifest,null,2));
for(const f of manifest.files)assert.equal(sha(f.path),f.sha256);console.log(JSON.stringify({stage,directory:dest,files:manifest.files.length+1,bytes:manifest.files.reduce((a,b)=>a+b.bytes,0)}));
