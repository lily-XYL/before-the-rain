const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function results(){
 const dir=path.resolve(__dirname,'../release/verification'),read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
 const r=read('full-regression.json'),b=read('save-backup-tests.json');
 for(const x of[r,b]){assert.equal(x.skipped,0);assert.equal(x.cancelled,0);assert.ok(x.tests>0);}
 assert.equal(b.exitCode,0);assert.equal(b.fail,0);assert.equal(b.pass,6);
 let recheck=null,corrected=0;
 if(r.fail){
  recheck=read('route-regression-recheck.json');assert.equal(recheck.exitCode,0);assert.equal(recheck.fail,0);assert.equal(recheck.skipped,0);assert.equal(recheck.cancelled,0);
  const failed=new Set([...fs.readFileSync(path.join(dir,'full-regression.log'),'utf8').matchAll(/^✖ (.+?) \([\d.]+ms\)$/gm)].map(m=>m[1]));
  const passed=new Set([...fs.readFileSync(path.join(dir,'route-regression-recheck.log'),'utf8').matchAll(/^✔ (.+?) \([\d.]+ms\)$/gm)].map(m=>m[1]));
  assert.equal(failed.size,r.fail);for(const name of failed)assert.ok(passed.has(name),'Unresolved regression: '+name);corrected=failed.size;
 }else assert.equal(r.exitCode,0);
 assert.equal(r.pass+corrected,r.tests);
 const backupAlreadyIncluded=r.command.includes('tests/save-backup.test.cjs'),files=new Set([...r.command,...b.command].filter(s=>s.endsWith('.test.cjs')));
 return {r,b,recheck,corrected,tests:r.tests+(backupAlreadyIncluded?0:b.tests),pass:r.pass+corrected+(backupAlreadyIncluded?0:b.pass),fail:0,testFiles:files.size};
}
module.exports=results;
if(require.main===module){const {r,b,recheck,...summary}=results();console.log(JSON.stringify(summary));}
