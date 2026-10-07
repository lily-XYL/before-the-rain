const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createRequire}=require('node:module');
const story=require('../story.js'),engine=require('../engine.js'),{finish,ninthBoundary}=require('../tests/ye-helpers.cjs');
function boundaryFromTest(route){const file=path.resolve(__dirname,'../tests/chapter-ten-'+route+'.test.cjs'),source=fs.readFileSync(file,'utf8'),ctx=vm.createContext({require:createRequire(file)});return vm.runInContext(source.slice(0,source.indexOf('const contexts'))+'\nboundary;',ctx);}
function finals(){const found={};
 for(const route of ['lin','xu','zhou','ye']){
  const boundary=route==='ye'?ninthBoundary:boundaryFromTest(route);
  history: for(let w=0;w<3;w++)for(let o=0;o<4;o++)for(let p=0;p<2;p++){
   const b=boundary(w,o,p);for(const contact of [0,1])for(const end of [0,1]){const ds=[0,0,0,0,0,contact,end],s=finish(engine.continueChapter(story,b),ds);found[s.ending]??=s;}
   if(['he','ne','farewell'].every(e=>found[route+'_'+e]))break history;
  }
 }
 const b=require('../tests/self-helpers.cjs').contexts[0];found.self_forward=finish(engine.continueChapter(story,b),[0,0,0,0,0,0,0]);return found;
}
module.exports={finals,story,engine};
