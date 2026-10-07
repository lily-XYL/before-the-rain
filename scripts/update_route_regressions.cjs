const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const file of ['chapter-seven-lin.test.cjs','chapter-seven-xu.test.cjs','chapter-seven-zhou.test.cjs','chapter-seven-ye.test.cjs','chapter-eight-ye.test.cjs']){
 const p=path.join(root,'tests',file);let s=fs.readFileSync(p,'utf8');
 s=s.replaceAll("'y7_morning_0', null]","'y7_morning_0', 's7_morning_0']").replaceAll("'y7_morning_0',null]","'y7_morning_0','s7_morning_0']");
 if(file==='chapter-seven-lin.test.cjs')s=s.replace('} else assert.strictEqual(next, old);',"} else {\n      assert.equal(next.node, 's7_morning_0'); assert.equal(next.ending, null);\n      assert.deepEqual(next.flags, old.flags); assert.deepEqual(next.history, old.history); assert.deepEqual(next.choices, old.choices);\n    }");
 fs.writeFileSync(p,s);
}
