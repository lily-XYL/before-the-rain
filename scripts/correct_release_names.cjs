const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const file of fs.readdirSync(root).filter(f=>/^chapter-.*\.js$/.test(f))){const p=path.join(root,file),old=fs.readFileSync(p,'utf8'),next=old.replaceAll('陈叙宁','陈序宁');if(next!==old){fs.writeFileSync(p,next);console.log(file);}}
