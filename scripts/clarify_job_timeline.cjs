const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const file of ['chapter-ten-zhou.js','chapter-ten-ye.js','chapter-self-epilogue.js']){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
 if(s.includes('原九月到岗改成七月提前开始'))continue;
 s=file==='chapter-self-epilogue.js'?s.replace('正式岗位回复到来，附件写清','正式岗位回复到来，询问我是否愿意将原九月到岗改成七月提前开始，附件写清'):s.replace('编辑回复两份样本，','编辑回复两份样本，问我愿不愿将原九月到岗改成七月提前开始，');
 fs.writeFileSync(p,s);
}
