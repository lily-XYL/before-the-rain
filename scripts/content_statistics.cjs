const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
module.exports=function(){const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sources=[...html.matchAll(/<script src="(chapter-[^"]+\.js)"/g)].map(m=>m[1]);
 const chapters=sources.map(file=>{const data=require('../'+file);let textCharacters=0;for(const s of data.scenes){for(const [,t]of [...s.lines,...Object.values(s.variants||{}).flat()])textCharacters+=Array.from(t).length;for(const c of s.choices||[])textCharacters+=Array.from(c.text).length;}return {file,scenes:data.scenes.length,gates:(data.gates||[]).length,textCharacters};});
 return {chapters,totalTextCharacters:chapters.reduce((n,c)=>n+c.textCharacters,0)};
};
