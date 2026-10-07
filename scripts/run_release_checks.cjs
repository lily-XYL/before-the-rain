const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'release/verification');
fs.mkdirSync(out,{recursive:true});
const backupOnly=process.argv.includes('--backup-only'),routesOnly=process.argv.includes('--routes-only');
const files=backupOnly?['tests/save-backup.test.cjs']:routesOnly?['tests/chapter-seven-lin.test.cjs','tests/chapter-seven-xu.test.cjs','tests/chapter-seven-zhou.test.cjs','tests/chapter-seven-ye.test.cjs','tests/chapter-eight-ye.test.cjs']:fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.test.cjs')).sort().map(f=>'tests/'+f);
const record=backupOnly?'save-backup-tests':routesOnly?'route-regression-recheck':'full-regression';
const args=['--test','--test-concurrency=4','--test-reporter=spec',...(routesOnly?['--test-name-pattern=Released.*saves|Only the selected']:[]),...files],start=Date.now();
const p=spawn(process.execPath,args,{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe']});
let log='';
function capture(b){const s=b.toString('utf8');log+=s;process.stdout.write(s);fs.writeFileSync(path.join(out,record+'.log'),log);}
p.stdout.on('data',capture);p.stderr.on('data',capture);
p.on('error',e=>{capture(Buffer.from(e.stack));process.exitCode=1;});
p.on('close',code=>{const clean=log.replace(/\x1b\[[0-9;]*m/g,''),get=n=>Number((clean.match(new RegExp('(?:ℹ|#) '+n+' (\\d+)'))||[])[1]||0);const result={date:new Date().toISOString(),command:[process.execPath,...args],testFiles:files.length,tests:get('tests'),pass:get('pass'),fail:get('fail'),cancelled:get('cancelled'),skipped:get('skipped'),durationSeconds:(Date.now()-start)/1000,exitCode:code};fs.writeFileSync(path.join(out,record+'.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));process.exitCode=code===0?0:1;});
